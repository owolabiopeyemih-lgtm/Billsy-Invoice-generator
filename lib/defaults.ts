import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { Invoice } from "@/types/invoice";
import { getInvoices, getSavedBusiness } from "./storage";

export function nextInvoiceNumber(): string {
  const all = getInvoices();
  if (all.length === 0) return "INV-001";
  const nums = all
    .map((i) => parseInt(i.invoiceNumber.replace(/\D/g, ""), 10))
    .filter((n) => !isNaN(n));
  const max = nums.length ? Math.max(...nums) : 0;
  return `INV-${String(max + 1).padStart(3, "0")}`;
}

export function createBlankInvoice(): Invoice {
  const today = format(new Date(), "yyyy-MM-dd");
  const due = format(new Date(Date.now() + 14 * 86400000), "yyyy-MM-dd");
  const savedBusiness = getSavedBusiness();

  return {
    id: uuidv4(),
    invoiceNumber: nextInvoiceNumber(),
    status: "draft",
    issueDate: today,
    dueDate: due,
    business: {
      name: "",
      email: "",
      phone: "",
      address: "",
      logo: undefined,
      ...savedBusiness,
    },
    client: { name: "", email: "", phone: "", address: "" },
    paymentMethods: [],
    lineItems: [
      { id: uuidv4(), description: "", quantity: 1, unitPrice: 0, taxRate: 0, discount: 0 },
    ],
    notes: "",
    terms: "Payment is due within 14 days of invoice date.",
    settings: {
      template: "modern",
      accentColor: "#6366f1",
      currency: "USD",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isRecurring: false,
  };
}
