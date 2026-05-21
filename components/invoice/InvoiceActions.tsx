"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useInvoice } from "./InvoiceContext";
import { deleteInvoice } from "@/lib/storage";
import {
  Download, Mail, Link2, Printer, Trash2, Check,
  Share2, Loader2, AlertCircle, MessageCircle, Copy, ImageIcon,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface Props {
  offscreenRef: React.RefObject<HTMLDivElement | null>;
}

// ── Shared canvas capture ──────────────────────────────────────────────────

async function captureCanvas(source: HTMLElement): Promise<HTMLCanvasElement> {
  const clone = source.cloneNode(true) as HTMLElement;
  clone.removeAttribute("id");
  clone.style.cssText = [
    clone.style.cssText,
    "position:fixed;top:0;left:0;z-index:-1;pointer-events:none;",
  ].join(";");
  document.body.appendChild(clone);

  try {
    const { default: html2canvas } = await import("html2canvas");
    return await html2canvas(clone, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: 794,
      windowWidth: 794,
      onclone: (_doc) => {
        _doc.querySelectorAll('link[rel="stylesheet"], style').forEach((el) => el.remove());
      },
    });
  } finally {
    document.body.removeChild(clone);
  }
}

async function getSource(offscreenRef: React.RefObject<HTMLDivElement | null>) {
  const source = offscreenRef.current;
  if (!source) throw new Error("Invoice preview element is not mounted.");
  await document.fonts.ready;
  await Promise.all(
    Array.from(source.querySelectorAll("img")).map((img) =>
      img.complete ? Promise.resolve()
        : new Promise<void>((res) => { img.onload = img.onerror = () => res(); })
    )
  );
  return source;
}

// ── PDF blob ───────────────────────────────────────────────────────────────

async function buildPDFBlob(
  offscreenRef: React.RefObject<HTMLDivElement | null>,
  invoiceNumber: string,
): Promise<{ blob: Blob; fileName: string }> {
  const source = await getSource(offscreenRef);
  const canvas = await captureCanvas(source);
  const { default: jsPDF } = await import("jspdf");

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const PAGE_W = 210, PAGE_H = 297;
  const imgH = (canvas.height / canvas.width) * PAGE_W;
  let remaining = imgH, yOffset = 0, page = 0;
  while (remaining > 0) {
    if (page > 0) pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, -yOffset, PAGE_W, imgH);
    yOffset += PAGE_H; remaining -= PAGE_H; page++;
  }

  const blob = pdf.output("blob");
  if (blob.size < 500) throw new Error("PDF came out empty — please try again.");
  const fileName = `${invoiceNumber}.pdf`.replace(/\s+/g, "-").toLowerCase();
  return { blob, fileName };
}

// ── Image blob ─────────────────────────────────────────────────────────────

async function buildImageBlob(
  offscreenRef: React.RefObject<HTMLDivElement | null>,
  invoiceNumber: string,
): Promise<{ blob: Blob; fileName: string }> {
  const source = await getSource(offscreenRef);
  const canvas = await captureCanvas(source);
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => b ? resolve(b) : reject(new Error("Image export failed")), "image/png")
  );
  const fileName = `${invoiceNumber}.png`.replace(/\s+/g, "-").toLowerCase();
  return { blob, fileName };
}

// ── Download helper ────────────────────────────────────────────────────────

function triggerDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  try {
    const a = document.createElement("a");
    a.href = url; a.download = fileName; a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch {
    window.open(url, "_blank");
  }
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

// ── Component ──────────────────────────────────────────────────────────────

export function InvoiceActions({ offscreenRef }: Props) {
  const { invoice, save, isDirty, saveError } = useInvoice();
  const router = useRouter();

  const [copied, setCopied] = useState(false);
  const [imageCopied, setImageCopied] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // Prepared blobs shown in the share dialog
  const [readyPDF, setReadyPDF] = useState<{ blob: Blob; fileName: string } | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const anyLoading = pdfLoading || imgLoading;

  // ── Copy invoice as image to clipboard ──────────────────────────────────
  async function handleCopyImage() {
    save();
    setImgLoading(true);
    setPdfError(null);
    try {
      const { blob } = await buildImageBlob(offscreenRef, invoice.invoiceNumber);
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setImageCopied(true);
      setTimeout(() => setImageCopied(false), 2500);
    } catch (err) {
      // Clipboard API blocked — fall back to downloading the image
      try {
        const { blob, fileName } = await buildImageBlob(offscreenRef, invoice.invoiceNumber);
        triggerDownload(blob, fileName);
      } catch {
        setPdfError(err instanceof Error ? err.message : "Could not copy image.");
      }
    } finally {
      setImgLoading(false);
    }
  }

  // ── Open share dialog (PDF ready inside) ────────────────────────────────
  async function handleSharePDF() {
    save();
    setPdfLoading(true);
    setPdfError(null);
    try {
      const result = await buildPDFBlob(offscreenRef, invoice.invoiceNumber);
      setReadyPDF(result);
      setShareDialogOpen(true);
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setPdfError(err.message || "Could not generate PDF.");
      }
    } finally {
      setPdfLoading(false);
    }
  }

  // ── Share actions — called from dialog (fresh user gesture) ─────────────
  async function shareViaSystem() {
    if (!readyPDF) return;
    // Prefer image for broader app compatibility, fall back to PDF
    try {
      const { blob: imgBlob, fileName: imgName } = await buildImageBlob(offscreenRef, invoice.invoiceNumber);
      const imageFile = new File([imgBlob], imgName, { type: "image/png" });
      const pdfFile  = new File([readyPDF.blob], readyPDF.fileName, { type: "application/pdf" });

      const filesToShare = navigator.canShare?.({ files: [imageFile] }) ? [imageFile]
        : navigator.canShare?.({ files: [pdfFile] }) ? [pdfFile] : null;

      if (filesToShare) {
        await navigator.share({
          title: `Invoice ${invoice.invoiceNumber}`,
          text: `Invoice from ${invoice.business.name || "Billsy"}`,
          files: filesToShare,
        });
        setShareDialogOpen(false);
      } else {
        triggerDownload(readyPDF.blob, readyPDF.fileName);
        setShareDialogOpen(false);
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        triggerDownload(readyPDF.blob, readyPDF.fileName);
        setShareDialogOpen(false);
      }
    }
  }

  async function shareImageToApp() {
    if (!readyPDF) return;
    try {
      const { blob, fileName } = await buildImageBlob(offscreenRef, invoice.invoiceNumber);
      const file = new File([blob], fileName, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `Invoice ${invoice.invoiceNumber}`,
          files: [file],
        });
        setShareDialogOpen(false);
      } else {
        // Desktop — copy image to clipboard so user can paste anywhere
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        setImageCopied(true);
        setTimeout(() => setImageCopied(false), 2500);
        setShareDialogOpen(false);
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setPdfError(err.message || "Could not share image.");
      }
    }
  }

  function shareViaWhatsApp() {
    if (!readyPDF) return;
    triggerDownload(readyPDF.blob, readyPDF.fileName);
    const msg = encodeURIComponent(
      `Hi ${invoice.client.name || "there"},\n\nPlease find invoice *${invoice.invoiceNumber}* from ${invoice.business.name || "us"} attached.\n\nThank you!`
    );
    const phone = invoice.client.phone.replace(/\D/g, "");
    window.open(phone ? `https://wa.me/${phone}?text=${msg}` : `https://wa.me/?text=${msg}`, "_blank");
  }

  function shareViaEmail() {
    if (!readyPDF) return;
    triggerDownload(readyPDF.blob, readyPDF.fileName);
    const subject = encodeURIComponent(`Invoice ${invoice.invoiceNumber} from ${invoice.business.name}`);
    const body = encodeURIComponent(
      `Hi ${invoice.client.name || "there"},\n\nPlease find invoice ${invoice.invoiceNumber} attached.\n\nThank you,\n${invoice.business.name}`
    );
    window.open(`mailto:${invoice.client.email}?subject=${subject}&body=${body}`);
  }

  function downloadPDF() {
    if (!readyPDF) return;
    triggerDownload(readyPDF.blob, readyPDF.fileName);
    setShareDialogOpen(false);
  }

  // ── other actions ────────────────────────────────────────────────────────
  async function handleDownloadPDF() {
    save();
    setPdfLoading(true);
    setPdfError(null);
    try {
      const result = await buildPDFBlob(offscreenRef, invoice.invoiceNumber);
      triggerDownload(result.blob, result.fileName);
    } catch (err) {
      setPdfError(err instanceof Error ? err.message : "PDF generation failed.");
    } finally {
      setPdfLoading(false);
    }
  }

  function handlePrint() { save(); window.print(); }

  function handleCopyLink() {
    const url = `${window.location.origin}/invoice/${invoice.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDelete() {
    if (confirm("Delete this invoice? This cannot be undone.")) {
      deleteInvoice(invoice.id);
      router.push("/");
    }
  }

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        {isDirty && (
          <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">
            Unsaved changes
          </Badge>
        )}
        {(saveError || pdfError) && (
          <span className="flex items-center gap-1 text-xs text-destructive max-w-xs truncate">
            <AlertCircle size={13} className="shrink-0" />
            {saveError ?? pdfError}
          </span>
        )}

        <Button variant="outline" size="sm" onClick={handleDownloadPDF} disabled={anyLoading} className="gap-1.5">
          {pdfLoading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
          Download PDF
        </Button>

        <Button variant="outline" size="sm" onClick={handleCopyImage} disabled={anyLoading} className="gap-1.5">
          {imgLoading ? <Loader2 size={14} className="animate-spin" />
            : imageCopied ? <Check size={14} className="text-green-600" />
            : <Copy size={14} />}
          {imageCopied ? "Copied!" : "Copy Image"}
        </Button>

        <Button variant="outline" size="sm" onClick={handleSharePDF} disabled={anyLoading} className="gap-1.5">
          {pdfLoading ? <Loader2 size={14} className="animate-spin" /> : <Share2 size={14} />}
          Share
        </Button>

        <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
          <Printer size={14} /> Print
        </Button>

        <Button variant="outline" size="sm" onClick={() => { handleCopyLink(); setLinkOpen(true); }} className="gap-1.5">
          {copied ? <Check size={14} /> : <Link2 size={14} />}
          Copy link
        </Button>

        <Button variant="ghost" size="sm" onClick={handleDelete} className="text-destructive hover:text-destructive">
          <Trash2 size={14} />
        </Button>
      </div>

      {/* ── Share dialog ──────────────────────────────────────────────────── */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 size={16} /> Share Invoice
            </DialogTitle>
            <DialogDescription>
              Choose how to send {readyPDF?.fileName}.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2 mt-1">

            {/* Share image — works in WhatsApp, Telegram, Instagram etc. */}
            <Button onClick={shareImageToApp} className="gap-2 justify-start">
              <ImageIcon size={15} />
              Share as Image
              <span className="ml-auto text-xs opacity-60">WhatsApp · Telegram · all apps</span>
            </Button>

            {/* Native OS share sheet with PDF */}
            <Button variant="outline" onClick={shareViaSystem} className="gap-2 justify-start">
              <Share2 size={15} />
              Share as PDF
              <span className="ml-auto text-xs opacity-60">Files · Drive · Email</span>
            </Button>

            <Separator />

            {/* WhatsApp with pre-filled message */}
            <Button variant="outline" onClick={shareViaWhatsApp} className="gap-2 justify-start text-[#25D366] border-[#25D366]/30 hover:bg-[#25D366]/5">
              <MessageCircle size={15} /> WhatsApp message + PDF
            </Button>

            {/* Email */}
            <Button variant="outline" onClick={shareViaEmail} className="gap-2 justify-start">
              <Mail size={15} /> Email + PDF
            </Button>

            <Separator />

            <Button variant="secondary" onClick={downloadPDF} className="gap-2 justify-start">
              <Download size={15} /> Download PDF only
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            <strong>Share as Image</strong> works in every app that accepts photos.
            WhatsApp and Email download the PDF first — then open the app so you can attach it.
          </p>
        </DialogContent>
      </Dialog>

      {/* ── Copy link dialog ──────────────────────────────────────────────── */}
      <Dialog open={linkOpen} onOpenChange={setLinkOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Share Invoice Link</DialogTitle>
            <DialogDescription>
              Copy the link below. The recipient must have the invoice saved in their browser to view it.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 mt-2">
            <code className="flex-1 text-xs bg-muted px-3 py-2 rounded truncate">
              {typeof window !== "undefined" ? `${window.location.origin}/invoice/${invoice.id}` : ""}
            </code>
            <Button size="sm" onClick={handleCopyLink} className="gap-1.5 shrink-0">
              {copied ? <Check size={14} /> : <Link2 size={14} />}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
