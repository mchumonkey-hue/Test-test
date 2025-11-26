import React from 'react';
import { GeneratedItinerary } from '../types';
import { Calendar, Trash2, ArrowRight } from 'lucide-react';

interface HistoryProps {
  trips: GeneratedItinerary[];
  onSelect: (trip: GeneratedItinerary) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

const History: React.FC<HistoryProps> = ({ trips, onSelect, onDelete, onBack }) => {
  return (
    <div className="w-full max-w-lg mx-auto p-4 animate-fade-in">
       <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your Trips</h2>
        <button onClick={onBack} className="text-sm font-medium text-primary hover:underline">
          New Trip
        </button>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No planned trips yet.</p>
          <button onClick={onBack} className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm">
            Plan your first one
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {trips.map((trip) => (
            <div key={trip.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group">
              <div 
                className="flex-1 cursor-pointer" 
                onClick={() => onSelect(trip)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded uppercase">
                    {trip.preferences.vibe}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(trip.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-bold text-gray-800 text-lg">{trip.preferences.destination}</h3>
                <p className="text-xs text-gray-500 line-clamp-1 mt-1 opacity-70">
                  {trip.text.substring(0, 60)}...
                </p>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => onSelect(trip)}
                  className="p-2 text-gray-400 hover:text-primary hover:bg-indigo-50 rounded-full transition-colors"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDelete(trip.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
