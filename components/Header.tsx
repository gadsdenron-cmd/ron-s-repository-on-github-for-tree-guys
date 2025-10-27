import React from 'react';
import { TreeIcon, SettingsIcon } from './icons';

interface HeaderProps {
  onShowSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowSettings }) => {
  return (
    <header className="text-center relative">
      <div className="flex items-center justify-center space-x-3">
        <TreeIcon className="h-10 w-10 text-green-600"/>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 tracking-tight">
          Tree Service Estimator
        </h1>
      </div>
      <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
        Create professional estimates for your tree services. Simple, fast, and reliable.
      </p>
      <button 
        onClick={onShowSettings} 
        className="absolute top-0 right-0 p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors"
        aria-label="Settings"
      >
        <SettingsIcon className="h-6 w-6" />
      </button>
    </header>
  );
};

export default Header;