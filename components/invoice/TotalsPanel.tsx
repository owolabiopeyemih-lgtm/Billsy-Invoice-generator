"use client";

import { useInvoice } from "./InvoiceContext";
import { calcTotals, formatCurrency } from "@/types/invoice";
import { Separator } from "@/components/ui/separator";

export function TotalsPanel() {
  const { invoice } = useInvoice();
  const { subtotal, totalTax, grand } = calcTotals(invoice.lineItems);
  const fmt = (n: number) => formatCurrency(n, invoice.settings.currency);

  return (
    <div className="flex justify-end">
      <div className="w-56 space-y-2 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span className="tabular-nums">{fmt(subtotal)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Tax</span>
          <span className="tabular-nums">{fmt(totalTax)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-semibold text-base">
          <span>Total Due</span>
          <span className="tabular-nums">{fmt(grand)}</span>
        </div>
      </div>
    </div>
  );
}
