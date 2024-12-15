import React, { useState } from 'react';
import { Settings, Database, Key, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DataSource {
  name: string;
  apiKey: string;
  enabled: boolean;
}

export function SettingsPage() {
  const { user } = useAuth();
  const [dataSources, setDataSources] = useState<DataSource[]>([
    { name: 'Alpha Vantage', apiKey: '', enabled: false },
    { name: 'Twelve Data', apiKey: '', enabled: false },
    { name: 'Yahoo Finance', apiKey: '', enabled: false },
  ]);

  const handleApiKeyChange = (index: number, value: string) => {
    const newDataSources = [...dataSources];
    newDataSources[index].apiKey = value;
    setDataSources(newDataSources);
  };

  const handleToggleSource = (index: number) => {
    const newDataSources = [...dataSources];
    newDataSources[index].enabled = !newDataSources[index].enabled;
    setDataSources(newDataSources);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center">
          <Settings className="w-6 h-6 mr-2" />
          Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Configure your trading environment and data sources
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold flex items-center">
            <Database className="w-5 h-5 mr-2" />
            External Data Sources
          </h2>
        </div>

        <div className="p-4">
          <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                  Important Note
                </h3>
                <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-400">
                  API keys are required to fetch real market data. When no external data source is configured,
                  the system will use simulated market data for practice.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {dataSources.map((source, index) => (
              <div key={source.name} className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Key className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                    <h3 className="font-medium">{source.name}</h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={source.enabled}
                      onChange={() => handleToggleSource(index)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    API Key
                  </label>
                  <input
                    type="password"
                    value={source.apiKey}
                    onChange={(e) => handleApiKeyChange(index, e.target.value)}
                    disabled={!source.enabled}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                    placeholder={source.enabled ? 'Enter API key' : 'Enable data source to enter API key'}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}