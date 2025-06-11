'use client';

import { useEffect, useRef, useState } from 'react';
import 'quill/dist/quill.snow.css';
import type QuillType from 'quill';

export default function QuillEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [quillInstance, setQuillInstance] = useState<QuillType | null>(null);

  useEffect(() => {
    if (!wrapperRef.current || quillInstance) return;

    const editorDiv = document.createElement('div');
    wrapperRef.current.innerHTML = ''; // 🧹 Clear previous renders
    wrapperRef.current.appendChild(editorDiv);

    import('quill').then((Quill) => {
      const quill = new Quill.default(editorDiv, {
        theme: 'snow',
      });

      quill.root.innerHTML = value;

      quill.on('text-change', () => {
        onChange(quill.root.innerHTML);
      });

      setQuillInstance(quill);
    });
  }, [quillInstance, onChange, value]);

  return <div ref={wrapperRef} />;
}
