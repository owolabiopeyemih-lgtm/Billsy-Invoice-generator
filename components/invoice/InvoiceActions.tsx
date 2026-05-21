"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useInvoice } from "./InvoiceContext";
import { Download, Check, Loader2, AlertCircle, Save } from "lucide-react";

interface Props {
  offscreenRef: React.RefObject<HTMLDivElement | null>;
}

async function buildPDFBlob(
  offscreenRef: React.RefObject<HTMLDivElement | null>,
  invoiceNumber: string,
): Promise<{ blob: Blob; fileName: string }> {
  const source = offscreenRef.current;
  if (!source) throw new Error("Invoice preview element is not mounted.");

  await document.fonts.ready;
  await Promise.all(
    Array.from(source.querySelectorAll("img")).map((img) =>
      img.complete ? Promise.resolve()
        : new Promise<void>((res) => { img.onload = img.onerror = () => res(); })
    )
  );

  const clone = source.cloneNode(true) as HTMLElement;
  clone.removeAttribute("id");
  clone.style.cssText = [
    clone.style.cssText,
    "position:fixed;top:0;left:0;z-index:-1;pointer-events:none;",
  ].join(";");
  document.body.appendChild(clone);

  try {
    const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);

    const canvas = await html2canvas(clone, {
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
  } finally {
    document.body.removeChild(clone);
  }
}

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

export function InvoiceActions({ offscreenRef }: Props) {
  const { invoice, save, saveError } = useInvoice();
  const [saved, setSaved] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  function handleSave() {
    save();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

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

  return (
    <div className="flex items-center gap-2">
      {(saveError || pdfError) && (
        <span className="hidden sm:flex items-center gap-1 text-xs text-destructive max-w-[180px] truncate">
          <AlertCircle size={12} className="shrink-0" />
          {saveError ?? pdfError}
        </span>
      )}

      <Button size="sm" onClick={handleSave} className="gap-1.5">
        {saved ? <Check size={14} /> : <Save size={14} />}
        <span>{saved ? "Saved!" : "Save"}</span>
      </Button>

      <Button variant="outline" size="sm" onClick={handleDownloadPDF} disabled={pdfLoading} className="gap-1.5">
        {pdfLoading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
        <span className="hidden sm:inline">Download PDF</span>
        <span className="sm:hidden">PDF</span>
      </Button>
    </div>
  );
}
