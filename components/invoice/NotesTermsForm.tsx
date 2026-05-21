"use client";

import { useInvoice } from "./InvoiceContext";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function NotesTermsForm() {
  const { invoice, updateField } = useInvoice();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={invoice.notes}
          onChange={(e) => updateField("notes", e.target.value)}
          placeholder="Thank you for your business!"
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="terms">Payment Terms</Label>
        <Textarea
          id="terms"
          value={invoice.terms}
          onChange={(e) => updateField("terms", e.target.value)}
          placeholder="Payment due within 14 days."
          rows={3}
        />
      </div>
    </div>
  );
}
