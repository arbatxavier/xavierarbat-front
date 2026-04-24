import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface BlogPost {
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  content: string;
}

const CONTENT_PATH = path.join(process.cwd(), "content/blog");

export function getAllPosts(locale: string): BlogPost[] {
  const localePath = path.join(CONTENT_PATH, locale);
  
  if (!fs.existsSync(localePath)) {
    return [];
  }

  const files = fs.readdirSync(localePath);
  
  return files
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(".md", "");
      const fullPath = path.join(localePath, file);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        slug,
        date: data.date,
        title: data.title,
        excerpt: data.excerpt,
        content,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostBySlug(locale: string, slug: string): BlogPost | null {
  try {
    const fullPath = path.join(CONTENT_PATH, locale, `${slug}.md`);
    if (!fs.existsSync(fullPath)) return null;

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      date: data.date,
      title: data.title,
      excerpt: data.excerpt,
      content,
    };
  } catch (e) {
    return null;
  }
}
