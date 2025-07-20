import React, { useMemo } from 'react';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import { Block, BlockNoteEditor, PartialBlock } from '@blocknote/core';
import '@blocknote/mantine/style.css';
import { useTheme } from '@/hooks/useTheme';

interface NotionEditorProps {
  initialContent?: PartialBlock[];
  onContentChange?: (blocks: Block[]) => void;
  editable?: boolean;
}

const NotionEditor: React.FC<NotionEditorProps> = ({
  initialContent = [],
  onContentChange,
  editable = true,
}) => {
  const { theme } = useTheme();

  // Create editor instance with initial content
  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialContent.length > 0 ? initialContent : [
      {
        type: "paragraph",
        content: "Start writing or type '/' for commands...",
      },
    ],
  });

  // Handle content changes
  const handleChange = () => {
    if (onContentChange) {
      onContentChange(editor.document);
    }
  };

  // Memoize the editor theme based on current theme
  const editorTheme = useMemo(() => {
    return theme === 'dark' ? 'dark' : 'light';
  }, [theme]);

  // Memoize styles to update when theme changes
  const editorStyles = useMemo(() => `
        /* Reset and full height layout */
        .notion-editor-wrapper {
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: transparent;
        }

        .blocknote-editor {
          height: 100% !important;
          width: 100% !important;
          background-color: transparent !important;
          border: none !important;
          outline: none !important;
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        /* Ensure ProseMirror takes full height and scrolls */
        .blocknote-editor .ProseMirror {
          height: 100% !important;
          width: 100% !important;
          overflow-y: auto !important;
          overflow-x: hidden !important;
          padding: 1.5rem !important;
          margin: 0 !important;
          border: none !important;
          outline: none !important;
          background: transparent !important;
          font-size: 16px;
          line-height: 1.6;
          color: hsl(var(--foreground)) !important;
        }

        /* Remove any white borders or backgrounds */
        .blocknote-editor,
        .blocknote-editor * {
          border-color: transparent !important;
          box-shadow: none !important;
        }

        /* Typography improvements with better contrast */
        .blocknote-editor .ProseMirror h1 {
          font-size: 2.25rem !important;
          font-weight: 700 !important;
          margin: 1.5rem 0 0.75rem 0 !important;
          color: hsl(var(--foreground)) !important;
        }

        .blocknote-editor .ProseMirror h2 {
          font-size: 1.875rem !important;
          font-weight: 600 !important;
          margin: 1.25rem 0 0.625rem 0 !important;
          color: hsl(var(--foreground)) !important;
        }

        .blocknote-editor .ProseMirror h3 {
          font-size: 1.5rem !important;
          font-weight: 600 !important;
          margin: 1rem 0 0.5rem 0 !important;
          color: hsl(var(--foreground)) !important;
        }

        .blocknote-editor .ProseMirror p {
          margin: 0.75rem 0 !important;
          color: hsl(var(--foreground)) !important;
        }

        .blocknote-editor .ProseMirror ul,
        .blocknote-editor .ProseMirror ol {
          margin: 0.75rem 0 !important;
          padding-left: 1.5rem !important;
        }

        .blocknote-editor .ProseMirror li {
          margin: 0.375rem 0 !important;
          color: hsl(var(--foreground)) !important;
        }

        .blocknote-editor .ProseMirror blockquote {
          border-left: 4px solid hsl(var(--primary)) !important;
          padding-left: 1rem !important;
          margin: 1rem 0 !important;
          font-style: italic;
          background-color: hsl(var(--muted)) !important;
          border-radius: 0.375rem;
          padding: 1rem !important;
          color: hsl(var(--foreground)) !important;
        }

        .blocknote-editor .ProseMirror pre {
          background-color: hsl(var(--muted)) !important;
          border: 1px solid hsl(var(--border)) !important;
          border-radius: 0.5rem !important;
          padding: 1rem !important;
          margin: 1rem 0 !important;
          overflow-x: auto !important;
          font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace !important;
          font-size: 14px !important;
          color: hsl(var(--foreground)) !important;
        }

        .blocknote-editor .ProseMirror code {
          background-color: hsl(var(--muted)) !important;
          border: 1px solid hsl(var(--border)) !important;
          border-radius: 0.25rem !important;
          padding: 0.25rem 0.375rem !important;
          font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace !important;
          font-size: 0.875em !important;
          color: hsl(var(--primary)) !important;
        }

        /* Improved Slash Menu Styling with Better Contrast */
        .bn-suggestion-menu {
          background-color: hsl(var(--card)) !important;
          border: 2px solid hsl(var(--border)) !important;
          border-radius: 0.75rem !important;
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04) !important;
          padding: 0.5rem !important;
          min-width: 250px !important;
        }

        .bn-suggestion-menu-item {
          color: hsl(var(--card-foreground)) !important;
          border-radius: 0.5rem !important;
          padding: 0.75rem 1rem !important;
          margin: 0.125rem 0 !important;
          font-weight: 500 !important;
          transition: all 0.15s ease-in-out !important;
          display: flex !important;
          align-items: center !important;
          gap: 0.75rem !important;
        }

        .bn-suggestion-menu-item:hover,
        .bn-suggestion-menu-item[data-highlighted="true"] {
          background-color: hsl(var(--accent)) !important;
          color: hsl(var(--accent-foreground)) !important;
          transform: translateX(4px) !important;
        }

        .bn-suggestion-menu-item:hover *,
        .bn-suggestion-menu-item[data-highlighted="true"] * {
          color: hsl(var(--accent-foreground)) !important;
        }

        /* Hide Side Menu (Drag Handle and Action Buttons) */
        .bn-side-menu {
          display: none !important;
        }

        /* Formatting Toolbar Enhanced */
        .bn-formatting-toolbar {
          background-color: hsl(var(--card)) !important;
          border: 2px solid hsl(var(--border)) !important;
          border-radius: 0.75rem !important;
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04) !important;
          padding: 0.5rem !important;
          display: flex !important;
          gap: 0.25rem !important;
        }

        .bn-formatting-toolbar-button {
          color: hsl(var(--card-foreground)) !important;
          border: 1px solid hsl(var(--border)) !important;
          border-radius: 0.5rem !important;
          padding: 0.625rem !important;
          background-color: transparent !important;
          transition: all 0.15s ease-in-out !important;
          min-width: 40px !important;
          font-weight: 500 !important;
        }

        .bn-formatting-toolbar-button:hover {
          background-color: hsl(var(--accent)) !important;
          color: hsl(var(--accent-foreground)) !important;
          border-color: hsl(var(--primary)) !important;
          transform: translateY(-1px) !important;
        }

        .bn-formatting-toolbar-button[data-state="on"] {
          background-color: hsl(var(--primary)) !important;
          color: hsl(var(--primary-foreground)) !important;
          border-color: hsl(var(--primary)) !important;
        }

        /* Link Toolbar */
        .bn-link-toolbar {
          background-color: hsl(var(--card)) !important;
          border: 2px solid hsl(var(--border)) !important;
          border-radius: 0.75rem !important;
          padding: 0.75rem !important;
        }

        .bn-link-toolbar input {
          background-color: hsl(var(--background)) !important;
          border: 1px solid hsl(var(--border)) !important;
          border-radius: 0.5rem !important;
          padding: 0.5rem 0.75rem !important;
          color: hsl(var(--foreground)) !important;
          font-size: 14px !important;
        }

        .bn-link-toolbar input:focus {
          outline: none !important;
          border-color: hsl(var(--primary)) !important;
          box-shadow: 0 0 0 2px hsl(var(--primary) / 0.2) !important;
        }

        /* Table Handles */
        .bn-table-handle {
          background-color: hsl(var(--primary)) !important;
          border-radius: 0.25rem !important;
        }

        .bn-table-handle:hover {
          background-color: hsl(var(--primary)) !important;
          opacity: 0.8 !important;
        }

        /* Placeholder Text Styling */
        .ProseMirror p.is-empty::before {
          color: hsl(var(--muted)) !important;
          font-style: italic !important;
          content: attr(data-placeholder) !important;
        }

        /* Focus Styles */
        .blocknote-editor .ProseMirror:focus {
          outline: none !important;
        }

        .blocknote-editor .ProseMirror:focus-visible {
          outline: 2px solid hsl(var(--primary)) !important;
          outline-offset: 2px !important;
        }

        /* Block Selection Styling */
        .ProseMirror-selectednode {
          background-color: hsl(var(--accent)) !important;
          border-radius: 0.375rem !important;
          outline: 2px solid hsl(var(--primary)) !important;
        }

        /* Smooth Animations */
        .bn-suggestion-menu,
        .bn-formatting-toolbar,
        .bn-side-menu,
        .bn-link-toolbar {
          animation: slideInAndFade 0.2s ease-out !important;
        }

        @keyframes slideInAndFade {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Scrollbar Styling */
        .blocknote-editor .ProseMirror::-webkit-scrollbar {
          width: 8px;
        }

        .blocknote-editor .ProseMirror::-webkit-scrollbar-track {
          background: transparent;
        }

        .blocknote-editor .ProseMirror::-webkit-scrollbar-thumb {
          background-color: hsl(var(--border));
          border-radius: 4px;
          transition: background-color 0.2s ease;
        }

        .blocknote-editor .ProseMirror::-webkit-scrollbar-thumb:hover {
          background-color: hsl(var(--accent));
        }

        /* Remove default margins from first/last elements */
        .blocknote-editor .ProseMirror > *:first-child {
          margin-top: 0 !important;
        }

        .blocknote-editor .ProseMirror > *:last-child {
          margin-bottom: 0 !important;
        }

        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .blocknote-editor .ProseMirror {
            padding: 1rem !important;
            font-size: 14px !important;
          }
          
          .bn-suggestion-menu {
            min-width: 200px !important;
          }
          
          .bn-formatting-toolbar {
            flex-wrap: wrap !important;
          }
        }
  `, [theme]);

  return (
    <div className="h-full w-full overflow-hidden bg-transparent">
      <style dangerouslySetInnerHTML={{ __html: editorStyles }} />
      
      <div className="notion-editor-wrapper">
        <BlockNoteView
          editor={editor}
          theme={editorTheme}
          onChange={handleChange}
          editable={editable}
          className="blocknote-editor"
        />
      </div>
    </div>
  );
};

export default NotionEditor;