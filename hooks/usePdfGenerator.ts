
import { useState, useCallback } from 'react';
import type React from 'react';

declare global {
    interface Window {
        html2canvas: any;
        jspdf: any;
    }
}

export const usePdfGenerator = () => {  
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePdf = useCallback(async (elementRef: React.RefObject<HTMLDivElement>, fileName: string) => {
    if (!elementRef.current) {
        console.error("PDF generation failed: element ref is not set.");
        return;
    }
    if(typeof window.html2canvas === 'undefined' || typeof window.jspdf === 'undefined'){
        console.error("PDF generation libraries not found.");
        return;
    }


    setIsGenerating(true);

    try {
        const canvas = await window.html2canvas(elementRef.current, {
            scale: 2, // Higher scale for better quality
            useCORS: true,
        });

        const imgData = canvas.toDataURL('image/png');
        
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(fileName);

    } catch (error) {
        console.error('Error generating PDF:', error);
    } finally {
        setIsGenerating(false);
    }
  }, []);

  return { generatePdf, isGenerating };
};
