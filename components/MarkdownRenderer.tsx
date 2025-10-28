import React from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const getMarkdownText = () => {
    if (!content) {
        return { __html: '' };
    }
    const rawMarkup = marked.parse(content, { breaks: true, gfm: true });
    // This check is important for environments where window is not available (SSR)
    const sanitizedMarkup = typeof window !== 'undefined' ? DOMPurify.sanitize(rawMarkup as string) : rawMarkup;
    return { __html: sanitizedMarkup as string };
  };

  return (
    <div
      className="prose dark:prose-invert max-w-none prose-sm sm:prose-base"
      dangerouslySetInnerHTML={getMarkdownText()}
    />
  );
};

export default MarkdownRenderer;
