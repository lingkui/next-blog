'use client';

import { useEffect, useState } from 'react';
import Vditor from 'vditor';
import 'vditor/dist/index.css';

interface EditorProps {
  value?: string;
  onChange?: (value: string) => void;
}

const Editor = ({ value, onChange }: EditorProps) => {
  const [vd, setVd] = useState<Vditor>();

  useEffect(() => {
    const vditor = new Vditor('vditor', {
      minHeight: 400,
      placeholder: 'Write something...',
      mode: 'ir',
      cache: {
        enable: false,
      },
      toolbar: [
        'emoji',
        'headings',
        'bold',
        'italic',
        'strike',
        'link',
        '|',
        'list',
        'ordered-list',
        'check',
        'outdent',
        'indent',
        '|',
        'quote',
        'line',
        'code',
        'inline-code',
        'insert-before',
        'insert-after',
        '|',
        'upload',
        'table',
        '|',
        'undo',
        'redo',
        '|',
        'fullscreen',
        'preview',
        'both',
        'outline',
        'code-theme',
        'content-theme',
        'export',
      ],
      counter: {
        enable: true,
        type: 'text',
      },
      preview: {
        markdown: {
          toc: true,
        },
        math: {
          engine: 'KaTeX',
        },
      },
      input: (value) => {
        onChange?.(value);
      },
      after: () => {
        if (value) {
          vditor.setValue(value);
        }
      },
    });

    setVd(vditor);

    return () => {
      vd?.destroy();
      setVd(undefined);
    };
  }, [onChange]);

  return <div id="vditor" className="vditor" />;
};

export default Editor;
