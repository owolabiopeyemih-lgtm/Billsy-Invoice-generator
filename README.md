# Billsy Invoice

**Billsy** is a free, no-login invoice generator for freelancers and sellers. Create professional invoices, download them as PDF, and share them instantly — all from your browser with no account required.

---

## Features

### Invoice Creation
- Start from a blank template with auto-incrementing invoice numbers
- Auto-calculated subtotals, taxes, discounts, and grand totals
- Editable invoice number, issue date, due date, and status

### Business & Client Details
- Enter sender and recipient details (name, email, phone, address)
- Upload and compress your business logo automatically
- Details pre-filled from your last invoice for speed

### Line Items
- Add unlimited service or product line items
- Per-item quantity, unit price, tax rate (%), and discount (%)
- Real-time total calculations per row and overall

### Payment Methods
- Add multiple payment options: Bank Transfer, PayPal, Stripe, Cash, Cheque, Cryptocurrency, Mobile Money (M-Pesa, Opay, PalmPay), and more
- Smart placeholder text per method type
- Renders as a structured "Payment Information" section on the invoice

### Templates & Branding
- 3 invoice templates: **Modern** (coloured header), **Classic** (accent border), **Minimal** (clean lines)
- 40+ accent colour presets including Navy, Forest Green, Brown, and Grey
- Custom colour picker for any hex value
- 9 currencies: USD, EUR, GBP, NGN, GHS, KES, ZAR, CAD, AUD

### Recurring Invoices
- Mark invoices as recurring: Weekly, Monthly, Quarterly, or Yearly
- Recurring badge displayed prominently on the invoice preview

### PDF & Sharing
- **Download PDF** — high-resolution A4 PDF via html2canvas + jsPDF
- **Copy as Image** — copies the invoice as a PNG to your clipboard (paste into WhatsApp, Telegram, Slack, etc.)
- **Share PDF** — native OS share sheet on mobile; share dialog with WhatsApp, Email, and Download options on desktop
- **Print** — browser print dialog with print-only CSS layout

### Local Storage
- All invoices save automatically in your browser (no server, no account)
- Logo stored once to prevent storage quota errors
- Export all invoices as a JSON backup file
- Invoices persist across sessions and page refreshes

### Status Tracking
- Mark invoices as **Draft**, **Sent**, **Paid**, or **Overdue**
- Status badge shown on the dashboard and in the editor header

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui |
| State | React Context + useState |
| Storage | localStorage (with logo deduplication) |
| PDF Export | html2canvas + jsPDF |
| Icons | Lucide React |
| Fonts | Geist Sans + Geist Mono |
| Hosting | Vercel (recommended) |

---

## Project Structure

```
billsy-invoice/
├── app/
│   ├── page.tsx                  # Dashboard — invoice list
│   ├── layout.tsx                # Root layout with metadata
│   ├── icon.tsx                  # Generated favicon
│   └── invoice/
│       ├── new/page.tsx          # New invoice page
│       └── [id]/page.tsx         # Edit existing invoice
├── components/
│   ├── invoice/
│   │   ├── InvoiceEditor.tsx     # Split-pane editor + scaled live preview
│   │   ├── InvoiceContext.tsx    # Shared state with auto-save debounce
│   │   ├── InvoicePreview.tsx    # A4 invoice renderer (all 3 templates)
│   │   ├── InvoiceActions.tsx    # Download / Share / Print / Copy toolbar
│   │   ├── InvoiceList.tsx       # Dashboard invoice list
│   │   ├── InvoiceMetaForm.tsx   # Invoice #, dates, status, currency, billing
│   │   ├── BusinessForm.tsx      # Business details + logo upload/compression
│   │   ├── ClientForm.tsx        # Client details
│   │   ├── LineItemsForm.tsx     # Line items table
│   │   ├── TotalsPanel.tsx       # Subtotal / tax / grand total
│   │   ├── PaymentForm.tsx       # Payment method cards
│   │   ├── NotesTermsForm.tsx    # Notes and payment terms
│   │   └── TemplateSettings.tsx  # Template picker + accent colour swatches
│   └── ui/                       # shadcn/ui components
├── lib/
│   ├── storage.ts                # localStorage CRUD with normalization
│   └── defaults.ts               # Blank invoice factory + invoice numbering
└── types/
    └── invoice.ts                # TypeScript types + calculation helpers
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/owolabiopeyemih-lgtm/Billsy-Invoice-generator.git
cd Billsy-Invoice-generator

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Vercel auto-detects Next.js — click **Deploy**

No environment variables are required. The app is fully client-side except for the favicon generation endpoint.

---

## How It Works

### Auto-Save
Every change to the invoice is debounced and automatically saved to `localStorage` after 800ms. No manual save button is needed.

### Logo Storage
Logos are compressed to a maximum of 400×400px JPEG (75% quality) on upload, then stored once at a dedicated `billsy_logo` key rather than duplicated inside every invoice — preventing `QuotaExceededError`.

### PDF Generation
1. The invoice preview is cloned into the DOM at full A4 width (794px)
2. External stylesheets are stripped from the clone (prevents `oklch` colour parsing errors in html2canvas)
3. `html2canvas` captures the clone at 3× resolution for crisp output
4. `jsPDF` tiles the canvas across A4 pages for multi-page invoices
5. The blob is offered as a download or passed to the Web Share API

### Sharing as Image
The invoice is captured as a PNG via `html2canvas` and written to the clipboard using `navigator.clipboard.write()`. This allows pasting directly into WhatsApp Web, Telegram, Twitter, Notion, or any app that accepts image paste.

---

## Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---|---|---|---|---|
| Core invoice editing | ✅ | ✅ | ✅ | ✅ |
| PDF download | ✅ | ✅ | ✅ | ✅ |
| Copy as image | ✅ | ✅ | ✅ | ✅ |
| Native share sheet | ✅ Android | ❌ | ✅ iOS | ❌ |

---

## License

MIT — free to use, modify, and distribute.

---

## Acknowledgements

Built with [Next.js](https://nextjs.org), [shadcn/ui](https://ui.shadcn.com), [Tailwind CSS](https://tailwindcss.com), [html2canvas](https://html2canvas.hertzen.com), and [jsPDF](https://github.com/parallax/jsPDF).
