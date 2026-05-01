'use client'

import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { cn } from '@/lib/utils'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div
      className={cn(
        'prose prose-sm dark:prose-invert max-w-none',
        'prose-headings:text-foreground prose-p:text-foreground',
        'prose-strong:text-foreground prose-code:text-primary',
        'prose-pre:bg-muted prose-pre:border prose-pre:border-border',
        '[&_.katex]:text-foreground [&_.katex-display]:overflow-x-auto',
        '[&_.katex-display]:py-2 [&_.katex]:text-base',
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
