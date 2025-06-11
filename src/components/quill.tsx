'use client'

import React, { useEffect, useRef } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

type QuillEditorProps = {
  value: string
  onChange: (content: string) => void
}

export default function QuillEditor({ value, onChange }: QuillEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const quillRef = useRef<Quill | null>(null)

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: 'Write your event description...',
      })

      // Listen for text changes
      quillRef.current.on('text-change', () => {
        const html = editorRef.current?.querySelector('.ql-editor')?.innerHTML || ''
        onChange(html)
      })

      // Set initial content
      quillRef.current.root.innerHTML = value
    }
  }, [])

  return (
    <div className="border border-gray-300 rounded-md">
      <div ref={editorRef} />
    </div>
  )
}
