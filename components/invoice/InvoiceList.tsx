"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Invoice, calcTotals, formatCurrency, InvoiceStatus } from "@/types/invoice";
import { getInvoices, deleteInvoice, exportInvoicesJSON } from "@/lib/storage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Download, Trash2, FileText, ArrowRight } from "lucide-react";
import { format } from "date-fns";

const STATUS_VARIANT: Record<InvoiceStatus, "default" | "secondary" | "outline" | "destructive"> = {
  draft: "secondary",
  sent: "default",
  paid: "outline",
  overdue: "destructive",
};

function safeFmt(d: string) {
  try { return format(new Date(d), "MMM d, yyyy"); } catch { return d; }
}

export function InvoiceList() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    function load() { setInvoices(getInvoices()); }
    load();
    // Next.js App Router caches pages, so useEffect([]) may not re-run on
    // back-navigation. Re-load whenever the tab/window regains focus or
    // visibility so the list always reflects the latest saved invoices.
    document.addEventListener("visibilitychange", load);
    window.addEventListener("focus", load);
    return () => {
      document.removeEventListener("visibilitychange", load);
      window.removeEventListener("focus", load);
    };
  }, []);

  function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (confirm("Delete this invoice?")) {
      deleteInvoice(id);
      setInvoices(getInvoices());
    }
  }

  function handleExport() {
    const json = exportInvoicesJSON();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `billsy-invoices-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Invoices</h2>
        <div className="flex gap-2">
          {invoices.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
              <Download size={14} /> Export
            </Button>
          )}
          <Button size="sm" onClick={() => router.push("/invoice/new")} className="gap-1.5">
            <Plus size={14} /> New Invoice
          </Button>
        </div>
      </div>

      {invoices.length === 0 ? (
        <Card className="py-16 flex flex-col items-center gap-4 text-center">
          <FileText size={40} className="text-muted-foreground opacity-40" />
          <div>
            <p className="font-medium">No invoices yet</p>
            <p className="text-sm text-muted-foreground">Create your first invoice to get started</p>
          </div>
          <Button onClick={() => router.push("/invoice/new")} className="gap-1.5">
            <Plus size={14} /> Create Invoice
          </Button>
        </Card>
      ) : (
        <div className="divide-y divide-border rounded-lg border overflow-hidden">
          {invoices.map((inv) => {
            const { grand } = calcTotals(inv.lineItems);
            return (
              <div
                key={inv.id}
                onClick={() => router.push(`/invoice/${inv.id}`)}
                className="flex items-center gap-3 px-3 sm:px-4 py-3 sm:py-3.5 bg-white hover:bg-muted/40 cursor-pointer transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm font-medium">{inv.invoiceNumber}</span>
                    <Badge variant={STATUS_VARIANT[inv.status]} className="capitalize text-xs">{inv.status}</Badge>
                    {inv.isRecurring && <Badge variant="outline" className="text-xs hidden sm:inline-flex">Recurring</Badge>}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground truncate mt-0.5">
                    {inv.client.name || "No client"}
                    <span className="hidden sm:inline"> · Due {safeFmt(inv.dueDate)}</span>
                    <span className="sm:hidden"> · {safeFmt(inv.dueDate)}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-semibold tabular-nums text-sm">
                    {formatCurrency(grand, inv.settings.currency)}
                  </div>
                  <div className="text-xs text-muted-foreground hidden sm:block">{safeFmt(inv.issueDate)}</div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive h-7 w-7"
                  onClick={(e) => handleDelete(inv.id, e)}
                >
                  <Trash2 size={13} />
                </Button>
                <ArrowRight size={14} className="text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
