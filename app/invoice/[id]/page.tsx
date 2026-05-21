"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getInvoice } from "@/lib/storage";
import { Invoice } from "@/types/invoice";
import { InvoiceEditor } from "@/components/invoice/InvoiceEditor";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export default function InvoicePage() {
  const params = useParams();
  // useParams returns string | string[] — normalise to string
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null | "not-found">(null);

  useEffect(() => {
    if (!id) { setInvoice("not-found"); return; }
    const inv = getInvoice(id);
    setInvoice(inv ?? "not-found");
  }, [id]);

  if (invoice === null) {
    // Still loading
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (invoice === "not-found") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 text-center px-4">
        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
          <FileText size={24} className="text-muted-foreground" />
        </div>
        <div>
          <p className="font-semibold text-lg">Invoice not found</p>
          <p className="text-sm text-muted-foreground mt-1">
            This invoice may have been deleted or hasn&apos;t been saved yet.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => router.push("/")}>Go to dashboard</Button>
          <Button variant="outline" onClick={() => router.push("/invoice/new")}>
            New invoice
          </Button>
        </div>
      </div>
    );
  }

  return <InvoiceEditor initial={invoice} />;
}
