"use client";

import { useEffect, useState } from "react";
import { createBlankInvoice } from "@/lib/defaults";
import { Invoice } from "@/types/invoice";
import { InvoiceEditor } from "@/components/invoice/InvoiceEditor";

export default function NewInvoicePage() {
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    setInvoice(createBlankInvoice());
  }, []);

  if (!invoice) return null;
  return <InvoiceEditor initial={invoice} />;
}
