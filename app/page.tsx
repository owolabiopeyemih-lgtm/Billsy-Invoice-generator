import Link from "next/link";
import { InvoiceList } from "@/components/invoice/InvoiceList";
import { FileText, Plus } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <FileText size={14} className="text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">Billsy</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:inline">No login required</span>
            <Link
              href="/invoice/new"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Plus size={14} /> New Invoice
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            All invoices save automatically in your browser — no account needed.
          </p>
        </div>
        <InvoiceList />
      </main>
    </div>
  );
}
