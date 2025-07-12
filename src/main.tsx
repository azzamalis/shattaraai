import { createRoot } from 'react-dom/client'
import { pdfjs } from 'react-pdf'
import App from './App.tsx'
import './index.css'

// Import and configure PDF.js
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker - simplified and more reliable approach
console.log('DEBUG: PDFViewer - Configuring PDF worker, pdfjs version:', pdfjs.version);

// Set worker source immediately to avoid timing issues
const workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

console.log('DEBUG: PDFViewer - PDF worker configured with:', workerSrc);

createRoot(document.getElementById("root")!).render(<App />);
