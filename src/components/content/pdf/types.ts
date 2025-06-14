
export interface PDFViewerProps {
  url?: string;
  filePath?: string;
  onTextAction?: (action: 'explain' | 'search' | 'summarize', text: string) => void;
}

export interface SearchResult {
  pageNumber: number;
  text: string;
  context: string;
}

export interface TextActionPosition {
  x: number;
  y: number;
}
