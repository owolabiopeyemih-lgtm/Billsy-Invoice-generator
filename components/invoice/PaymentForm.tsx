"use client";

import { v4 as uuidv4 } from "uuid";
import { useInvoice } from "./InvoiceContext";
import {
  PaymentMethodType,
  PAYMENT_METHOD_DEFAULTS,
} from "@/types/invoice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Building2, Wallet, CreditCard, Banknote, FileText, Bitcoin, Smartphone, MoreHorizontal } from "lucide-react";

const METHOD_ICONS: Record<PaymentMethodType, React.ReactNode> = {
  bank: <Building2 size={14} />,
  paypal: <Wallet size={14} />,
  stripe: <CreditCard size={14} />,
  cash: <Banknote size={14} />,
  cheque: <FileText size={14} />,
  crypto: <Bitcoin size={14} />,
  mobile_money: <Smartphone size={14} />,
  other: <MoreHorizontal size={14} />,
};

const METHOD_LABELS: Record<PaymentMethodType, string> = {
  bank: "Bank Transfer",
  paypal: "PayPal",
  stripe: "Stripe",
  cash: "Cash",
  cheque: "Cheque",
  crypto: "Cryptocurrency",
  mobile_money: "Mobile Money",
  other: "Other",
};

export function PaymentForm() {
  const { invoice, addPaymentMethod, removePaymentMethod, updatePaymentMethod } = useInvoice();
  const methods = invoice.paymentMethods ?? [];

  function handleAdd(type: PaymentMethodType) {
    addPaymentMethod({
      id: uuidv4(),
      type,
      label: PAYMENT_METHOD_DEFAULTS[type].label,
      details: "",
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
          Payment Methods
        </h3>

        <Select onValueChange={(v) => v && handleAdd(v as PaymentMethodType)}>
          <SelectTrigger className="w-auto gap-1.5 h-8 text-xs pr-3">
            <Plus size={13} />
            <SelectValue placeholder="Add method" />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(METHOD_LABELS) as PaymentMethodType[]).map((type) => (
              <SelectItem key={type} value={type}>
                <span className="flex items-center gap-2">
                  {METHOD_ICONS[type]}
                  {METHOD_LABELS[type]}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {methods.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No payment methods added. Use the button above to add bank details, PayPal, crypto, and more.
        </p>
      )}

      <div className="space-y-4">
        {methods.map((method) => (
          <div key={method.id} className="border rounded-lg p-4 space-y-3 bg-muted/20">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">{METHOD_ICONS[method.type]}</span>
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground mb-1 block">Label shown on invoice</Label>
                <Input
                  value={method.label}
                  onChange={(e) => updatePaymentMethod(method.id, "label", e.target.value)}
                  className="h-8 text-sm font-medium"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive shrink-0"
                onClick={() => removePaymentMethod(method.id)}
              >
                <Trash2 size={14} />
              </Button>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Details</Label>
              <Textarea
                value={method.details}
                onChange={(e) => updatePaymentMethod(method.id, "details", e.target.value)}
                placeholder={PAYMENT_METHOD_DEFAULTS[method.type].placeholder}
                rows={4}
                className="text-sm font-mono resize-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
