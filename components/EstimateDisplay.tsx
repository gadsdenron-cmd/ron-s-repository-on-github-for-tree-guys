import React, { useRef, useState } from 'react';
import { Estimate, ServiceType, MINIMUM_CHARGE } from '../types';
import PdfEstimateTemplate from './PdfEstimateTemplate';
import { usePdfGenerator } from '../hooks/usePdfGenerator';
import { ClipboardIcon, DownloadIcon } from './icons';

interface EstimateDisplayProps {
  estimate: Estimate;
  onReset: () => void;
}

const serviceLabels = {
  [ServiceType.Trim]: { title: 'Tree Trimming', unit: 'ft height' },
  [ServiceType.Cut]: { title: 'Tree Removal', unit: 'ft height' },
  [ServiceType.Grind]: { title: 'Stump Grinding', unit: 'inch diameter' },
};

const EstimateDisplay: React.FC<EstimateDisplayProps> = ({ estimate, onReset }) => {
  const pdfRef = useRef<HTMLDivElement>(null);
  const { generatePdf, isGenerating } = usePdfGenerator();
  const [copied, setCopied] = useState(false);

  const generateTextEstimate = () => {
    let text = `Hi ${estimate.customerInfo.name}, here is your tree service estimate from ${estimate.companyInfo.name}:\n\n`;
    estimate.lineItems.forEach(item => {
      text += `- ${serviceLabels[item.service].title}: ${item.quantity}x at ~${item.dimension.toFixed(1)} ${serviceLabels[item.service].unit} = $${item.cost.toFixed(2)}\n`;
    });
    if (estimate.haulAway.included) {
      text += `- Wood Haul Away: ${estimate.haulAway.truckloads} truckload(s) = $${estimate.haulAway.cost.toFixed(2)}\n`;
    }
    text += `\nSub-Total: $${estimate.subTotal.toFixed(2)}`;
    if (estimate.minimumChargeApplied) {
       text += `\nMinimum Charge Adjustment: +$${(estimate.finalTotal - estimate.subTotal).toFixed(2)}`;
    }
    text += `\nFinal Estimated Cost: $${estimate.finalTotal.toFixed(2)}\n\n`;
    text += `Thanks,\n${estimate.companyInfo.contactName}\n${estimate.companyInfo.phone}`;
    return text;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateTextEstimate());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-3xl text-center animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800">Your Estimate is Ready!</h2>
      <p className="text-gray-600 mt-2">For: {estimate.customerInfo.name}</p>
      
      <div className="mt-6 p-6 sm:p-8 bg-gray-50 rounded-xl border border-gray-200 text-left">
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">Itemized Estimate</h3>
        <div className="space-y-2">
            {estimate.lineItems.map(item => (
                <div key={item.id} className="flex justify-between items-start">
                    <div>
                        <p className="font-medium text-gray-800">{serviceLabels[item.service].title}</p>
                        <p className="text-sm text-gray-500 pl-2">{item.quantity} x {item.dimension.toFixed(1)} {serviceLabels[item.service].unit}</p>
                    </div>
                    <p className="font-medium text-gray-800">${item.cost.toFixed(2)}</p>
                </div>
            ))}
            {estimate.haulAway.included && (
                 <div className="flex justify-between items-start">
                    <div>
                        <p className="font-medium text-gray-800">Wood Haul Away</p>
                        <p className="text-sm text-gray-500 pl-2">{estimate.haulAway.truckloads} truckload(s)</p>
                    </div>
                    <p className="font-medium text-gray-800">${estimate.haulAway.cost.toFixed(2)}</p>
                </div>
            )}
        </div>
        <div className="mt-4 pt-4 border-t-2 border-dashed">
            {estimate.minimumChargeApplied ? (
                <>
                <div className="flex justify-between text-gray-600"><span>Sub-total</span><span>${estimate.subTotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Minimum Charge Adjustment</span><span>+${(estimate.finalTotal - estimate.subTotal).toFixed(2)}</span></div>
                </>
            ) : (
                <div className="flex justify-between text-gray-600"><span>Sub-total</span><span>${estimate.subTotal.toFixed(2)}</span></div>
            )}
             <div className="flex justify-between text-2xl font-bold text-green-700 mt-2"><span>Final Estimate</span><span>${estimate.finalTotal.toFixed(2)}</span></div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 text-left">
          <h4 className="font-semibold">Please Note:</h4>
          <p>This is a good faith estimate based on AI analysis of photos. The final cost may increase due to unforeseen on-site factors such as proximity to powerlines or structures, difficult access, or other complexities not visible in the photo.</p>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="font-semibold text-gray-700">Formal PDF Estimate</h3>
            <p className="text-sm text-gray-500 mb-3">Download a professional PDF for your records.</p>
            <button onClick={() => generatePdf(pdfRef, `estimate-${estimate.customerInfo.name.replace(/\s/g, '_')}.pdf`)} disabled={isGenerating} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2">
                <DownloadIcon className="h-5 w-5"/>
                {isGenerating ? 'Generating...' : 'Download PDF'}
            </button>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="font-semibold text-gray-700">Simple Text Version</h3>
            <p className="text-sm text-gray-500 mb-3">Copy a simple version for text or email.</p>
            <button onClick={handleCopy} className="w-full bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
               <ClipboardIcon className="h-5 w-5"/>
               {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
        </div>
      </div>
      
      <button onClick={onReset} className="mt-8 text-green-600 font-semibold hover:underline">
        Create New Estimate
      </button>

      <div className="absolute left-[-9999px] top-[-9999px]">
        <PdfEstimateTemplate ref={pdfRef} estimate={estimate} />
      </div>
    </div>
  );
};

export default EstimateDisplay;
