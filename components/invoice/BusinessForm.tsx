"use client";

import { useRef, useState } from "react";
import { useInvoice } from "./InvoiceContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";

/** Resize + re-encode to JPEG so logos never exceed ~25 KB in base64. */
async function compressImage(file: File, maxPx = 400, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Failed to load image")); };
    img.src = url;
  });
}

export function BusinessForm() {
  const { invoice, updateBusiness } = useInvoice();
  const { business } = invoice;
  const fileRef = useRef<HTMLInputElement>(null);
  const [compressing, setCompressing] = useState(false);

  async function handleLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCompressing(true);
    try {
      const compressed = await compressImage(file);
      updateBusiness("logo", compressed);
    } catch {
      // fall back to raw data URL if canvas compression fails
      const reader = new FileReader();
      reader.onload = () => updateBusiness("logo", reader.result as string);
      reader.readAsDataURL(file);
    } finally {
      setCompressing(false);
      // Reset so same file can be re-selected
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Your Business</h3>

      <div className="flex items-start gap-4">
        <div className="flex-1 space-y-3">
          <div>
            <Label htmlFor="biz-name">Business name</Label>
            <Input id="biz-name" value={business.name} onChange={(e) => updateBusiness("name", e.target.value)} placeholder="Acme Inc." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="biz-email">Email</Label>
              <Input id="biz-email" type="email" value={business.email} onChange={(e) => updateBusiness("email", e.target.value)} placeholder="you@example.com" />
            </div>
            <div>
              <Label htmlFor="biz-phone">Phone</Label>
              <Input id="biz-phone" value={business.phone} onChange={(e) => updateBusiness("phone", e.target.value)} placeholder="+1 555 000 0000" />
            </div>
          </div>
          <div>
            <Label htmlFor="biz-address">Address</Label>
            <Textarea id="biz-address" value={business.address} onChange={(e) => updateBusiness("address", e.target.value)} placeholder="123 Main St, City, Country" rows={2} />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 pt-6">
          {compressing ? (
            <div className="w-20 h-20 border rounded flex items-center justify-center">
              <Loader2 size={18} className="animate-spin text-muted-foreground" />
            </div>
          ) : business.logo ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={business.logo} alt="Logo" className="w-20 h-20 object-contain rounded border" />
              <button
                onClick={() => updateBusiness("logo", "")}
                className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              className="w-20 h-20 border-2 border-dashed rounded flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
            >
              <Upload size={18} className="text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground mt-1">Logo</span>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogo} />
          <Button variant="ghost" size="sm" className="text-xs" onClick={() => fileRef.current?.click()} disabled={compressing}>
            {business.logo ? "Change" : "Upload"}
          </Button>
        </div>
      </div>
    </div>
  );
}
