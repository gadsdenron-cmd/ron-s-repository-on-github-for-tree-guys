
import React from 'react';
import { ServiceType } from '../types';

interface ServiceSelectorProps {
  onSelect: (service: ServiceType) => void;
}

const services = [
  { type: ServiceType.Trim, title: 'Tree Trimming', description: 'Prune and shape trees for health and aesthetics.' },
  { type: ServiceType.Cut, title: 'Tree Removal', description: 'Complete removal of trees, big or small.' },
  { type: ServiceType.Grind, title: 'Stump Grinding', description: 'Grind down stumps below the ground level.' },
];

const ServiceSelector: React.FC<ServiceSelectorProps> = ({ onSelect }) => {
  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Step 1: Select a Service</h2>
        <p className="text-gray-500 mt-1">Choose the type of work you need estimated.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service) => (
          <button
            key={service.type}
            onClick={() => onSelect(service.type)}
            className="group text-left p-6 bg-white border-2 border-gray-200 rounded-lg shadow-sm hover:border-green-500 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
              {service.title}
            </h3>
            <p className="mt-2 text-gray-600">{service.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ServiceSelector;
