import { createRoot } from 'react-dom/client'
import { pdfjs } from 'react-pdf'
import App from './App.tsx'
import './index.css'

// Import and configure PDF.js
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker with fallback
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

createRoot(document.getElementById("root")!).render(<App />);
