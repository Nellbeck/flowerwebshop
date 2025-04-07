import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const mockPayments = new Map();

export async function POST(req) {
  const { amount } = await req.json();
  const paymentId = uuidv4();

  // Store the mock payment
  mockPayments.set(paymentId, {
    status: "PENDING",
    amount,
    createdAt: Date.now()
  });

  return NextResponse.json({ paymentId, status: "PENDING" });
}

