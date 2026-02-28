import React from 'react';
import ReactMarkdown from 'react-markdown';
import { parseBlocks } from '../services/apiService';

/**
 * BlockRenderer - Renders WordPress blocks with support for custom design elements
 */
function BlockRenderer({ content, className = '' }) {
  if (!content) {
    return null;
  }

  // Simple HTML rendering for now
  // In the future, this can be extended to support custom ACF blocks
  const sanitizeHtml = (html) => {
    // Remove script tags
    return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  };

  return (
    <div
      className={`prose prose-slate max-w-none ${className}`}
      dangerouslySetInnerHTML={{
        __html: sanitizeHtml(content),
      }}
    />
  );
}

/**
 * CustomBlockRenderer - Handles custom design blocks with enhanced styling
 */
function CustomBlockRenderer({ blockType, attributes, content }) {
  switch (blockType) {
    case 'heading':
      const level = (attributes?.level || 2);
      const headingClass = {
        1: 'text-4xl',
        2: 'text-3xl',
        3: 'text-2xl',
        4: 'text-xl',
        5: 'text-lg',
        6: 'text-base',
      }[level];

      return (
        <div className={`${headingClass} font-bold mb-4 text-slate-900`}>
          <BlockRenderer content={content} />
        </div>
      );

    case 'paragraph':
      return (
        <p className="mb-4 text-slate-700 leading-7">
          <BlockRenderer content={content} />
        </p>
      );

    case 'image':
      return (
        <figure className="my-8">
          <img
            src={attributes?.url}
            alt={attributes?.alt || 'Image'}
            className="w-full rounded-lg shadow-md"
          />
          {attributes?.caption && (
            <figcaption className="text-sm text-slate-600 italic mt-2 text-center">
              {attributes.caption}
            </figcaption>
          )}
        </figure>
      );

    case 'quote':
      return (
        <blockquote className="border-l-4 border-primary-600 pl-4 my-6 italic text-slate-700 bg-slate-50 p-4 rounded">
          <BlockRenderer content={content} />
        </blockquote>
      );

    case 'list':
      const Tag = attributes?.ordered ? 'ol' : 'ul';
      const listClass = attributes?.ordered ? 'list-decimal' : 'list-disc';

      return (
        <Tag className={`${listClass} pl-5 mb-4 space-y-2`}>
          <BlockRenderer content={content} />
        </Tag>
      );

    case 'code':
      return (
        <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto mb-4">
          <code>{content}</code>
        </pre>
      );

    case 'custom-highlight':
    case 'spark/highlight':
      return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded">
          <p className="font-medium text-yellow-900 mb-1">💡 Important</p>
          <BlockRenderer content={content} className="text-yellow-800" />
        </div>
      );

    case 'custom-alert':
    case 'spark/alert':
      const alertTypes = {
        success: 'bg-green-50 border-green-400 text-green-900',
        error: 'bg-red-50 border-red-400 text-red-900',
        warning: 'bg-yellow-50 border-yellow-400 text-yellow-900',
        info: 'bg-blue-50 border-blue-400 text-blue-900',
      };

      const alertClass = alertTypes[attributes?.type] || alertTypes.info;

      return (
        <div className={`border-l-4 p-4 mb-4 rounded ${alertClass}`}>
          <BlockRenderer content={content} />
        </div>
      );

    case 'custom-gallery':
    case 'spark/gallery-advanced':
      // Supports gallery block JSON
      const images = attributes?.images || [];
      return (
        <div className="my-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img.url}
              alt={img.alt || 'Gallery image'}
              className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
            />
          ))}
        </div>
      );

    case 'custom-cta':
    case 'spark/cta':
      // Call-to-action block
      return (
        <div className="bg-gradient-to-r from-primary-600 to-primary-400 rounded-lg p-8 mb-4 text-white text-center">
          <BlockRenderer content={content} />
          {attributes?.buttonText && (
            <a
              href={attributes?.buttonUrl || '#'}
              className="inline-block mt-4 bg-white text-primary-600 px-6 py-2 rounded-lg font-medium hover:bg-slate-100 transition-colors"
            >
              {attributes.buttonText}
            </a>
          )}
        </div>
      );

    case 'separator':
      return <hr className="my-8 border-slate-200" />;

    case 'spacer':
      const height = attributes?.height || 32;
      return <div style={{ height: `${height}px` }} />;

    default:
      // Fallback for unknown blocks
      return (
        <div className="mb-4 p-4 bg-slate-100 rounded border border-slate-300">
          <BlockRenderer content={content} />
        </div>
      );
  }
}

/**
 * ContentRenderer - Main component for rendering full post content
 */
function ContentRenderer({ content, useBlocks = false }) {
  if (!content) {
    return null;
  }

  if (useBlocks) {
    try {
      const blocks = parseBlocks(content);
      return (
        <div className="prose-container">
          {blocks.map((block, idx) => (
            <CustomBlockRenderer
              key={idx}
              blockType={block.type}
              attributes={block.attributes}
              content={block.content}
            />
          ))}
        </div>
      );
    } catch (error) {
      console.error('Error parsing blocks:', error);
    }
  }

  // Fallback to simple rendering
  return <BlockRenderer content={content} />;
}

export default ContentRenderer;
export { BlockRenderer, CustomBlockRenderer };
