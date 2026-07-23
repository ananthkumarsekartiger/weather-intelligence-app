import React from 'react';
import { Bookmark, X, Trash2, MapPin, ArrowRight, ExternalLink } from 'lucide-react';
import { FavoriteLocation, LocationResult } from '../types/weather';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: FavoriteLocation[];
  onSelectFavorite: (location: LocationResult) => void;
  onRemoveFavorite: (id: string) => void;
  onClearAll: () => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onSelectFavorite,
  onRemoveFavorite,
  onClearAll
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      
      {/* Backdrop overlay */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl h-full flex flex-col z-10 p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Bookmark className="w-5 h-5 fill-amber-400/20" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Saved Locations
              </h2>
              <p className="text-xs text-slate-400">
                {favorites.length} {favorites.length === 1 ? 'location' : 'locations'} bookmarked
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {favorites.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center mx-auto text-amber-400">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-200">No saved locations yet</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Search for any city and click "Save Location" in the weather card to add it to your quick access list.
              </p>
            </div>
          ) : (
            favorites.map((fav) => (
              <div
                key={fav.id}
                className="group p-4 rounded-2xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between"
              >
                <button
                  onClick={() => {
                    onSelectFavorite({
                      id: Number(fav.id) || Date.now(),
                      name: fav.name,
                      country: fav.country,
                      admin1: fav.admin1,
                      latitude: fav.latitude,
                      longitude: fav.longitude,
                      timezone: fav.timezone || 'auto'
                    });
                    onClose();
                  }}
                  className="flex-1 text-left flex items-center gap-3 pr-2"
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-sky-400 group-hover:bg-sky-500 group-hover:text-slate-950 transition-colors shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors truncate">
                      {fav.name}
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      {[fav.admin1, fav.country].filter(Boolean).join(', ')}
                    </div>
                  </div>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onRemoveFavorite(fav.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Remove location"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {favorites.length > 0 && (
          <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
            <button
              onClick={onClearAll}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
            >
              Clear All Favorites
            </button>
            <span className="text-xs text-slate-500 font-mono">Open-Meteo REST</span>
          </div>
        )}

      </div>
    </div>
  );
};
