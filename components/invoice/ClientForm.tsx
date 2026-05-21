"use client";

import { useInvoice } from "./InvoiceContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ClientForm() {
  const { invoice, updateClient } = useInvoice();
  const { client } = invoice;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Bill To</h3>
      <div className="space-y-3">
        <div>
          <Label htmlFor="client-name">Client name</Label>
          <Input id="client-name" value={client.name} onChange={(e) => updateClient("name", e.target.value)} placeholder="Jane Smith" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="client-email">Email</Label>
            <Input id="client-email" type="email" value={client.email} onChange={(e) => updateClient("email", e.target.value)} placeholder="client@example.com" />
          </div>
          <div>
            <Label htmlFor="client-phone">Phone</Label>
            <Input id="client-phone" value={client.phone} onChange={(e) => updateClient("phone", e.target.value)} placeholder="+1 555 000 0001" />
          </div>
        </div>
        <div>
          <Label htmlFor="client-address">Address</Label>
          <Textarea id="client-address" value={client.address} onChange={(e) => updateClient("address", e.target.value)} placeholder="456 Client Ave, City, Country" rows={2} />
        </div>
      </div>
    </div>
  );
}
