export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number; // percentage e.g. 10 for 10%
  discount: number; // percentage e.g. 5 for 5%
}

export interface BusinessDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  logo?: string; // base64 data URL
}

export interface ClientDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export type CurrencyCode = "USD" | "EUR" | "GBP" | "NGN" | "GHS" | "KES" | "ZAR" | "CAD" | "AUD";

export type PaymentMethodType =
  | "bank"
  | "paypal"
  | "stripe"
  | "cash"
  | "cheque"
  | "crypto"
  | "mobile_money"
  | "other";

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  label: string;   // display heading on invoice
  details: string; // free-form details block
}

export const PAYMENT_METHOD_DEFAULTS: Record<PaymentMethodType, { label: string; placeholder: string }> = {
  bank: {
    label: "Bank Transfer",
    placeholder: "Bank: First National Bank\nAccount Name: Acme Inc.\nAccount Number: 1234567890\nRouting / Sort Code: 00-00-00\nIBAN / SWIFT: (optional)",
  },
  paypal: {
    label: "PayPal",
    placeholder: "PayPal Email: payments@example.com\nor PayPal.me link: paypal.me/yourname",
  },
  stripe: {
    label: "Stripe",
    placeholder: "Pay online: https://buy.stripe.com/yourlink",
  },
  cash: {
    label: "Cash",
    placeholder: "Cash accepted on delivery / collection.",
  },
  cheque: {
    label: "Cheque",
    placeholder: "Make cheque payable to: Acme Inc.\nMail to: 123 Main St, City, Country",
  },
  crypto: {
    label: "Cryptocurrency",
    placeholder: "Bitcoin (BTC): 1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf\nEthereum (ETH): 0x000...000",
  },
  mobile_money: {
    label: "Mobile Money",
    placeholder: "Provider: M-Pesa / Opay / PalmPay\nPhone: +234 800 000 0000\nAccount Name: Acme Inc.",
  },
  other: {
    label: "Payment Details",
    placeholder: "Enter your payment instructions here.",
  },
};

export interface InvoiceSettings {
  template: "classic" | "modern" | "minimal";
  accentColor: string;
  currency: CurrencyCode;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  issueDate: string; // ISO date string
  dueDate: string;
  business: BusinessDetails;
  client: ClientDetails;
  lineItems: LineItem[];
  paymentMethods: PaymentMethod[];
  notes: string;
  terms: string;
  settings: InvoiceSettings;
  createdAt: string;
  updatedAt: string;
  isRecurring: boolean;
  recurringInterval?: "weekly" | "monthly" | "quarterly" | "yearly";
}

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  NGN: "₦",
  GHS: "₵",
  KES: "KSh",
  ZAR: "R",
  CAD: "CA$",
  AUD: "A$",
};

export type RecurringInterval = "weekly" | "monthly" | "quarterly" | "yearly";

export const RECURRING_LABELS: Record<RecurringInterval, string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
  yearly: "Yearly",
};

export function recurringLabel(invoice: Invoice): string | null {
  if (!invoice.isRecurring || !invoice.recurringInterval) return null;
  return `Recurring · ${RECURRING_LABELS[invoice.recurringInterval]}`;
}

export function calcLineItem(item: LineItem) {
  const gross = item.quantity * item.unitPrice;
  const discountAmt = gross * (item.discount / 100);
  const afterDiscount = gross - discountAmt;
  const taxAmt = afterDiscount * (item.taxRate / 100);
  return { gross, discountAmt, afterDiscount, taxAmt, total: afterDiscount + taxAmt };
}

export function calcTotals(items: LineItem[]) {
  const subtotal = items.reduce((s, i) => s + calcLineItem(i).afterDiscount, 0);
  const totalTax = items.reduce((s, i) => s + calcLineItem(i).taxAmt, 0);
  const grand = subtotal + totalTax;
  return { subtotal, totalTax, grand };
}

export function formatCurrency(amount: number, currency: CurrencyCode) {
  const symbol = CURRENCY_SYMBOLS[currency];
  return `${symbol}${amount.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
