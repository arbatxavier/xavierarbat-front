import { NextResponse } from "next/server";
import { projects } from "@/app/data/projects";

export async function GET() {
  // Simulate a bit of delay or DB fetch
  return NextResponse.json(projects);
}
