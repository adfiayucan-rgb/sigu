"use client";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div
      className={cn(
        "prose prose-sm dark:prose-invert max-w-none",
        "prose-headings:text-foreground prose-p:text-foreground",
        "prose-strong:text-foreground prose-code:text-primary",
        "prose-pre:bg-muted prose-pre:border prose-pre:border-border",
        "[&_.katex]:text-foreground [&_.katex-display]:overflow-x-auto",
        "[&_.katex-display]:py-2 [&_.katex]:text-base",
        "prose-table:border-collapse prose-th:border prose-th:border-border prose-th:p-2 prose-td:border prose-td:border-border prose-td:p-2",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // Personalizamos las etiquetas de la tabla
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table className="w-full border-collapse border border-border" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th className="border border-border bg-muted px-4 py-2 text-left font-bold" {...props} />
          ),
          td: ({ node, ...props }) => <td className="border border-border px-4 py-2" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
