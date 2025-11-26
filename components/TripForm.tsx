import React, { useState } from 'react';
import { TripPreferences } from '../types';
import { MapPin, Coffee, Compass, Landmark, Utensils, Baby, DollarSign } from 'lucide-react';

interface TripFormProps {
  onSubmit: (prefs: TripPreferences) => void;
  isLoading: boolean;
}

const TripForm: React.FC<TripFormProps> = ({ onSubmit, isLoading }) => {
  const [destination, setDestination] = useState('');
  const [vibe, setVibe] = useState<TripPreferences['vibe']>('relaxed');
  const [budget, setBudget] = useState<TripPreferences['budget']>('moderate');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;
    onSubmit({ destination, vibe, budget });
  };

  const vibes = [
    { id: 'relaxed', label: 'Relaxed', icon: Coffee },
    { id: 'adventure', label: 'Adventure', icon: Compass },
    { id: 'foodie', label: 'Foodie', icon: Utensils },
    { id: 'culture', label: 'Culture', icon: Landmark },
    { id: 'family', label: 'Family', icon: Baby },
  ];

  const budgets = [
    { id: 'budget', label: 'Budget', icon: DollarSign },
    { id: 'moderate', label: 'Moderate', icon: DollarSign },
    { id: 'luxury', label: 'Luxury', icon: DollarSign },
  ];

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-white rounded-2xl shadow-xl animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Weekend Wanderer</h1>
        <p className="text-gray-500">Plan your perfect 48-hour getaway.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Destination Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Where are you going?</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g., Kyoto, Napa Valley, Taipei"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-colors outline-none"
              required
            />
          </div>
        </div>

        {/* Vibe Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">What's the vibe?</label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {vibes.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVibe(v.id as TripPreferences['vibe'])}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                  vibe === v.id
                    ? 'bg-indigo-50 border-primary text-primary'
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                <v.icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{v.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Budget Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Budget?</label>
          <div className="flex gap-2">
            {budgets.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setBudget(b.id as TripPreferences['budget'])}
                className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-1 ${
                  budget === b.id
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {b.id === 'budget' && '$'}
                {b.id === 'moderate' && '$$'}
                {b.id === 'luxury' && '$$$'}
                <span className="ml-1">{b.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg transform transition-all active:scale-95 ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-primary to-purple-600 hover:shadow-xl hover:-translate-y-1'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Planning Trip...
            </span>
          ) : (
            'Generate Weekend Plan'
          )}
        </button>
      </form>
    </div>
  );
};

export default TripForm;
