import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { getYear } from 'date-fns';
import { TreePalm } from 'lucide-react';
import LoadingBar from './loading-bar';

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-8 dark:bg-gray-800">
      <div className="container mx-auto">
        <nav className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <section className="flex flex-col gap-2">
            <h2 className="flex items-center gap-2 text-neutral-600 dark:text-neutral-200">
              <TreePalm className="h-8 w-8" />
              <span className="text-md font-semibold">Sunny&apos;s Blog</span>
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Think, Write, Code</p>
            <ul className="flex items-center gap-2">
              <li>
                <a href="https://github.com/sdrpsps" target="_blank" rel="noopener noreferrer" aria-label="Github">
                  <GitHubLogoIcon className="h-6 w-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" />
                </a>
              </li>
            </ul>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-semibold text-neutral-600 dark:text-neutral-200">Links</h2>
            <ul className="flex flex-col gap-2 text-sm text-gray-500 dark:text-gray-400">
              <li className="hover:text-gray-700 dark:hover:text-gray-300">
                <a href="mailto:sunny@bytespark.me">Contact Me</a>
              </li>
              <li className="hover:text-gray-700 dark:hover:text-gray-300">
                <a href="/sitemap.xml">Sitemap</a>
              </li>
            </ul>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-semibold text-neutral-600 dark:text-neutral-200">To Be Done</h2>
            <LoadingBar />
          </section>
        </nav>
        <hr className="my-4 border-t border-gray-200 dark:border-gray-700" />
        <div className="flex items-center justify-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; 2024 - {getYear(new Date())} Sunny. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
