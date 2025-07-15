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
        content: "Welcome to your Notion-like editor! Type '/' for commands...",
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

  return (
    <div className="notion-editor-container h-full w-full">
      <BlockNoteView
        editor={editor}
        theme={editorTheme}
        onChange={handleChange}
        editable={editable}
        className="blocknote-editor"
        data-theming-css-variables-demo
      />
      
      <style dangerouslySetInnerHTML={{
        __html: `
        /* Custom styles for the editor to match our design system */
        .blocknote-editor {
          background-color: transparent !important;
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        }

        /* Dark mode adjustments */
        .blocknote-editor[data-color-scheme="dark"] {
          --bn-colors-editor-background: transparent;
          --bn-colors-editor-text: hsl(var(--foreground));
          --bn-colors-menu-background: hsl(var(--card));
          --bn-colors-menu-text: hsl(var(--card-foreground));
          --bn-colors-tooltip-background: hsl(var(--card));
          --bn-colors-tooltip-text: hsl(var(--card-foreground));
          --bn-colors-hovered-background: hsl(var(--card-hover));
          --bn-colors-selected-background: hsl(var(--card-hover));
          --bn-colors-disabled-background: hsl(var(--muted));
          --bn-colors-disabled-text: hsl(var(--muted-foreground));
          --bn-colors-shadow: hsl(var(--border));
          --bn-colors-border: hsl(var(--border));
          --bn-colors-side-menu: hsl(var(--card));
          --bn-colors-highlights-gray-background: hsl(var(--muted));
          --bn-colors-highlights-gray-text: hsl(var(--muted-foreground));
          --bn-colors-highlights-brown-background: hsl(30 20% 25%);
          --bn-colors-highlights-brown-text: hsl(30 20% 85%);
          --bn-colors-highlights-red-background: hsl(0 50% 25%);
          --bn-colors-highlights-red-text: hsl(0 50% 85%);
          --bn-colors-highlights-orange-background: hsl(25 50% 25%);
          --bn-colors-highlights-orange-text: hsl(25 50% 85%);
          --bn-colors-highlights-yellow-background: hsl(50 50% 25%);
          --bn-colors-highlights-yellow-text: hsl(50 50% 85%);
          --bn-colors-highlights-green-background: hsl(120 30% 25%);
          --bn-colors-highlights-green-text: hsl(120 30% 85%);
          --bn-colors-highlights-blue-background: hsl(var(--primary));
          --bn-colors-highlights-blue-text: hsl(var(--primary-foreground));
          --bn-colors-highlights-purple-background: hsl(270 30% 25%);
          --bn-colors-highlights-purple-text: hsl(270 30% 85%);
          --bn-colors-highlights-pink-background: hsl(320 30% 25%);
          --bn-colors-highlights-pink-text: hsl(320 30% 85%);
        }

        /* Light mode adjustments */
        .blocknote-editor[data-color-scheme="light"] {
          --bn-colors-editor-background: transparent;
          --bn-colors-editor-text: hsl(var(--foreground));
          --bn-colors-menu-background: hsl(var(--card));
          --bn-colors-menu-text: hsl(var(--card-foreground));
          --bn-colors-tooltip-background: hsl(var(--card));
          --bn-colors-tooltip-text: hsl(var(--card-foreground));
          --bn-colors-hovered-background: hsl(var(--card-hover));
          --bn-colors-selected-background: hsl(var(--card-hover));
          --bn-colors-disabled-background: hsl(var(--muted));
          --bn-colors-disabled-text: hsl(var(--muted-foreground));
          --bn-colors-shadow: hsl(var(--border));
          --bn-colors-border: hsl(var(--border));
          --bn-colors-side-menu: hsl(var(--card));
          --bn-colors-highlights-gray-background: hsl(var(--muted));
          --bn-colors-highlights-gray-text: hsl(var(--muted-foreground));
          --bn-colors-highlights-brown-background: hsl(30 20% 90%);
          --bn-colors-highlights-brown-text: hsl(30 20% 15%);
          --bn-colors-highlights-red-background: hsl(0 50% 90%);
          --bn-colors-highlights-red-text: hsl(0 50% 15%);
          --bn-colors-highlights-orange-background: hsl(25 50% 90%);
          --bn-colors-highlights-orange-text: hsl(25 50% 15%);
          --bn-colors-highlights-yellow-background: hsl(50 50% 90%);
          --bn-colors-highlights-yellow-text: hsl(50 50% 15%);
          --bn-colors-highlights-green-background: hsl(120 30% 90%);
          --bn-colors-highlights-green-text: hsl(120 30% 15%);
          --bn-colors-highlights-blue-background: hsl(var(--primary));
          --bn-colors-highlights-blue-text: hsl(var(--primary-foreground));
          --bn-colors-highlights-purple-background: hsl(270 30% 90%);
          --bn-colors-highlights-purple-text: hsl(270 30% 15%);
          --bn-colors-highlights-pink-background: hsl(320 30% 90%);
          --bn-colors-highlights-pink-text: hsl(320 30% 15%);
        }

        /* Block spacing and typography */
        .blocknote-editor .ProseMirror {
          padding: 1.5rem;
          line-height: 1.6;
          font-size: 16px;
        }

        .blocknote-editor .ProseMirror h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 1.5rem 0 0.75rem 0;
          color: hsl(var(--foreground));
        }

        .blocknote-editor .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 1.25rem 0 0.625rem 0;
          color: hsl(var(--foreground));
        }

        .blocknote-editor .ProseMirror h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 1rem 0 0.5rem 0;
          color: hsl(var(--foreground));
        }

        .blocknote-editor .ProseMirror p {
          margin: 0.5rem 0;
          color: hsl(var(--foreground));
        }

        .blocknote-editor .ProseMirror ul,
        .blocknote-editor .ProseMirror ol {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }

        .blocknote-editor .ProseMirror li {
          margin: 0.25rem 0;
          color: hsl(var(--foreground));
        }

        .blocknote-editor .ProseMirror blockquote {
          border-left: 3px solid hsl(var(--border));
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: hsl(var(--muted-foreground));
        }

        .blocknote-editor .ProseMirror pre {
          background-color: hsl(var(--muted));
          border: 1px solid hsl(var(--border));
          border-radius: 0.5rem;
          padding: 1rem;
          margin: 1rem 0;
          overflow-x: auto;
          font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
          font-size: 14px;
        }

        .blocknote-editor .ProseMirror code {
          background-color: hsl(var(--muted));
          border: 1px solid hsl(var(--border));
          border-radius: 0.25rem;
          padding: 0.125rem 0.25rem;
          font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
          font-size: 0.875em;
        }

        /* Slash menu styling */
        .bn-suggestion-menu {
          background-color: hsl(var(--popover)) !important;
          border: 1px solid hsl(var(--border)) !important;
          border-radius: 0.5rem !important;
          box-shadow: 0 10px 38px -10px hsla(206, 22%, 7%, .35), 0 10px 20px -15px hsla(206, 22%, 7%, .2) !important;
        }

        .bn-suggestion-menu-item {
          color: hsl(var(--popover-foreground)) !important;
          border-radius: 0.25rem !important;
        }

        .bn-suggestion-menu-item:hover,
        .bn-suggestion-menu-item[data-highlighted] {
          background-color: hsl(var(--accent)) !important;
          color: hsl(var(--accent-foreground)) !important;
        }

        /* Side menu (drag handle) styling */
        .bn-side-menu {
          background-color: hsl(var(--card)) !important;
          border: 1px solid hsl(var(--border)) !important;
          border-radius: 0.5rem !important;
        }

        /* Formatting toolbar */
        .bn-formatting-toolbar {
          background-color: hsl(var(--popover)) !important;
          border: 1px solid hsl(var(--border)) !important;
          border-radius: 0.5rem !important;
          box-shadow: 0 10px 38px -10px hsla(206, 22%, 7%, .35), 0 10px 20px -15px hsla(206, 22%, 7%, .2) !important;
        }

        .bn-formatting-toolbar-button {
          color: hsl(var(--popover-foreground)) !important;
          border-radius: 0.25rem !important;
        }

        .bn-formatting-toolbar-button:hover,
        .bn-formatting-toolbar-button[data-state="on"] {
          background-color: hsl(var(--accent)) !important;
          color: hsl(var(--accent-foreground)) !important;
        }

        /* Link toolbar */
        .bn-link-toolbar {
          background-color: hsl(var(--popover)) !important;
          border: 1px solid hsl(var(--border)) !important;
          border-radius: 0.5rem !important;
        }

        /* Table handles */
        .bn-table-handle {
          background-color: hsl(var(--accent)) !important;
        }

        /* Placeholder text */
        .ProseMirror p.is-empty::before {
          color: hsl(var(--muted-foreground)) !important;
        }

        /* Focus styles */
        .blocknote-editor .ProseMirror:focus {
          outline: none;
        }

        /* Animation for smooth interactions */
        .bn-suggestion-menu,
        .bn-formatting-toolbar,
        .bn-side-menu {
          animation: slideInAndFade 0.2s ease-out;
        }

        @keyframes slideInAndFade {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        `
      }} />
    </div>
  );
};

export default NotionEditor;