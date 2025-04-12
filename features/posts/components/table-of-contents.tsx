import { Heading } from '@/features/posts/types';

function HeadingItem({ heading, depth = 0 }: { heading: Heading; depth?: number }) {
  return (
    <li>
      <a
        href={`#${heading.text}`}
        className={`block rounded px-3 py-2 text-gray-700 transition-colors duration-150 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white ${depth > 0 ? 'text-sm' : 'font-medium'} `}
        style={{ paddingLeft: `${depth * 0.75 + 0.75}rem` }}
      >
        {heading.text}
      </a>
      {heading.children && heading.children.length > 0 && (
        <ul>
          {heading.children.map((child) => (
            <HeadingItem key={child.text} heading={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function TableOfContent({ headings }: { headings: Heading[] }) {
  return (
    <nav className="rounded-lg bg-gray-100 p-4 shadow-md dark:bg-gray-800">
      <h2 className="mb-4 border-b border-gray-300 pb-2 text-xl font-bold text-gray-800 dark:border-gray-700 dark:text-gray-200">
        Table of Contents
      </h2>
      <ul>
        {headings.map((heading) => (
          <HeadingItem key={heading.text} heading={heading} />
        ))}
      </ul>
    </nav>
  );
}
