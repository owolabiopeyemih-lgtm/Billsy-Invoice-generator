"use client";

import { useInvoice } from "./InvoiceContext";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const ACCENT_PRESETS = [
  // Purples & Blues
  "#6366f1", "#818cf8", "#3b82f6", "#0ea5e9", "#06b6d4",
  // Greens & Teals
  "#14b8a6", "#10b981", "#22c55e", "#84cc16",
  // Warm
  "#f59e0b", "#f97316", "#ef4444", "#e11d48",
  // Pinks & Purples
  "#ec4899", "#d946ef", "#8b5cf6", "#7c3aed",
  // Navy
  "#0a1628", "#0f2d5e", "#1e3a5f", "#1d4ed8",
  // Forest Green
  "#14532d", "#166534", "#15803d", "#1a5e2a",
  // Brown
  "#3b1a08", "#6b3a2a", "#92400e", "#78350f",
  // Grey
  "#374151", "#6b7280", "#9ca3af", "#d1d5db",
];

export function TemplateSettings() {
  const { invoice, updateSettings } = useInvoice();
  const { settings } = invoice;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Appearance</h3>
      <div className="flex flex-wrap gap-4 items-end">
        <div className="min-w-[140px]">
          <Label>Template</Label>
          <Select value={settings.template} onValueChange={(v) => v && updateSettings("template", v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="classic">Classic</SelectItem>
              <SelectItem value="minimal">Minimal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Accent Color</Label>
          <div className="mt-1.5 space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {ACCENT_PRESETS.map((color) => (
                <button
                  key={color}
                  onClick={() => updateSettings("accentColor", color)}
                  className="w-6 h-6 rounded-full border-2 transition-all"
                  style={{
                    backgroundColor: color,
                    borderColor: settings.accentColor === color ? "#000" : "transparent",
                    transform: settings.accentColor === color ? "scale(1.2)" : "scale(1)",
                  }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={settings.accentColor}
                onChange={(e) => updateSettings("accentColor", e.target.value)}
                className="w-8 h-8 p-0 border-0 cursor-pointer rounded"
              />
              <span className="text-xs text-muted-foreground font-mono">{settings.accentColor}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
