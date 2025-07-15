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
        content: "Enter text or type '/' for commands...",
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
      />
    </div>
  );
};

export default NotionEditor;