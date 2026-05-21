"use client";

import { useRef, useEffect, useState } from "react";
import { Invoice } from "@/types/invoice";
import { useRouter } from "next/navigation";
import { InvoiceProvider, useInvoice } from "./InvoiceContext";
import { InvoiceMetaForm } from "./InvoiceMetaForm";
import { BusinessForm } from "./BusinessForm";
import { ClientForm } from "./ClientForm";
import { LineItemsForm } from "./LineItemsForm";
import { TotalsPanel } from "./TotalsPanel";
import { NotesTermsForm } from "./NotesTermsForm";
import { PaymentForm } from "./PaymentForm";
import { TemplateSettings } from "./TemplateSettings";
import { InvoiceActions } from "./InvoiceActions";
import { InvoicePreview } from "./InvoicePreview";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import { InvoiceStatus } from "@/types/invoice";

const PREVIEW_WIDTH = 794;

function ScaledPreview({ invoice }: { invoice: Invoice }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    function measure() {
      const availableWidth = container!.clientWidth;
      const newScale = Math.min(1, availableWidth / PREVIEW_WIDTH);
      const naturalHeight = inner!.scrollHeight;
      setScale(newScale);
      setScaledHeight(Math.ceil(naturalHeight * newScale));
    }

    const obs = new ResizeObserver(measure);
    obs.observe(container);
    obs.observe(inner);
    measure();
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", height: scaledHeight ?? "auto", overflow: "hidden" }}>
      <div
        ref={innerRef}
        style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: `${PREVIEW_WIDTH}px` }}
      >
        <InvoicePreview invoice={invoice} />
      </div>
    </div>
  );
}

const STATUS_VARIANT: Record<InvoiceStatus, "secondary" | "default" | "outline" | "destructive"> = {
  draft: "secondary", sent: "default", paid: "outline", overdue: "destructive",
};

function EditorInner() {
  const { invoice } = useInvoice();
  const router = useRouter();
  const offscreenRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-white border-b px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Left — brand + breadcrumb */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* Brand */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <LayoutDashboard size={12} className="text-primary-foreground" />
            </div>
            <span className="font-bold text-sm tracking-tight hidden xs:inline">Billsy</span>
          </div>

          {/* Back to dashboard */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/")}
            className="gap-1 text-muted-foreground hover:text-foreground px-2 hidden sm:flex"
          >
            <ArrowLeft size={13} />
            <span className="text-xs">Dashboard</span>
          </Button>

          {/* Mobile back arrow only */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/")}
            className="h-7 w-7 text-muted-foreground sm:hidden"
          >
            <ArrowLeft size={14} />
          </Button>

          <span className="text-muted-foreground text-xs hidden sm:inline">/</span>

          {/* Invoice identity */}
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-semibold text-xs sm:text-sm truncate max-w-[80px] sm:max-w-none">
              {invoice.invoiceNumber}
            </span>
            {invoice.client.name && (
              <span className="text-xs text-muted-foreground truncate max-w-[100px] hidden md:inline">
                · {invoice.client.name}
              </span>
            )}
            <Badge
              variant={STATUS_VARIANT[invoice.status]}
              className="capitalize text-xs hidden sm:inline-flex"
            >
              {invoice.status}
            </Badge>
          </div>
        </div>

        {/* Right — actions */}
        <InvoiceActions offscreenRef={offscreenRef} />
      </header>

      {/* ── Main ── */}
      <main className="max-w-[1400px] mx-auto px-3 sm:px-4 py-4 sm:py-6 grid grid-cols-1 xl:grid-cols-[1fr_820px] gap-6 items-start">
        {/* Left: Form + tabs */}
        <div className="space-y-4">
          <Tabs defaultValue="details">
            <TabsList className="w-full">
              <TabsTrigger value="details" className="flex-1 text-xs sm:text-sm">Details</TabsTrigger>
              <TabsTrigger value="appearance" className="flex-1 text-xs sm:text-sm">Style</TabsTrigger>
              {/* Preview tab only shows on non-xl screens */}
              <TabsTrigger value="preview" className="flex-1 text-xs sm:text-sm xl:hidden">Preview</TabsTrigger>
            </TabsList>

            {/* ── Details tab ── */}
            <TabsContent value="details" className="space-y-3 sm:space-y-4 mt-4">
              <Card className="p-4 sm:p-5"><InvoiceMetaForm /></Card>
              <Card className="p-4 sm:p-5"><BusinessForm /></Card>
              <Card className="p-4 sm:p-5"><ClientForm /></Card>
              <Card className="p-4 sm:p-5 space-y-4">
                <LineItemsForm />
                <Separator />
                <TotalsPanel />
              </Card>
              <Card className="p-4 sm:p-5"><PaymentForm /></Card>
              <Card className="p-4 sm:p-5"><NotesTermsForm /></Card>
            </TabsContent>

            {/* ── Style tab ── */}
            <TabsContent value="appearance" className="mt-4">
              <Card className="p-4 sm:p-5"><TemplateSettings /></Card>
            </TabsContent>

            {/* ── Preview tab — mobile/tablet only ── */}
            <TabsContent value="preview" className="mt-4 xl:hidden">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 font-medium">
                Invoice Preview
              </p>
              <div className="rounded-lg shadow-sm border bg-gray-200 p-3">
                <ScaledPreview invoice={invoice} />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right: Live preview — desktop xl+ only */}
        <div className="hidden xl:block sticky top-[57px]">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 font-medium">Preview</p>
          <div className="rounded-lg shadow-sm border bg-gray-200 p-3">
            <ScaledPreview invoice={invoice} />
          </div>
        </div>
      </main>

      {/* Off-screen render for PDF capture */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed", top: 0, left: "-9999px",
          width: `${PREVIEW_WIDTH}px`, zIndex: -1, pointerEvents: "none",
        }}
      >
        <InvoicePreview ref={offscreenRef} invoice={invoice} />
      </div>

      {/* Print-only layout */}
      <style>{`
        @media print {
          body > * { display: none !important; }
          #billsy-print-frame { display: block !important; position: fixed; inset: 0; background: white; }
        }
      `}</style>
      <div id="billsy-print-frame" style={{ display: "none" }}>
        <InvoicePreview invoice={invoice} />
      </div>
    </div>
  );
}

export function InvoiceEditor({ initial }: { initial: Invoice }) {
  return (
    <InvoiceProvider initial={initial}>
      <EditorInner />
    </InvoiceProvider>
  );
}
