import { NextResponse } from "next/server";
import { TAG_KEYS } from "@/app/data/tags";

export async function GET() {
  return NextResponse.json(TAG_KEYS);
}
