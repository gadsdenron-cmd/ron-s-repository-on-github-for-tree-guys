import React, { useState, useCallback } from 'react';
import { ServiceType, Estimate, Pricing, CustomerInfo, LineItem, MINIMUM_CHARGE, CompanyInfo } from './types';
import Header from './components/Header';
import ServiceSelector from './components/ServiceSelector';
import EstimateDisplay from './components/EstimateDisplay';
import Settings from './components/Settings';
import { useSettings } from './hooks/useSettings';

const serviceLabels = {
  [ServiceType.Trim]: { title: 'Tree Trimming', unit: 'ft height' },
  [ServiceType.Cut]: { title: 'Tree Removal', unit: 'ft height' },
  [ServiceType.Grind]: { title: 'Stump Grinding', unit: 'inch diameter' },
};

// --- New Component for Adding Line Items ---
interface AddItemFormProps {
  onAddItem: (item: Omit<LineItem, 'id' | 'cost'>) => void;
  onCancel: () => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ onAddItem, onCancel }) => {
  const [service, setService] = useState<ServiceType | null>(null);
  const [dimension, setDimension] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = () => {
    const dim = parseFloat(dimension);
    if (!service || isNaN(dim) || dim <= 0) return;
    
    onAddItem({
      service,
      dimension: dim,
      quantity,
    });
  };

  if (!service) {
    return (
      <div>
        <ServiceSelector onSelect={setService} />
        <button onClick={onCancel} className="w-full text-center text-sm text-gray-600 hover:text-green-700 mt-4">Cancel</button>
      </div>
    );
  }

  const dimensionLabel = serviceLabels[service].unit;

  return (
    <div className="w-full max-w-md space-y-4">
      <h3 className="text-xl font-semibold text-center">Add Item: {serviceLabels[service].title}</h3>
      <div className="space-y-4 text-center p-4 bg-green-50 rounded-lg">
        <div>
          <label htmlFor="dimension" className="block text-sm font-medium text-gray-700 mb-1">
            Dimension ({dimensionLabel})
          </label>
          <input
            type="number"
            id="dimension"
            value={dimension}
            onChange={(e) => setDimension(e.target.value)}
            min="0.1"
            step="0.1"
            className="mt-1 w-full text-center px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            placeholder={`Enter ${dimensionLabel}`}
            required
          />
        </div>
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            className="mt-1 w-full text-center px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>
      <div className="flex gap-4">
        <button onClick={onCancel} className="w-full text-center text-sm text-gray-600 hover:text-green-700 py-3">Cancel</button>
        <button onClick={handleSubmit} disabled={!dimension || parseFloat(dimension) <= 0} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400">
          Add to Estimate
        </button>
      </div>
    </div>
  );
};


// --- Main App Component ---
const App: React.FC = () => {
  const [step, setStep] = useState(1);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({ name: '', address: '' });
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [haulAway, setHaulAway] = useState({ included: false, truckloads: 1 });
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  
  const { pricing, companyInfo, saveSettings } = useSettings();

  const handleSaveSettings = (newPricing: Pricing, newCompanyInfo: CompanyInfo) => {
    saveSettings(newPricing, newCompanyInfo);
    setShowSettings(false);
  };
  
  const handleAddItem = (newItem: Omit<LineItem, 'id' | 'cost'>) => {
    const cost = newItem.dimension * newItem.quantity * pricing[newItem.service];
    const itemWithId: LineItem = {
      ...newItem,
      id: new Date().toISOString() + Math.random(),
      cost
    };
    setLineItems(prev => [...prev, itemWithId]);
    setIsAddingItem(false);
  };
  
  const handleRemoveItem = (id: string) => {
    setLineItems(prev => prev.filter(item => item.id !== id));
  };

  const handleFinalizeEstimate = () => {
    if (lineItems.length === 0) {
        setError("Please add at least one item to the estimate.");
        return;
    }
    setError(null);
    const itemsTotal = lineItems.reduce((acc, item) => acc + item.cost, 0);
    const haulCost = haulAway.included ? haulAway.truckloads * pricing.haulAwayPerLoad : 0;
    const subTotal = itemsTotal + haulCost;
    const finalTotal = Math.max(subTotal, MINIMUM_CHARGE);

    const finalEstimate: Estimate = {
        companyInfo,
        customerInfo,
        lineItems,
        haulAway: {
            ...haulAway,
            cost: haulCost
        },
        subTotal,
        finalTotal,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        minimumChargeApplied: subTotal < MINIMUM_CHARGE,
    };
    setEstimate(finalEstimate);
    setStep(3);
  };
  
  const handleReset = () => {
    setStep(1);
    setCustomerInfo({ name: '', address: '' });
    setLineItems([]);
    setHaulAway({ included: false, truckloads: 1 });
    setEstimate(null);
    setError(null);
    setIsAddingItem(false);
  };

  const renderContent = () => {
    if (showSettings) {
      return (
        <Settings 
          initialPricing={pricing}
          initialCompanyInfo={companyInfo}
          onSave={handleSaveSettings}
          onBack={() => setShowSettings(false)}
        />
      );
    }

    switch (step) {
      case 1:
        return (
          <div className="w-full max-w-md space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">Step 1: Customer Info</h2>
              <p className="text-gray-500 mt-1">Enter the customer's details for the estimate.</p>
            </div>
            <input type="text" value={customerInfo.name} onChange={(e) => setCustomerInfo(p => ({...p, name: e.target.value}))} placeholder="Customer Name" className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"/>
            <input type="text" value={customerInfo.address} onChange={(e) => setCustomerInfo(p => ({...p, address: e.target.value}))} placeholder="Customer Street Address" className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"/>
            <button onClick={() => setStep(2)} disabled={!customerInfo.name || !customerInfo.address} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 transition-colors">
              Next: Build Estimate
            </button>
          </div>
        );
      case 2:
        const currentTotal = lineItems.reduce((acc, item) => acc + item.cost, 0) + (haulAway.included ? haulAway.truckloads * pricing.haulAwayPerLoad : 0);
        return (
          <div className="w-full max-w-2xl space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">Step 2: Build Estimate</h2>
              <p className="text-gray-500 mt-1">Add items, select haul-away options, and finalize.</p>
            </div>
            {isAddingItem ? (
                <div className="p-4 border-2 border-dashed rounded-lg"><AddItemForm onAddItem={handleAddItem} onCancel={() => setIsAddingItem(false)} /></div>
            ) : (
                <button onClick={() => setIsAddingItem(true)} className="w-full bg-green-100 text-green-800 font-bold py-3 px-4 rounded-lg border-2 border-dashed border-green-300 hover:bg-green-200 transition-colors">
                    + Add Tree / Stump
                </button>
            )}
            <div className="space-y-3">
              {lineItems.length === 0 && <p className="text-center text-gray-500">No items added yet.</p>}
              {lineItems.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div>
                        <p className="font-semibold">{serviceLabels[item.service].title}</p>
                        <p className="text-sm text-gray-600">{item.quantity} x {item.dimension.toFixed(1)} {serviceLabels[item.service].unit}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${item.cost.toFixed(2)}</p>
                      <button onClick={() => handleRemoveItem(item.id)} className="text-xs text-red-500 hover:underline">Remove</button>
                    </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <h3 className="font-semibold text-gray-700 mb-2">Wood Disposal</h3>
              <div className="flex items-center gap-4">
                  <input type="checkbox" id="haulAway" checked={haulAway.included} onChange={e => setHaulAway(p => ({...p, included: e.target.checked}))} className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"/>
                  <label htmlFor="haulAway" className="flex-grow">Include haul-away service</label>
                  {haulAway.included && (<>
                    <input type="number" value={haulAway.truckloads} onChange={e => setHaulAway(p => ({...p, truckloads: Math.max(1, parseInt(e.target.value) || 1)}))} min="1" className="w-20 text-center border-gray-300 rounded-md shadow-sm"/>
                    <span>truckloads</span>
                  </>)}
              </div>
            </div>
             <div className="text-right text-2xl font-bold p-4 bg-gray-100 rounded-lg">
                Current Total: ${currentTotal.toFixed(2)}
            </div>
            <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="w-full text-center text-sm text-gray-600 hover:text-green-700 py-3">Back</button>
                <button onClick={handleFinalizeEstimate} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400">
                  Finalize Estimate
                </button>
            </div>
          </div>
        );
      case 3:
        return <EstimateDisplay estimate={estimate!} onReset={handleReset} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-green-50/50 font-sans flex flex-col items-center p-4 sm:p-6">
      <div className="w-full max-w-4xl mx-auto">
        <Header onShowSettings={() => setShowSettings(true)} />
        <main className="mt-8 bg-white rounded-xl shadow-lg p-6 sm:p-10 flex flex-col items-center">
          {error && (
            <div className="w-full max-w-md bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {renderContent()}
        </main>
         <footer className="text-center mt-8 text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Tree Service Estimator.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;