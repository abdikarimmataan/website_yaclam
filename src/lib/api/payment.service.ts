import { api } from "@/api/http";
import type { PurchaseRecord } from "@/lib/api/purchase.service";
import type { CourseApiRecord } from "@/lib/api/course.types";

const BASE = "/payment";

export type PaymentResult = {
  message: string;
  transactionId: string;
  transaction?: {
    id: string;
    transactionId: string;
    amount: number;
    phone: string;
    courseId: string | CourseApiRecord;
    created_at?: string;
  };
  purchase?: PurchaseRecord;
};

export type TransactionRecord = {
  id: string;
  transactionId: string;
  phone: string;
  amount: number;
  courseId: CourseApiRecord | string;
  courseInfo?: {
    title?: string;
    price?: number;
    instructorName?: string;
  };
  created_at?: string;
  date?: string;
};

export type PaginatedTransactions = {
  page: number;
  pages: number;
  pageSize: number;
  rows: number;
  data: TransactionRecord[];
};

export async function payForCourse(phone: string, courseId: string): Promise<PaymentResult> {
  return api.post<PaymentResult>(`${BASE}/pay`, { phone, courseId });
}

export type PaymentMethodOption = {
  id: "waafipay" | "stripe";
  label: string;
  description: string;
};

export type PaymentMethodsResponse = {
  methods: PaymentMethodOption[];
  stripePublicKey: string | null;
};

export async function getPaymentMethods(): Promise<PaymentMethodsResponse> {
  const res = await api.get<{ methods?: PaymentMethodOption[]; stripePublicKey?: string | null }>(
    `${BASE}/methods`
  );
  return {
    methods: Array.isArray(res?.methods) ? res.methods : [],
    stripePublicKey: res?.stripePublicKey ?? null,
  };
}

export async function createStripeIntent(
  courseId: string
): Promise<{ clientSecret: string; paymentIntentId: string }> {
  return api.post<{ clientSecret: string; paymentIntentId: string }>(`${BASE}/stripe/intent`, {
    courseId,
  });
}

export async function confirmStripePayment(paymentIntentId: string): Promise<PaymentResult> {
  return api.post<PaymentResult>(`${BASE}/stripe/confirm`, { paymentIntentId });
}

export async function createStripeCheckout(
  courseId: string,
  cancelUrl: string
): Promise<{ checkoutUrl: string; sessionId: string }> {
  return api.post<{ checkoutUrl: string; sessionId: string }>(`${BASE}/stripe/checkout`, {
    courseId,
    cancelUrl,
  });
}

export async function confirmStripeCheckout(sessionId: string): Promise<PaymentResult> {
  return api.post<PaymentResult>(`${BASE}/stripe/confirm`, { sessionId });
}

export async function getMyTransactions(page = 1, pageSize = 50): Promise<TransactionRecord[]> {
  try {
    const res = await api.get<PaginatedTransactions | { message?: string }>(
      `${BASE}/my-transactions?page=${page}&pageSize=${pageSize}`
    );
    if (!res || !("data" in res) || !Array.isArray(res.data)) return [];
    return res.data;
  } catch {
    return [];
  }
}
