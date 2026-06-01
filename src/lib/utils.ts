import path from "path";

const SAFE_SLUG = /^[a-z0-9-]+$/;

export function isSafeSlug(slug: string): boolean {
  return SAFE_SLUG.test(slug);
}

export function isSafeUrl(url: string): boolean {
  try {
    const { protocol } = new URL(url);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

export function safeResolve(dir: string, filename: string): string | null {
  const resolved = path.resolve(dir, filename);
  return resolved.startsWith(dir + path.sep) ? resolved : null;
}
