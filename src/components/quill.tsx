'use client';

import { useEffect, useRef, useState } from 'react';
import 'quill/dist/quill.snow.css';

export default function QuillEditor({ value, onChange }: {
  value: string;
  onChange: (html: string) => void;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [quillInstance, setQuillInstance] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && editorRef.current && !quillInstance) {
      import('quill').then((Quill) => {
        const quill = new Quill.default(editorRef.current!, {
          theme: 'snow',
        });

        quill.on('text-change', () => {
          onChange(quill.root.innerHTML);
        });

        // Set initial value if provided
        quill.root.innerHTML = value;
        setQuillInstance(quill);
      });
    }
  }, [editorRef, quillInstance, value, onChange]);

  return <div ref={editorRef} />;
}
