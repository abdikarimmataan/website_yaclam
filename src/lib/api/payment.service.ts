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
