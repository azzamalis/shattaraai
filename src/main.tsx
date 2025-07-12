import { createRoot } from 'react-dom/client'
import { pdfjs } from 'react-pdf'
import App from './App.tsx'
import './index.css'

// Import and configure PDF.js
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker with local file
console.log('DEBUG: PDFViewer - Configuring PDF worker, pdfjs version:', pdfjs.version);

// Use the local worker file instead of CDN to avoid CORS and loading issues
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

console.log('DEBUG: PDFViewer - PDF worker configured with local file: /pdf.worker.min.mjs');

createRoot(document.getElementById("root")!).render(<App />);
