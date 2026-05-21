"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { Invoice, LineItem, PaymentMethod } from "@/types/invoice";
import { saveInvoice, saveBusiness } from "@/lib/storage";

interface InvoiceContextType {
  invoice: Invoice;
  setInvoice: React.Dispatch<React.SetStateAction<Invoice>>;
  updateField: <K extends keyof Invoice>(key: K, value: Invoice[K]) => void;
  updateBusiness: (field: keyof Invoice["business"], value: string) => void;
  updateClient: (field: keyof Invoice["client"], value: string) => void;
  updateSettings: (field: keyof Invoice["settings"], value: string) => void;
  addLineItem: () => void;
  removeLineItem: (id: string) => void;
  updateLineItem: (id: string, field: keyof LineItem, value: string | number) => void;
  addPaymentMethod: (method: PaymentMethod) => void;
  removePaymentMethod: (id: string) => void;
  updatePaymentMethod: (id: string, field: keyof PaymentMethod, value: string) => void;
  save: () => void;
  isDirty: boolean;
  saveError: string | null;
}

const InvoiceContext = createContext<InvoiceContextType | null>(null);

export function InvoiceProvider({ children, initial }: { children: React.ReactNode; initial: Invoice }) {
  const [invoice, setInvoice] = useState<Invoice>(initial);
  const [isDirty, setIsDirty] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mark = () => setIsDirty(true);

  // Auto-save 800 ms after the last change so the invoice is always in storage
  useEffect(() => {
    if (!isDirty) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      try {
        saveInvoice(invoice);
        saveBusiness(invoice.business);
        setIsDirty(false);
        setSaveError(null);
      } catch (e) {
        setSaveError(e instanceof Error ? e.message : "Failed to save.");
      }
    }, 800);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [invoice, isDirty]);

  const updateField = useCallback(<K extends keyof Invoice>(key: K, value: Invoice[K]) => {
    setInvoice((prev) => ({ ...prev, [key]: value, updatedAt: new Date().toISOString() }));
    mark();
  }, []);

  const updateBusiness = useCallback((field: keyof Invoice["business"], value: string) => {
    setInvoice((prev) => ({
      ...prev,
      business: { ...prev.business, [field]: value },
      updatedAt: new Date().toISOString(),
    }));
    mark();
  }, []);

  const updateClient = useCallback((field: keyof Invoice["client"], value: string) => {
    setInvoice((prev) => ({
      ...prev,
      client: { ...prev.client, [field]: value },
      updatedAt: new Date().toISOString(),
    }));
    mark();
  }, []);

  const updateSettings = useCallback((field: keyof Invoice["settings"], value: string) => {
    setInvoice((prev) => ({
      ...prev,
      settings: { ...prev.settings, [field]: value },
      updatedAt: new Date().toISOString(),
    }));
    mark();
  }, []);

  const addLineItem = useCallback(() => {
    const newItem: LineItem = { id: uuidv4(), description: "", quantity: 1, unitPrice: 0, taxRate: 0, discount: 0 };
    setInvoice((prev) => ({
      ...prev,
      lineItems: [...prev.lineItems, newItem],
      updatedAt: new Date().toISOString(),
    }));
    mark();
  }, []);

  const removeLineItem = useCallback((id: string) => {
    setInvoice((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((i) => i.id !== id),
      updatedAt: new Date().toISOString(),
    }));
    mark();
  }, []);

  const updateLineItem = useCallback((id: string, field: keyof LineItem, value: string | number) => {
    setInvoice((prev) => ({
      ...prev,
      lineItems: prev.lineItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
      updatedAt: new Date().toISOString(),
    }));
    mark();
  }, []);

  const addPaymentMethod = useCallback((method: PaymentMethod) => {
    setInvoice((prev) => ({
      ...prev,
      paymentMethods: [...(prev.paymentMethods ?? []), method],
      updatedAt: new Date().toISOString(),
    }));
    mark();
  }, []);

  const removePaymentMethod = useCallback((id: string) => {
    setInvoice((prev) => ({
      ...prev,
      paymentMethods: (prev.paymentMethods ?? []).filter((m) => m.id !== id),
      updatedAt: new Date().toISOString(),
    }));
    mark();
  }, []);

  const updatePaymentMethod = useCallback((id: string, field: keyof PaymentMethod, value: string) => {
    setInvoice((prev) => ({
      ...prev,
      paymentMethods: (prev.paymentMethods ?? []).map((m) =>
        m.id === id ? { ...m, [field]: value } : m
      ),
      updatedAt: new Date().toISOString(),
    }));
    mark();
  }, []);

  const save = useCallback(() => {
    try {
      saveInvoice(invoice);
      saveBusiness(invoice.business);
      setIsDirty(false);
      setSaveError(null);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Failed to save.");
    }
  }, [invoice]);

  return (
    <InvoiceContext.Provider
      value={{ invoice, setInvoice, updateField, updateBusiness, updateClient, updateSettings, addLineItem, removeLineItem, updateLineItem, addPaymentMethod, removePaymentMethod, updatePaymentMethod, save, isDirty, saveError }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoice() {
  const ctx = useContext(InvoiceContext);
  if (!ctx) throw new Error("useInvoice must be used within InvoiceProvider");
  return ctx;
}
