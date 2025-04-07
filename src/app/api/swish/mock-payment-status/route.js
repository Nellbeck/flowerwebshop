import { NextResponse } from "next/server";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
  
    if (!id) {
      return new Response("Missing payment ID", { status: 400 });
    }
  
    const isPaid = Math.random() > 0.5;

    await new Promise(resolve => setTimeout(resolve, 3000));  // 2 seconds delay
  
    return NextResponse.json({ id, status: isPaid ? "PAID" : "PENDING" });
  }
