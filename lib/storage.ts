import { Invoice } from "@/types/invoice";

const INVOICES_KEY = "billsy_invoices";
const BUSINESS_KEY = "billsy_business";
const LOGO_KEY     = "billsy_logo";
const LOGO_REF     = "__logo__";

// ── quota-safe write ────────────────────────────────────────────────────────

function safeSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    if (e instanceof DOMException && e.name === "QuotaExceededError") {
      throw new Error(
        "Browser storage is full. Delete some old invoices or use a smaller logo image."
      );
    }
    throw e;
  }
}

// ── normalization ───────────────────────────────────────────────────────────
// Fills in fields that are absent on invoices saved by older app versions so
// loading never crashes the editor.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeInvoice(raw: any): Invoice {
  return {
    id:                raw.id                ?? "",
    invoiceNumber:     raw.invoiceNumber     ?? "INV-001",
    status:            raw.status            ?? "draft",
    issueDate:         raw.issueDate         ?? new Date().toISOString().slice(0, 10),
    dueDate:           raw.dueDate           ?? new Date().toISOString().slice(0, 10),
    notes:             raw.notes             ?? "",
    terms:             raw.terms             ?? "",
    isRecurring:       raw.isRecurring       ?? false,
    recurringInterval: raw.recurringInterval ?? undefined,
    createdAt:         raw.createdAt         ?? new Date().toISOString(),
    updatedAt:         raw.updatedAt         ?? new Date().toISOString(),
    paymentMethods:    Array.isArray(raw.paymentMethods) ? raw.paymentMethods : [],
    business: {
      name:    raw.business?.name    ?? "",
      email:   raw.business?.email   ?? "",
      phone:   raw.business?.phone   ?? "",
      address: raw.business?.address ?? "",
      logo:    raw.business?.logo,
    },
    client: {
      name:    raw.client?.name    ?? "",
      email:   raw.client?.email   ?? "",
      phone:   raw.client?.phone   ?? "",
      address: raw.client?.address ?? "",
    },
    lineItems: Array.isArray(raw.lineItems)
      ? raw.lineItems.map((item: any) => ({  // eslint-disable-line @typescript-eslint/no-explicit-any
          id:          item.id          ?? "",
          description: item.description ?? "",
          quantity:    Number(item.quantity)  || 1,
          unitPrice:   Number(item.unitPrice) || 0,
          taxRate:     Number(item.taxRate)   || 0,
          discount:    Number(item.discount)  || 0,
        }))
      : [],
    settings: {
      template:    raw.settings?.template    ?? "modern",
      accentColor: raw.settings?.accentColor ?? "#6366f1",
      currency:    raw.settings?.currency    ?? "USD",
    },
  };
}

// ── logo deduplication ──────────────────────────────────────────────────────

function stripLogo(invoice: Invoice): Invoice {
  const { logo, ...rest } = invoice.business;
  if (logo && logo !== LOGO_REF) {
    try { localStorage.setItem(LOGO_KEY, logo); } catch {}
  }
  return {
    ...invoice,
    business: { ...rest, logo: logo ? LOGO_REF : undefined },
  };
}

function hydrateLogo(invoice: Invoice): Invoice {
  if (invoice.business.logo !== LOGO_REF) return invoice;
  const logo = localStorage.getItem(LOGO_KEY) ?? undefined;
  return { ...invoice, business: { ...invoice.business, logo } };
}

// ── public API ──────────────────────────────────────────────────────────────

export function getInvoices(): Invoice[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem(INVOICES_KEY) ?? "[]");
    if (!Array.isArray(raw)) return [];
    // Handle each invoice independently — one bad record must not wipe the list
    return raw
      .map((item: unknown) => {
        try {
          return hydrateLogo(normalizeInvoice(item));
        } catch {
          return null;
        }
      })
      .filter((inv): inv is Invoice => inv !== null && !!inv.id);
  } catch {
    return [];
  }
}

export function getInvoice(id: string): Invoice | null {
  if (!id) return null;
  return getInvoices().find((inv) => inv.id === id) ?? null;
}

export function saveInvoice(invoice: Invoice): void {
  const all = getInvoices();
  const idx = all.findIndex((i) => i.id === invoice.id);
  if (idx >= 0) all[idx] = invoice;
  else all.unshift(invoice);
  safeSet(INVOICES_KEY, JSON.stringify(all.map(stripLogo)));
}

export function deleteInvoice(id: string): void {
  const all = getInvoices().filter((i) => i.id !== id).map(stripLogo);
  safeSet(INVOICES_KEY, JSON.stringify(all));
}

export function getSavedBusiness(): Partial<Invoice["business"]> {
  if (typeof window === "undefined") return {};
  try {
    const biz = JSON.parse(
      localStorage.getItem(BUSINESS_KEY) ?? "{}"
    ) as Partial<Invoice["business"]>;
    if (biz.logo === LOGO_REF) {
      biz.logo = localStorage.getItem(LOGO_KEY) ?? undefined;
    }
    return biz;
  } catch {
    return {};
  }
}

export function saveBusiness(business: Invoice["business"]): void {
  const { logo, ...rest } = business;
  if (logo && logo !== LOGO_REF) {
    try { localStorage.setItem(LOGO_KEY, logo); } catch {}
  }
  safeSet(
    BUSINESS_KEY,
    JSON.stringify({ ...rest, logo: logo ? LOGO_REF : undefined })
  );
}

export function exportInvoicesJSON(): string {
  return JSON.stringify(getInvoices(), null, 2);
}

export function storageUsageKB(): { used: number; total: number } {
  let used = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)!;
      used += k.length + (localStorage.getItem(k)?.length ?? 0);
    }
  } catch {}
  return { used: Math.round(used / 1024), total: 5120 };
}
