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
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { InvoiceStatus } from "@/types/invoice";

const PREVIEW_WIDTH = 794;

/**
 * Scales the InvoicePreview to fill its container width.
 * Uses ResizeObserver so it reacts to panel resize correctly.
 * The inner content element is measured to compute the correct
 * visual height so the container never over- or under-allocates space.
 */
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

    // Watch both the container (panel resize) and the inner content (invoice changes)
    const obs = new ResizeObserver(measure);
    obs.observe(container);
    obs.observe(inner);
    measure();
    return () => obs.disconnect();
  }, []);

  return (
    // Container collapses to exactly the visual height of the scaled preview
    <div ref={containerRef} style={{ width: "100%", height: scaledHeight ?? "auto", overflow: "hidden" }}>
      <div
        ref={innerRef}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: `${PREVIEW_WIDTH}px`,
        }}
      >
        <InvoicePreview invoice={invoice} />
      </div>
    </div>
  );
}

function EditorInner() {
  const { invoice } = useInvoice();
  const router = useRouter();
  // Off-screen preview — unscaled, always in DOM, used for PDF generation
  const offscreenRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white border-b px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Brand */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <LayoutDashboard size={12} className="text-primary-foreground" />
            </div>
            <span className="font-bold text-base tracking-tight">Billsy</span>
          </div>

          <span className="text-muted-foreground">|</span>

          {/* Dashboard back button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/")}
            className="gap-1.5 text-muted-foreground hover:text-foreground -ml-1 hidden sm:flex"
          >
            <ArrowLeft size={14} />
            Dashboard
          </Button>

          <span className="text-muted-foreground hidden sm:inline">/</span>

          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold text-sm truncate">{invoice.invoiceNumber}</span>
            {invoice.client.name && (
              <>
                <span className="text-muted-foreground hidden sm:inline">·</span>
                <span className="text-sm text-muted-foreground truncate hidden sm:inline max-w-[160px]">
                  {invoice.client.name}
                </span>
              </>
            )}
            <Badge
              variant={
                ({ draft: "secondary", sent: "default", paid: "outline", overdue: "destructive" } as Record<InvoiceStatus, "secondary" | "default" | "outline" | "destructive">)[invoice.status]
              }
              className="capitalize text-xs hidden sm:inline-flex"
            >
              {invoice.status}
            </Badge>
          </div>
        </div>
        <InvoiceActions offscreenRef={offscreenRef} />
      </header>

      <main className="max-w-[1400px] mx-auto px-4 py-6 grid grid-cols-1 xl:grid-cols-[1fr_820px] gap-6 items-start">
        {/* Left: Form */}
        <div className="space-y-4">
          <Tabs defaultValue="details">
            <TabsList className="w-full">
              <TabsTrigger value="details" className="flex-1">Invoice Details</TabsTrigger>
              <TabsTrigger value="appearance" className="flex-1">Appearance</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 mt-4">
              <Card className="p-5"><InvoiceMetaForm /></Card>
              <Card className="p-5"><BusinessForm /></Card>
              <Card className="p-5"><ClientForm /></Card>
              <Card className="p-5 space-y-4">
                <LineItemsForm />
                <Separator />
                <TotalsPanel />
              </Card>
              <Card className="p-5"><PaymentForm /></Card>
              <Card className="p-5"><NotesTermsForm /></Card>
            </TabsContent>

            <TabsContent value="appearance" className="mt-4">
              <Card className="p-5"><TemplateSettings /></Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right: Live Preview */}
        <div className="hidden xl:block sticky top-[73px]">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 font-medium">Preview</p>
          <div className="rounded-lg shadow-sm border bg-gray-200 p-3">
            <ScaledPreview invoice={invoice} />
          </div>
        </div>
      </main>

      {/* Off-screen preview — full 794 px, no transforms, always rendered for PDF */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: "-9999px",
          width: `${PREVIEW_WIDTH}px`,
          zIndex: -1,
          pointerEvents: "none",
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
