import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function redirectMiddleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 检查是否是旧的博客链接格式
  const oldBlogPattern = /^\/blog\/[^/]+\/([^/]+)$/;
  const match = path.match(oldBlogPattern);

  if (match) {
    const slug = match[1];
    // 重定向到新的格式
    return NextResponse.redirect(new URL(`/posts/${slug}`, request.url));
  }

  return NextResponse.next();
}
