<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Billsy Invoice

Here’s the PRD renamed to **Billsy Invoice**.

```md
# PRD: Billsy Invoice

## Product name
**Billsy Invoice** — a no-login invoice generator for freelancers and sellers to create and download professional invoices instantly.

## Problem statement
Freelancers and sellers need a fast way to generate professional invoices without account creation, passwords, or onboarding friction. The product should remove setup overhead while still supporting the essentials: client details, line items, totals, taxes, PDF export, and basic tracking.

## Target user profile
- Freelancers billing for services, projects, or retainers.
- Sellers invoicing for goods, one-off orders, or simple services.
- Solo operators who want speed over account-based workflows.
- Users who prefer browser-based tools with no signup friction.

## Core features
1. Invoice creation.
2. Client and business details.
3. Line items, tax, discounts, and totals.
4. Template and branding customization.
5. PDF download and print.
6. Share by email or link.
7. Local invoice history and draft saving.
8. Basic status tracking and recurring invoices.

## User stories

### 1) Invoice creation
- As a user, I want to create an invoice from a blank template so I can start immediately.
- As a user, I want auto-calculated totals so I can avoid manual errors.
- As a user, I want editable invoice numbering so each invoice stays unique.

### 2) Client and business details
- As a user, I want to enter sender and recipient details so the invoice is complete.
- As a user, I want to reuse previously entered details so future invoices are faster.
- As a user, I want fields for notes and terms so I can add payment instructions.

### 3) Line items, tax, discounts, totals
- As a freelancer, I want to add service line items so I can bill accurately.
- As a seller, I want quantity, unit price, tax, and discount fields so product invoices are correct.
- As a user, I want subtotal and grand total calculations so I can confirm the amount due.

### 4) Template and branding customization
- As a user, I want to upload a logo so invoices look professional.
- As a user, I want to choose from simple templates so the invoice matches my brand.
- As a user, I want to change colors and layout density so I can match my style.

### 5) PDF download and print
- As a user, I want to download the invoice as PDF so I can send it anywhere.
- As a user, I want print-friendly output so I can share a paper copy if needed.
- As a user, I want the invoice to render correctly on mobile and desktop so output is reliable.

### 6) Share by email or link
- As a user, I want to email the invoice directly from the app so I can send it quickly.
- As a user, I want a shareable invoice link so I can send it through messaging apps.
- As a user, I want the share flow to work without login so I can use it instantly.

### 7) Local invoice history and draft saving
- As a user, I want drafts saved in my browser so I do not lose work.
- As a user, I want to see recently created invoices so I can reopen and edit them.
- As a user, I want exportable local records so I can back them up manually.

### 8) Basic status tracking and recurring invoices
- As a user, I want to mark invoices as draft, sent, paid, or overdue so I can track status.
- As a user, I want recurring invoice setup so I can bill repeat clients.
- As a user, I want reminders for due invoices so I can follow up on time.

## Out of scope
- Authentication, accounts, sign-up, login, password reset, and user profiles.
- Cloud sync across devices.
- Team collaboration or multi-user permissions.
- Full accounting, bookkeeping, payroll, and tax filing.
- Inventory management and marketplace storefronts.
- Advanced CRM, project management, or time tracking.
- Bank reconciliation and financial integrations.
- Enterprise workflows, approvals, and role-based access control.

## Tech stack
- Frontend: Next.js, React, TypeScript.
- Styling: Tailwind CSS.
- UI components: shadcn/ui.
- State/storage: localStorage or IndexedDB.
- PDF export: Playwright print-to-PDF or PDFKit.
- Email: client-side mailto fallback plus optional serverless email API.
- Backend: optional serverless endpoints only for email/share features.
- Hosting: Vercel or similar static-first hosting.
- Analytics: privacy-friendly event tracking, optional and non-authenticated.

## Definition of done
- A user can open the app and create an invoice with no login.
- A user can add business, client, and line-item details.
- The app calculates totals correctly and renders a clean preview.
- A user can download and print a PDF invoice.
- Drafts and recent invoices persist locally in the browser.
- Status labels and recurring invoice settings work without accounts.
- The app is responsive and usable on desktop and mobile.
- Core flows are tested and production-ready without authentication.
```

<span style="display:none">[^1][^10][^2][^3][^4][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://www.gov.uk/invoicing-and-taking-payment-from-customers/invoices-what-they-must-include

[^2]: https://www.pandadoc.com/blog/billing-vs-invoice/

[^3]: https://www.bokio.co.uk/blog/5-things-to-put-in-your-invoice-template/

[^4]: https://gocardless.com/guides/posts/bills-and-invoices-what-is-the-difference/

[^5]: https://en.wikipedia.org/wiki/Invoice

[^6]: https://www.business.hsbc.uk/en-gb/insights/starting-a-business/how-to-write-an-invoice

[^7]: https://www.business-stream.co.uk/my-account/billing/request-an-invoice-copy/

[^8]: https://help.mews.com/s/article/How-to-view-company-or-customer-items-in-a-bill

[^9]: https://community.quickfile.co.uk/t/show-invoice-name-on-the-actual-invoice/5080

[^10]: https://www.ukbusinessforums.co.uk/threads/invoices-not-in-company-name.87383/

