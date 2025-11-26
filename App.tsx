import React, { useState, useEffect } from 'react';
import TripForm from './components/TripForm';
import ItineraryResult from './components/ItineraryResult';
import History from './components/History';
import { TripPreferences, GeneratedItinerary, ViewState } from './types';
import { generateItinerary } from './services/gemini';
import { Map, History as HistoryIcon, PlusCircle } from 'lucide-react';

const STORAGE_KEY = 'weekend_wanderer_trips';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>(ViewState.FORM);
  const [preferences, setPreferences] = useState<TripPreferences | null>(null);
  const [currentTrip, setCurrentTrip] = useState<GeneratedItinerary | null>(null);
  const [savedTrips, setSavedTrips] = useState<GeneratedItinerary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved trips on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSavedTrips(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved trips", e);
      }
    }
  }, []);

  // Save trips when updated
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedTrips));
  }, [savedTrips]);

  const handleFormSubmit = async (prefs: TripPreferences) => {
    setPreferences(prefs);
    setIsLoading(true);
    setViewState(ViewState.LOADING);
    setError(null);

    try {
      const result = await generateItinerary(prefs);
      
      const newTrip: GeneratedItinerary = {
        id: crypto.randomUUID(),
        preferences: prefs,
        text: result.text,
        groundingMetadata: result.groundingMetadata,
        createdAt: Date.now(),
      };

      setCurrentTrip(newTrip);
      setSavedTrips(prev => [newTrip, ...prev]);
      setViewState(ViewState.RESULT);
    } catch (err: any) {
      console.error(err);
      setError("Failed to generate itinerary. Please check your connection or API key.");
      setViewState(ViewState.FORM);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTrip = (id: string) => {
    setSavedTrips(prev => prev.filter(t => t.id !== id));
    if (currentTrip?.id === id) {
      setCurrentTrip(null);
      setViewState(ViewState.FORM);
    }
  };

  // Bottom Navigation
  const NavButton = ({ active, icon: Icon, label, onClick }: any) => (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center flex-1 py-3 transition-colors ${
        active ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      <Icon className={`w-6 h-6 mb-1 ${active ? 'fill-current opacity-20 stroke-current' : ''}`} />
      <span className="text-[10px] font-medium tracking-wide">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24">
        {viewState === ViewState.FORM && (
          <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
             {error && (
              <div className="w-full max-w-lg mb-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                {error}
              </div>
            )}
            <TripForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          </div>
        )}

        {viewState === ViewState.LOADING && (
          <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
            <div className="relative w-24 h-24 mb-6">
               <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
               <Map className="absolute inset-0 m-auto text-gray-300 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Asking the Guide...</h3>
            <p className="text-gray-500 max-w-xs">
              We're consulting the maps and checking the vibes for {preferences?.destination}.
            </p>
          </div>
        )}

        {viewState === ViewState.RESULT && currentTrip && (
          <ItineraryResult 
            trip={currentTrip} 
            onBack={() => setViewState(ViewState.FORM)}
          />
        )}

        {viewState === ViewState.HISTORY && (
          <History 
            trips={savedTrips} 
            onSelect={(trip) => {
              setCurrentTrip(trip);
              setViewState(ViewState.RESULT);
            }} 
            onDelete={deleteTrip}
            onBack={() => setViewState(ViewState.FORM)}
          />
        )}
      </main>

      {/* Bottom Sticky Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <NavButton 
            active={viewState === ViewState.FORM || viewState === ViewState.LOADING}
            icon={PlusCircle} 
            label="Plan New" 
            onClick={() => setViewState(ViewState.FORM)}
          />
           <NavButton 
            active={viewState === ViewState.RESULT && currentTrip}
            icon={Map} 
            label="Current Trip" 
            onClick={() => currentTrip && setViewState(ViewState.RESULT)}
          />
          <NavButton 
            active={viewState === ViewState.HISTORY}
            icon={HistoryIcon} 
            label="My Trips" 
            onClick={() => setViewState(ViewState.HISTORY)}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
