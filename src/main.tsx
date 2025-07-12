import { createRoot } from 'react-dom/client'
import { pdfjs } from 'react-pdf'
import App from './App.tsx'
import './index.css'

// Import and configure PDF.js
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker with multiple fallbacks
const configurePDFWorker = () => {
  try {
    // Try local worker first
    if (typeof window !== 'undefined') {
      const localWorkerPath = '/pdf.worker.min.mjs';
      // Test if local worker exists
      fetch(localWorkerPath, { method: 'HEAD' })
        .then(response => {
          if (response.ok) {
            pdfjs.GlobalWorkerOptions.workerSrc = localWorkerPath;
            console.log('PDFViewer: Using local PDF worker');
          } else {
            throw new Error('Local worker not found');
          }
        })
        .catch(() => {
          // Fallback to CDN
          const cdnWorkerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
          pdfjs.GlobalWorkerOptions.workerSrc = cdnWorkerSrc;
          console.log('PDFViewer: Using CDN PDF worker:', cdnWorkerSrc);
        });
    }
  } catch (error) {
    console.error('PDFViewer: Worker configuration failed:', error);
    // Last resort fallback
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  }
};

configurePDFWorker();

createRoot(document.getElementById("root")!).render(<App />);
