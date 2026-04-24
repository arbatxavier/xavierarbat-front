import { NextResponse } from "next/server";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "en";
  const slug = searchParams.get("slug");

  if (slug) {
    const post = getPostBySlug(locale, slug);
    return post 
      ? NextResponse.json(post) 
      : NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const posts = getAllPosts(locale);
  return NextResponse.json(posts);
}
