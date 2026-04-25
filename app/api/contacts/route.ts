import { NextResponse } from "next/server";
import { contactChannels } from "@/app/data/contacts";

export async function GET() {
  return NextResponse.json(contactChannels);
}
