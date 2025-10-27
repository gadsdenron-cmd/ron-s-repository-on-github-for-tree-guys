import React, { forwardRef } from 'react';
import { Estimate, ServiceType } from '../types';
import { TreeIcon } from './icons';

interface PdfEstimateTemplateProps {
  estimate: Estimate;
}

const serviceLabels = {
  [ServiceType.Trim]: { title: 'Tree Trimming', unit: 'ft height' },
  [ServiceType.Cut]: { title: 'Tree Removal', unit: 'ft height' },
  [ServiceType.Grind]: { title: 'Stump Grinding', unit: 'inch diameter' },
};

const PdfEstimateTemplate = forwardRef<HTMLDivElement, PdfEstimateTemplateProps>(({ estimate }, ref) => {
  return (
    <div ref={ref} className="bg-white p-16 w-[800px] text-gray-800 font-sans">
      <header className="flex justify-between items-start pb-8 border-b-2 border-green-600">
        <div>
          <div className="flex items-center gap-3">
            <TreeIcon className="h-12 w-12 text-green-600"/>
            <h1 className="text-4xl font-bold text-gray-900">{estimate.companyInfo.name}</h1>
          </div>
          <p className="text-gray-500 mt-2">{estimate.companyInfo.contactName}</p>
          <p className="text-gray-500">{estimate.companyInfo.phone}</p>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-semibold text-gray-500 uppercase">Estimate</h2>
          <p className="mt-1">Date: {estimate.date}</p>
        </div>
      </header>

      <section className="mt-10">
        <h3 className="font-semibold text-gray-500">ESTIMATE FOR:</h3>
        <p className="text-xl font-medium text-gray-900">{estimate.customerInfo.name}</p>
        <p className="text-gray-600">{estimate.customerInfo.address}</p>
      </section>

      <section className="mt-10">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 font-semibold uppercase">Service Description</th>
              <th className="p-3 font-semibold uppercase text-center">Quantity</th>
              <th className="p-3 font-semibold uppercase text-right">AI-Estimated Dimension</th>
              <th className="p-3 font-semibold uppercase text-right">Cost</th>
            </tr>
          </thead>
          <tbody>
            {estimate.lineItems.map(item => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="p-3">{serviceLabels[item.service].title}</td>
                <td className="p-3 text-center">{item.quantity}</td>
                <td className="p-3 text-right">{item.dimension.toFixed(1)} {serviceLabels[item.service].unit}</td>
                <td className="p-3 text-right">${item.cost.toFixed(2)}</td>
              </tr>
            ))}
             {estimate.haulAway.included && (
              <tr className="border-b border-gray-200">
                <td className="p-3">Wood Haul Away</td>
                <td className="p-3 text-center">{estimate.haulAway.truckloads}</td>
                <td className="p-3 text-right">N/A</td>
                <td className="p-3 text-right">${estimate.haulAway.cost.toFixed(2)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

       <section className="mt-10 flex justify-between items-start gap-8">
            <div className="w-1/2">
                <h4 className="font-semibold text-gray-700">Disclaimer:</h4>
                <p className="text-sm text-gray-600 mt-2">
                    This is a good faith estimate based on AI analysis of photos. The final cost may increase due to unforeseen on-site factors such as proximity to powerlines or structures, difficult access, or other complexities not visible in the photo. This estimate is valid for 30 days.
                </p>
            </div>
            <div className="w-1/2 text-right space-y-2">
                 <div className="flex justify-between"><span className="text-gray-600">Sub-total</span><span>${estimate.subTotal.toFixed(2)}</span></div>
                 {estimate.minimumChargeApplied && (
                     <div className="flex justify-between"><span className="text-gray-600">Minimum Charge Adjustment</span><span>+${(estimate.finalTotal - estimate.subTotal).toFixed(2)}</span></div>
                 )}
                 <div className="mt-4 bg-green-50 p-4 rounded-lg">
                    <div className="flex justify-between items-baseline">
                      <p className="text-gray-600 font-semibold uppercase">Total Estimate</p>
                      <p className="text-3xl font-bold text-green-700">${estimate.finalTotal.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </section>
      
      <footer className="mt-20 pt-6 border-t border-gray-300 text-center text-gray-500 text-sm">
        <p>Thank you for considering {estimate.companyInfo.name} for your tree care needs!</p>
      </footer>
    </div>
  );
});

export default PdfEstimateTemplate;
