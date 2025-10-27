import { useState, useEffect } from 'react';
import { Pricing, ServiceType, CompanyInfo } from '../types';

const SETTINGS_KEY = 'tree-service-settings-v2';

const DEFAULT_COMPANY_INFO: CompanyInfo = {
    name: 'Your Tree Service Pro',
    contactName: 'John Doe',
    phone: '(123) 456-7890',
};

const DEFAULT_PRICING: Pricing = {
  [ServiceType.Trim]: 15, // $ per foot
  [ServiceType.Cut]: 30,  // $ per foot
  [ServiceType.Grind]: 8, // $ per inch diameter
  haulAwayPerLoad: 150, // $ per truckload
};

interface StoredSettings {
    pricing: Pricing;
    companyInfo: CompanyInfo;
}

export const useSettings = () => {
  const [settings, setSettings] = useState<StoredSettings>(() => {
    try {
      const storedData = localStorage.getItem(SETTINGS_KEY);
      if (storedData) {
        const parsed = JSON.parse(storedData) as StoredSettings;
        // Merge with defaults to ensure all keys are present after an update
        return {
            companyInfo: { ...DEFAULT_COMPANY_INFO, ...parsed.companyInfo },
            pricing: { ...DEFAULT_PRICING, ...parsed.pricing },
        };
      }
    } catch (error) {
      console.error("Failed to parse settings from localStorage", error);
    }
    return { pricing: DEFAULT_PRICING, companyInfo: DEFAULT_COMPANY_INFO };
  });

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings to localStorage", error);
    }
  }, [settings]);

  const updatePricing = (newPricing: Pricing) => {
    setSettings(prev => ({ ...prev, pricing: newPricing }));
  };
  
  const updateCompanyInfo = (newCompanyInfo: CompanyInfo) => {
    setSettings(prev => ({ ...prev, companyInfo: newCompanyInfo }));
  };
  
  const saveSettings = (newPricing: Pricing, newCompanyInfo: CompanyInfo) => {
    setSettings({ pricing: newPricing, companyInfo: newCompanyInfo });
  };

  return { 
    pricing: settings.pricing, 
    companyInfo: settings.companyInfo, 
    updatePricing, 
    updateCompanyInfo,
    saveSettings
  };
};
