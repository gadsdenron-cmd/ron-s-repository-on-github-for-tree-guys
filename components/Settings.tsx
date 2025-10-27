import React, { useState } from 'react';
import { Pricing, ServiceType, CompanyInfo } from '../types';

interface SettingsProps {
  initialPricing: Pricing;
  initialCompanyInfo: CompanyInfo;
  onSave: (newPricing: Pricing, newCompanyInfo: CompanyInfo) => void;
  onBack: () => void;
}

const Settings: React.FC<SettingsProps> = ({ initialPricing, initialCompanyInfo, onSave, onBack }) => {
  const [currentPricing, setCurrentPricing] = useState<Pricing>(initialPricing);
  const [currentCompanyInfo, setCurrentCompanyInfo] = useState<CompanyInfo>(initialCompanyInfo);

  const handlePricingChange = (service: keyof Pricing, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setCurrentPricing(prev => ({
        ...prev,
        [service]: numValue,
      }));
    }
  };

  const handleCompanyInfoChange = (field: keyof CompanyInfo, value: string) => {
    setCurrentCompanyInfo(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleSave = () => {
    onSave(currentPricing, currentCompanyInfo);
  };

  return (
    <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
            <p className="text-gray-500 mt-1">Adjust company info and pricing rates.</p>
        </div>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Company Information</h3>
            <div className="space-y-4">
               <div>
                  <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">Company Name</label>
                  <input type="text" id="company_name" value={currentCompanyInfo.name} onChange={(e) => handleCompanyInfoChange('name', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"/>
              </div>
              <div>
                  <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700">Contact Name</label>
                  <input type="text" id="contact_name" value={currentCompanyInfo.contactName} onChange={(e) => handleCompanyInfoChange('contactName', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"/>
              </div>
              <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                  <input type="text" id="phone" value={currentCompanyInfo.phone} onChange={(e) => handleCompanyInfoChange('phone', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"/>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Service Pricing</h3>
            <div className="space-y-4">
              <div>
                  <label htmlFor="trim_price" className="block text-sm font-medium text-gray-700">Tree Trimming ($ / foot)</label>
                  <input type="number" id="trim_price" value={currentPricing[ServiceType.Trim]} onChange={(e) => handlePricingChange(ServiceType.Trim, e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"/>
              </div>
              <div>
                  <label htmlFor="cut_price" className="block text-sm font-medium text-gray-700">Tree Removal ($ / foot)</label>
                  <input type="number" id="cut_price" value={currentPricing[ServiceType.Cut]} onChange={(e) => handlePricingChange(ServiceType.Cut, e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"/>
              </div>
              <div>
                  <label htmlFor="grind_price" className="block text-sm font-medium text-gray-700">Stump Grinding ($ / inch diameter)</label>
                  <input type="number" id="grind_price" value={currentPricing[ServiceType.Grind]} onChange={(e) => handlePricingChange(ServiceType.Grind, e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"/>
              </div>
               <div>
                  <label htmlFor="haul_price" className="block text-sm font-medium text-gray-700">Wood Haul Away ($ / truckload)</label>
                  <input type="number" id="haul_price" value={currentPricing.haulAwayPerLoad} onChange={(e) => handlePricingChange('haulAwayPerLoad', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"/>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-3">
             <button onClick={handleSave} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-green-700 transition-colors">
                Save and Return
            </button>
            <button onClick={onBack} className="w-full text-center text-sm text-gray-600 hover:text-green-700">
                Cancel
            </button>
        </div>
    </div>
  );
};

export default Settings;
