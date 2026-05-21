"use client";

import { useInvoice } from "./InvoiceContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { InvoiceStatus, CurrencyCode, CURRENCY_SYMBOLS, RecurringInterval, RECURRING_LABELS } from "@/types/invoice";

const STATUS_COLORS: Record<InvoiceStatus, string> = {
  draft: "secondary",
  sent: "default",
  paid: "outline",
  overdue: "destructive",
};

const CURRENCIES: CurrencyCode[] = ["USD", "EUR", "GBP", "NGN", "GHS", "KES", "ZAR", "CAD", "AUD"];

export function InvoiceMetaForm() {
  const { invoice, updateField, updateSettings } = useInvoice();

  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div className="flex-1 min-w-[140px]">
        <Label htmlFor="inv-number">Invoice #</Label>
        <Input
          id="inv-number"
          value={invoice.invoiceNumber}
          onChange={(e) => updateField("invoiceNumber", e.target.value)}
          className="font-mono"
        />
      </div>

      <div className="flex-1 min-w-[140px]">
        <Label htmlFor="inv-issue">Issue Date</Label>
        <Input id="inv-issue" type="date" value={invoice.issueDate} onChange={(e) => updateField("issueDate", e.target.value)} />
      </div>

      <div className="flex-1 min-w-[140px]">
        <Label htmlFor="inv-due">Due Date</Label>
        <Input id="inv-due" type="date" value={invoice.dueDate} onChange={(e) => updateField("dueDate", e.target.value)} />
      </div>

      <div className="min-w-[120px]">
        <Label>Status</Label>
        <Select value={invoice.status} onValueChange={(v) => v && updateField("status", v as InvoiceStatus)}>
          <SelectTrigger>
            <SelectValue>
              <Badge variant={STATUS_COLORS[invoice.status] as "default" | "secondary" | "outline" | "destructive"}>
                {invoice.status}
              </Badge>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {(["draft", "sent", "paid", "overdue"] as InvoiceStatus[]).map((s) => (
              <SelectItem key={s} value={s}>
                <Badge variant={STATUS_COLORS[s] as "default" | "secondary" | "outline" | "destructive"}>{s}</Badge>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-[100px]">
        <Label>Currency</Label>
        <Select value={invoice.settings.currency} onValueChange={(v) => v && updateSettings("currency", v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CURRENCIES.map((c) => (
              <SelectItem key={c} value={c}>
                {CURRENCY_SYMBOLS[c]} {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-[130px]">
        <Label>Billing</Label>
        <Select
          value={invoice.isRecurring ? (invoice.recurringInterval ?? "monthly") : "once"}
          onValueChange={(v) => {
            if (!v) return;
            if (v === "once") {
              updateField("isRecurring", false);
              updateField("recurringInterval", undefined);
            } else {
              updateField("isRecurring", true);
              updateField("recurringInterval", v as RecurringInterval);
            }
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="once">One-time</SelectItem>
            {(Object.keys(RECURRING_LABELS) as RecurringInterval[]).map((interval) => (
              <SelectItem key={interval} value={interval}>
                {RECURRING_LABELS[interval]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
