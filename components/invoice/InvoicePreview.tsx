"use client";

import { forwardRef } from "react";
import { Invoice, calcLineItem, calcTotals, formatCurrency, recurringLabel } from "@/types/invoice";
import { format } from "date-fns";

interface Props {
  invoice: Invoice;
}

function safeDate(str: string) {
  try { return format(new Date(str), "MMM d, yyyy"); } catch { return str; }
}

export const InvoicePreview = forwardRef<HTMLDivElement, Props>(({ invoice }, ref) => {
  const { business, client, lineItems, settings, notes, terms, paymentMethods } = invoice;
  const { subtotal, totalTax, grand } = calcTotals(lineItems);
  const fmt = (n: number) => formatCurrency(n, settings.currency);
  const accent = settings.accentColor;

  const isModern = settings.template === "modern";
  const isMinimal = settings.template === "minimal";
  const recurring = recurringLabel(invoice);

  return (
    <div
      ref={ref}
      id="invoice-preview"
      style={{
        width: "794px",
        minHeight: "1123px",
        padding: "48px",
        boxSizing: "border-box",
        fontSize: "13px",
        lineHeight: "1.5",
        backgroundColor: "#ffffff",
        color: "#111827",
        fontFamily: "ui-sans-serif, system-ui, Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── MODERN header ───────────────────────────────────────────────── */}
      {isModern && (
        <div style={{ background: accent, color: "#fff", margin: "-48px -48px 40px -48px", padding: "36px 48px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "start" }}>
            {/* Left — business */}
            <div>
              {business.logo && (
                <div style={{ display: "inline-flex", background: "#fff", borderRadius: "6px", padding: "4px 8px", marginBottom: "10px" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={business.logo} alt="Logo" style={{ height: "36px", objectFit: "contain", display: "block" }} />
                </div>
              )}
              <div style={{ fontSize: "20px", fontWeight: 700, lineHeight: 1.2 }}>{business.name || "Your Business"}</div>
              {business.email  && <div style={{ opacity: 0.8, fontSize: "12px", marginTop: "6px" }}>{business.email}</div>}
              {business.phone  && <div style={{ opacity: 0.8, fontSize: "12px" }}>{business.phone}</div>}
              {business.address && <div style={{ opacity: 0.8, fontSize: "12px", whiteSpace: "pre-wrap", marginTop: "2px" }}>{business.address}</div>}
            </div>

            {/* Right — invoice meta */}
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "30px", fontWeight: 800, letterSpacing: "-1px", lineHeight: 1 }}>INVOICE</div>
              <div style={{ fontFamily: "monospace", fontSize: "13px", opacity: 0.85, marginTop: "6px" }}>{invoice.invoiceNumber}</div>
              <table style={{ marginTop: "12px", marginLeft: "auto", fontSize: "12px", borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td style={{ opacity: 0.7, paddingRight: "12px", paddingBottom: "3px", textAlign: "right" }}>Issued</td>
                    <td style={{ fontWeight: 600, paddingBottom: "3px", textAlign: "right", minWidth: "90px" }}>{safeDate(invoice.issueDate)}</td>
                  </tr>
                  <tr>
                    <td style={{ opacity: 0.7, paddingRight: "12px", textAlign: "right" }}>Due</td>
                    <td style={{ fontWeight: 600, textAlign: "right" }}>{safeDate(invoice.dueDate)}</td>
                  </tr>
                </tbody>
              </table>
              {recurring && (
                <div style={{ marginTop: "10px" }}>
                  <span style={{ display: "inline-block", background: "rgba(255,255,255,0.22)", color: "#fff", fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "3px 8px", borderRadius: "99px", border: "1px solid rgba(255,255,255,0.4)" }}>
                    ↻ {recurring}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MINIMAL header ──────────────────────────────────────────────── */}
      {isMinimal && (
        <div style={{ borderBottom: `2px solid ${accent}`, paddingBottom: "20px", marginBottom: "32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "start" }}>
            {/* Left — business */}
            <div>
              {business.logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={business.logo} alt="Logo" style={{ height: "36px", objectFit: "contain", marginBottom: "8px", display: "block" }} />
              )}
              <div style={{ fontSize: "17px", fontWeight: 700 }}>{business.name || "Your Business"}</div>
              {business.email   && <div style={{ color: "#6b7280", fontSize: "12px", marginTop: "4px" }}>{business.email}</div>}
              {business.phone   && <div style={{ color: "#6b7280", fontSize: "12px" }}>{business.phone}</div>}
              {business.address && <div style={{ color: "#6b7280", fontSize: "12px", whiteSpace: "pre-wrap", marginTop: "2px" }}>{business.address}</div>}
            </div>

            {/* Right — invoice meta */}
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "26px", fontWeight: 800, color: accent, letterSpacing: "-0.5px", lineHeight: 1 }}>INVOICE</div>
              <div style={{ fontFamily: "monospace", color: "#6b7280", fontSize: "13px", marginTop: "6px" }}>{invoice.invoiceNumber}</div>
              <table style={{ marginTop: "10px", marginLeft: "auto", fontSize: "12px", borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td style={{ color: "#9ca3af", paddingRight: "12px", paddingBottom: "3px", textAlign: "right" }}>Issued</td>
                    <td style={{ fontWeight: 600, color: "#374151", paddingBottom: "3px", textAlign: "right", minWidth: "90px" }}>{safeDate(invoice.issueDate)}</td>
                  </tr>
                  <tr>
                    <td style={{ color: "#9ca3af", paddingRight: "12px", textAlign: "right" }}>Due</td>
                    <td style={{ fontWeight: 600, color: "#374151", textAlign: "right" }}>{safeDate(invoice.dueDate)}</td>
                  </tr>
                </tbody>
              </table>
              {recurring && (
                <div style={{ marginTop: "8px" }}>
                  <span style={{ display: "inline-block", background: `${accent}18`, color: accent, fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "3px 8px", borderRadius: "99px", border: `1px solid ${accent}44` }}>
                    ↻ {recurring}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── CLASSIC header ──────────────────────────────────────────────── */}
      {!isModern && !isMinimal && (
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "start" }}>
            {/* Left — business */}
            <div>
              {business.logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={business.logo} alt="Logo" style={{ height: "48px", objectFit: "contain", marginBottom: "10px", display: "block" }} />
              )}
              <div style={{ fontSize: "20px", fontWeight: 700 }}>{business.name || "Your Business"}</div>
              {business.email   && <div style={{ color: "#6b7280", fontSize: "12px", marginTop: "4px" }}>{business.email}</div>}
              {business.phone   && <div style={{ color: "#6b7280", fontSize: "12px" }}>{business.phone}</div>}
              {business.address && <div style={{ color: "#6b7280", fontSize: "12px", whiteSpace: "pre-wrap", marginTop: "2px" }}>{business.address}</div>}
            </div>

            {/* Right — invoice meta */}
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "30px", fontWeight: 800, color: accent, letterSpacing: "-1px", lineHeight: 1 }}>INVOICE</div>
              <div style={{ fontFamily: "monospace", color: "#374151", fontSize: "13px", marginTop: "6px" }}>{invoice.invoiceNumber}</div>
              <table style={{ marginTop: "12px", marginLeft: "auto", fontSize: "12px", borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td style={{ color: "#9ca3af", paddingRight: "12px", paddingBottom: "4px", textAlign: "right" }}>Invoice Date</td>
                    <td style={{ fontWeight: 600, color: "#111827", paddingBottom: "4px", textAlign: "right", minWidth: "100px" }}>{safeDate(invoice.issueDate)}</td>
                  </tr>
                  <tr>
                    <td style={{ color: "#9ca3af", paddingRight: "12px", textAlign: "right" }}>Due Date</td>
                    <td style={{ fontWeight: 600, color: "#111827", textAlign: "right" }}>{safeDate(invoice.dueDate)}</td>
                  </tr>
                </tbody>
              </table>
              {recurring && (
                <div style={{ marginTop: "10px" }}>
                  <span style={{ display: "inline-block", background: `${accent}18`, color: accent, fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "3px 8px", borderRadius: "99px", border: `1px solid ${accent}44` }}>
                    ↻ {recurring}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div style={{ borderTop: `3px solid ${accent}`, marginTop: "20px" }} />
        </div>
      )}

      {/* Bill To + Dates (non-modern) */}
      {!isModern && (
        <div style={{ marginBottom: "32px" }}>
          <div style={{ fontSize: "11px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Bill To</div>
          <div style={{ fontWeight: 600 }}>{client.name || "Client Name"}</div>
          <div style={{ color: "#6b7280", fontSize: "12px" }}>{client.email} {client.phone ? `• ${client.phone}` : ""}</div>
          <div style={{ color: "#6b7280", fontSize: "12px", whiteSpace: "pre-wrap" }}>{client.address}</div>
          {isMinimal && (
            <div style={{ marginTop: "8px", fontSize: "12px", color: "#6b7280" }}>
              Issued {safeDate(invoice.issueDate)} · Due {safeDate(invoice.dueDate)}
            </div>
          )}
        </div>
      )}

      {isModern && (
        <div style={{ marginBottom: "32px" }}>
          <div style={{ fontSize: "11px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Bill To</div>
          <div style={{ fontWeight: 600 }}>{client.name || "Client Name"}</div>
          <div style={{ color: "#6b7280", fontSize: "12px" }}>{client.email} {client.phone ? `• ${client.phone}` : ""}</div>
          <div style={{ color: "#6b7280", fontSize: "12px", whiteSpace: "pre-wrap" }}>{client.address}</div>
        </div>
      )}

      {/* Line Items Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "24px" }}>
        <thead>
          <tr style={{ background: isMinimal ? "transparent" : accent, color: isMinimal ? "#6b7280" : "#fff" }}>
            {["Description", "Qty", "Unit Price", "Tax", "Disc", "Total"].map((h, i) => (
              <th
                key={h}
                style={{
                  padding: "8px 10px",
                  textAlign: i === 0 ? "left" : "right",
                  fontSize: "11px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  borderBottom: isMinimal ? "1px solid #e5e7eb" : "none",
                  color: isMinimal ? "#6b7280" : "#fff",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lineItems.map((item, idx) => {
            const { total } = calcLineItem(item);
            const bg = idx % 2 === 0 ? "#f9fafb" : "#fff";
            return (
              <tr key={item.id} style={{ background: isMinimal ? "transparent" : bg }}>
                <td style={{ padding: "9px 10px", borderBottom: "1px solid #f3f4f6" }}>{item.description}</td>
                <td style={{ padding: "9px 10px", textAlign: "right", borderBottom: "1px solid #f3f4f6" }}>{item.quantity}</td>
                <td style={{ padding: "9px 10px", textAlign: "right", borderBottom: "1px solid #f3f4f6", fontFamily: "monospace" }}>{fmt(item.unitPrice)}</td>
                <td style={{ padding: "9px 10px", textAlign: "right", borderBottom: "1px solid #f3f4f6" }}>{item.taxRate}%</td>
                <td style={{ padding: "9px 10px", textAlign: "right", borderBottom: "1px solid #f3f4f6" }}>{item.discount > 0 ? `${item.discount}%` : "—"}</td>
                <td style={{ padding: "9px 10px", textAlign: "right", fontWeight: 600, borderBottom: "1px solid #f3f4f6", fontFamily: "monospace" }}>{fmt(total)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "32px" }}>
        <div style={{ width: "220px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", color: "#6b7280", fontSize: "12px" }}>
            <span>Subtotal</span><span style={{ fontFamily: "monospace" }}>{fmt(subtotal)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", color: "#6b7280", fontSize: "12px" }}>
            <span>Tax</span><span style={{ fontFamily: "monospace" }}>{fmt(totalTax)}</span>
          </div>
          <div style={{ borderTop: `2px solid ${accent}`, marginTop: "8px", paddingTop: "8px", display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "15px" }}>
            <span>Total Due</span><span style={{ fontFamily: "monospace", color: accent }}>{fmt(grand)}</span>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      {paymentMethods && paymentMethods.length > 0 && (
        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "20px", marginBottom: "20px" }}>
          <div style={{ fontWeight: 600, color: accent, marginBottom: "12px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Payment Information
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px", fontSize: "12px" }}>
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                style={{
                  background: "#f9fafb",
                  borderRadius: "6px",
                  padding: "12px",
                  border: `1px solid ${accent}33`,
                  borderLeft: `3px solid ${accent}`,
                }}
              >
                <div style={{ fontWeight: 700, color: accent, marginBottom: "6px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {method.label}
                </div>
                {method.details.trim() ? (
                  <div style={{ color: "#374151", whiteSpace: "pre-wrap", fontFamily: "monospace", fontSize: "11px", lineHeight: "1.7" }}>
                    {method.details}
                  </div>
                ) : (
                  <div style={{ color: "#9ca3af", fontSize: "11px", fontStyle: "italic" }}>
                    Add your payment details in the form
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes & Terms — pinned to the bottom of the page */}
      {(notes || terms) && (
        <div style={{ marginTop: "auto", borderTop: "1px solid #e5e7eb", paddingTop: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", fontSize: "12px" }}>
          {notes && (
            <div>
              <div style={{ fontWeight: 600, color: accent, marginBottom: "4px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Notes</div>
              <div style={{ color: "#374151", whiteSpace: "pre-wrap" }}>{notes}</div>
            </div>
          )}
          {terms && (
            <div>
              <div style={{ fontWeight: 600, color: accent, marginBottom: "4px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Terms</div>
              <div style={{ color: "#374151", whiteSpace: "pre-wrap" }}>{terms}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

InvoicePreview.displayName = "InvoicePreview";
