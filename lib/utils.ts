import { Heading } from '@/features/posts/types';
import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMarkdownHeadings(markdown: string): Heading[] {
  const headingRegex = /^(##\s+(.+)|###\s+(.+))/gm;
  const toc: Heading[] = [];
  let currentH2: Heading | null = null;

  markdown.replace(headingRegex, (_, __, h2, h3) => {
    if (h2) {
      currentH2 = {
        text: h2,
        level: 2,
        children: [],
      };
      toc.push(currentH2);
    } else if (h3 && currentH2) {
      currentH2.children.push({
        text: h3,
        level: 3,
        children: [],
      });
    }
    return '';
  });

  return toc;
}
