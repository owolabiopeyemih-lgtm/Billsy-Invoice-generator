"use client";

import { useInvoice } from "./InvoiceContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { calcLineItem, formatCurrency } from "@/types/invoice";

export function LineItemsForm() {
  const { invoice, addLineItem, removeLineItem, updateLineItem } = useInvoice();
  const { lineItems, settings } = invoice;

  function num(v: string) {
    return parseFloat(v) || 0;
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Line Items</h3>

      <div className="overflow-x-auto -mx-1 px-1">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted-foreground text-xs border-b">
              <th className="text-left pb-2 font-medium w-[35%]">Description</th>
              <th className="text-right pb-2 font-medium w-[10%]">Qty</th>
              <th className="text-right pb-2 font-medium w-[15%]">Unit Price</th>
              <th className="text-right pb-2 font-medium w-[10%]">Tax %</th>
              <th className="text-right pb-2 font-medium w-[10%]">Disc %</th>
              <th className="text-right pb-2 font-medium w-[15%]">Total</th>
              <th className="w-[5%]" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {lineItems.map((item) => {
              const { total } = calcLineItem(item);
              return (
                <tr key={item.id} className="group">
                  <td className="py-2 pr-2">
                    <Input
                      value={item.description}
                      onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                      placeholder="Service or product description"
                      className="h-8 text-sm"
                    />
                  </td>
                  <td className="py-2 px-1">
                    <Input
                      type="number"
                      min={0}
                      value={item.quantity}
                      onChange={(e) => updateLineItem(item.id, "quantity", num(e.target.value))}
                      className="h-8 text-sm text-right w-16"
                    />
                  </td>
                  <td className="py-2 px-1">
                    <Input
                      type="number"
                      min={0}
                      step={0.01}
                      value={item.unitPrice}
                      onChange={(e) => updateLineItem(item.id, "unitPrice", num(e.target.value))}
                      className="h-8 text-sm text-right w-24"
                    />
                  </td>
                  <td className="py-2 px-1">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={item.taxRate}
                      onChange={(e) => updateLineItem(item.id, "taxRate", num(e.target.value))}
                      className="h-8 text-sm text-right w-16"
                    />
                  </td>
                  <td className="py-2 px-1">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={item.discount}
                      onChange={(e) => updateLineItem(item.id, "discount", num(e.target.value))}
                      className="h-8 text-sm text-right w-16"
                    />
                  </td>
                  <td className="py-2 pl-2 text-right font-medium tabular-nums">
                    {formatCurrency(total, settings.currency)}
                  </td>
                  <td className="py-2 pl-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                      onClick={() => removeLineItem(item.id)}
                      disabled={lineItems.length === 1}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Button variant="outline" size="sm" onClick={addLineItem} className="gap-1.5">
        <Plus size={14} /> Add line item
      </Button>
    </div>
  );
}
