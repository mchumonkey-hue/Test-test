import React from 'react';
import { GeneratedItinerary } from '../types';
import { MapPin, Star, Navigation, Share2, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ItineraryResultProps {
  trip: GeneratedItinerary;
  onBack: () => void;
}

const ItineraryResult: React.FC<ItineraryResultProps> = ({ trip, onBack }) => {
  // Extract map chunks if available
  const mapChunks = trip.groundingMetadata?.groundingChunks?.filter(
    (chunk: any) => chunk.maps
  );

  return (
    <div className="w-full max-w-4xl mx-auto pb-20 animate-fade-in-up">
      {/* Header Actions */}
      <div className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-sm p-4 flex items-center justify-between border-b border-gray-200 mb-4">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="font-bold text-lg text-gray-800 truncate max-w-[200px]">
          Weekend in {trip.preferences.destination}
        </h2>
        <button 
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `Weekend in ${trip.preferences.destination}`,
                text: trip.text,
              }).catch(console.error);
            } else {
              alert("Copying to clipboard not implemented in this demo, but native share is!");
            }
          }}
          className="p-2 -mr-2 text-primary hover:text-indigo-700"
        >
          <Share2 className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4">
        
        {/* Main Itinerary Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <div className="markdown-body text-gray-700">
               <ReactMarkdown>{trip.text}</ReactMarkdown>
             </div>
          </div>
        </div>

        {/* Map Recommendations Sidebar/Bottom */}
        <div className="lg:col-span-1">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 sticky top-20 bg-slate-50 py-2 z-0">
            <MapPin className="w-5 h-5 text-secondary" />
            Recommended Places
          </h3>
          
          <div className="space-y-4">
            {mapChunks && mapChunks.length > 0 ? (
              mapChunks.map((chunk: any, index: number) => {
                const mapData = chunk.maps;
                const source = mapData.placeAnswerSources?.[0];
                const rating = source?.placeRating;
                const reviews = source?.userReviewCount;
                
                return (
                  <a 
                    key={index}
                    href={mapData.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors">
                          {mapData.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">{mapData.placeId ? 'View on Google Maps' : 'Location'}</p>
                      </div>
                      <div className="bg-blue-50 p-2 rounded-full text-blue-600">
                        <Navigation className="w-4 h-4" />
                      </div>
                    </div>

                    {rating && (
                      <div className="flex items-center gap-1 mt-3 text-sm text-amber-500 font-medium">
                        <span className="flex items-center">
                          {rating} <Star className="w-3 h-3 ml-0.5 fill-current" />
                        </span>
                        <span className="text-gray-400 text-xs">({reviews} reviews)</span>
                      </div>
                    )}
                  </a>
                );
              })
            ) : (
              <div className="text-center p-6 bg-gray-100 rounded-xl text-gray-500 text-sm">
                No specific map locations found in the response.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryResult;
