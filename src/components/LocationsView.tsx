import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  Phone, 
  Clock, 
  CheckCircle2, 
  ExternalLink, 
  Search, 
  Filter, 
  Sparkles, 
  Info,
  Compass,
  Layers,
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { DropOffLocation, WasteCategory } from '../types';

export const LocationsView: React.FC = () => {
  const { activeScan, filterLocationCategory, setFilterLocationCategory, addToast } = useApp();
  const [locations, setLocations] = useState<DropOffLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<DropOffLocation | null>(null);
  const [maxDistance, setMaxDistance] = useState<number>(10);
  const [showDirectionsModal, setShowDirectionsModal] = useState<DropOffLocation | null>(null);

  const categoriesFilter = [
    { id: 'all', label: 'All Centers', icon: '🌐' },
    { id: 'e_waste', label: 'E-Waste Hubs', icon: '💻' },
    { id: 'batteries', label: 'Battery Drop-Off', icon: '🔋' },
    { id: 'recycling', label: 'Municipal Recycling', icon: '♻️' },
    { id: 'donation', label: 'Donation Centers', icon: '🤝' },
    { id: 'textiles', label: 'Textiles & Clothing', icon: '👕' },
    { id: 'safe_disposal', label: 'Hazardous Depot', icon: '⚠️' },
  ];

  // Set initial filter if arrived from scanner
  useEffect(() => {
    if (filterLocationCategory) {
      if (filterLocationCategory === 'electronics') setSelectedType('e_waste');
      else if (filterLocationCategory === 'batteries') setSelectedType('batteries');
      else if (filterLocationCategory === 'textiles') setSelectedType('textiles');
      else if (filterLocationCategory === 'medicines') setSelectedType('safe_disposal');
      else if (['plastic', 'glass', 'metal', 'paper', 'food_containers'].includes(filterLocationCategory)) setSelectedType('recycling');
    }
    fetchLocations();
  }, [filterLocationCategory]);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const data = await api.getLocations();
      setLocations(data);
      if (data.length > 0 && !selectedLocation) {
        setSelectedLocation(data[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredLocations = locations.filter((loc) => {
    const matchType = selectedType === 'all' || loc.categoryKey === selectedType;
    const matchSearch = 
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDist = loc.distanceKm <= maxDistance;
    return matchType && matchSearch && matchDist;
  });

  const handleOpenDirections = (loc: DropOffLocation) => {
    setShowDirectionsModal(loc);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Banner */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              Circular Infrastructure Network
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Nearby Drop-off & Recycling Centers
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Find verified e-waste recyclers, battery depositories, donation banks, and hazardous waste hubs within your area.
            </p>
          </div>

          {/* Contextual Recommendation Banner if item was scanned */}
          {activeScan && (
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                AI Pin
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                  Matching Scanned Item:
                </span>
                <div className="text-xs font-bold text-slate-900 truncate max-w-[200px]">
                  {activeScan.itemName}
                </div>
                <div className="text-[11px] text-emerald-700">
                  Showing authorized {activeScan.category.replace('_', ' ')} facilities
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {categoriesFilter.map((cat) => {
          const active = selectedType === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedType(cat.id);
                setFilterLocationCategory(null);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                active
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-slate-50'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Distance Slider Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by center name, street, or category..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs text-slate-600 font-medium whitespace-nowrap">
            Max Distance: <strong className="text-emerald-700">{maxDistance} km</strong>
          </span>
          <input
            type="range"
            min="1"
            max="15"
            step="1"
            value={maxDistance}
            onChange={(e) => setMaxDistance(Number(e.target.value))}
            className="w-32 accent-emerald-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Main Grid: Interactive Map Visualizer + Location List Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Location Cards List */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Showing {filteredLocations.length} locations</span>
            <span>Sorted by nearest distance</span>
          </div>

          {loading ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-500">Locating certified facilities...</p>
            </div>
          ) : filteredLocations.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
              <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-slate-800">No facilities match your filters</h4>
              <p className="text-xs text-slate-500 mt-1">Try expanding the maximum distance or selecting "All Centers".</p>
            </div>
          ) : (
            filteredLocations.map((loc) => {
              const isSelected = selectedLocation?.id === loc.id;
              return (
                <div
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc)}
                  className={`p-5 rounded-2xl bg-white border transition-all cursor-pointer shadow-xs ${
                    isSelected
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                      : 'border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
                          {loc.type}
                        </span>
                        {loc.isOpen ? (
                          <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Open Now
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-rose-500 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-rose-500" /> Closed
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-base text-slate-900 mt-1">
                        {loc.name}
                      </h3>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block">
                        {loc.distanceKm} km
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 flex items-center gap-1.5 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{loc.address}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {loc.hours}
                    </span>
                    {loc.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {loc.phone}
                      </span>
                    )}
                  </div>

                  {/* Supported Material Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {loc.supportedCategories.map((c) => (
                      <span key={c} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                        {c.replace('_', ' ')}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Certified Zero-Landfill Facility
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDirections(loc);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      Get Directions
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Interactive Simulated GPS Map Canvas */}
        <div className="lg:col-span-6 sticky top-24">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            
            {/* Map Top Bar */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Live Geospatial Locator
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Lat: 37.77 • Lng: -122.41
              </span>
            </div>

            {/* Map Simulated Graphic Canvas */}
            <div className="relative bg-slate-100 aspect-4/3 overflow-hidden select-none">
              
              {/* Map Grid Background Pattern */}
              <div 
                className="absolute inset-0 opacity-40" 
                style={{
                  backgroundImage: `radial-gradient(#94a3b8 1px, transparent 1px), radial-gradient(#94a3b8 1px, #f8fafc 1px)`,
                  backgroundSize: '24px 24px',
                  backgroundPosition: '0 0, 12px 12px',
                }}
              />

              {/* Simulated Map Streets */}
              <svg className="absolute inset-0 w-full h-full stroke-slate-300 stroke-[3] fill-none pointer-events-none">
                <path d="M 0 100 Q 150 120 300 80 T 600 140" />
                <path d="M 50 0 L 120 400" />
                <path d="M 280 0 L 260 400" />
                <path d="M 450 0 Q 420 200 480 400" />
                <path d="M 0 260 Q 200 240 600 280" />
              </svg>

              {/* User Current Location Pin */}
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
                title="Your Current Location"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500 animate-ping absolute -inset-0" />
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg border-2 border-white text-xs font-bold">
                  📍
                </div>
                <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-900 text-white text-[10px] font-bold rounded-md whitespace-nowrap shadow-md pointer-events-none">
                  You are here
                </div>
              </div>

              {/* Pins for filtered locations */}
              {filteredLocations.map((loc, idx) => {
                // Scatter pins proportionally around center
                const offsets = [
                  { top: '30%', left: '42%' },
                  { top: '65%', left: '70%' },
                  { top: '25%', left: '75%' },
                  { top: '75%', left: '30%' },
                  { top: '45%', left: '20%' },
                  { top: '80%', left: '60%' },
                ];
                const pos = offsets[idx % offsets.length];
                const isSelected = selectedLocation?.id === loc.id;

                return (
                  <button
                    key={loc.id}
                    onClick={() => setSelectedLocation(loc)}
                    style={{ top: pos.top, left: pos.left }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 transition-transform ${
                      isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                    }`}
                  >
                    <div className={`p-2 rounded-xl text-white shadow-lg flex items-center justify-center transition-all ${
                      isSelected 
                        ? 'bg-emerald-600 ring-4 ring-emerald-300' 
                        : loc.categoryKey === 'batteries' 
                        ? 'bg-rose-600' 
                        : loc.categoryKey === 'e_waste' 
                        ? 'bg-blue-600' 
                        : 'bg-teal-600'
                    }`}>
                      <MapPin className="w-4 h-4" />
                    </div>
                  </button>
                );
              })}

            </div>

            {/* Selected Location Card preview in map box */}
            {selectedLocation && (
              <div className="p-4 bg-white border-t border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-emerald-800 uppercase">
                    {selectedLocation.type} • {selectedLocation.distanceKm} km away
                  </span>
                  <button
                    onClick={() => handleOpenDirections(selectedLocation)}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    Directions <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{selectedLocation.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{selectedLocation.address}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
                  <span>Hours: {selectedLocation.hours}</span>
                  <span className="font-semibold text-emerald-600">Accepts Public Walk-ins</span>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Directions Modal */}
      {showDirectionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <Navigation className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">
              Directions to {showDirectionsModal.name}
            </h3>
            <p className="text-xs text-slate-500 mt-1">{showDirectionsModal.address}</p>
            
            <div className="my-5 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs text-slate-700">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>Estimated Travel Time:</span>
                <span className="text-emerald-700">~6 mins (Drive) • 14 mins (Transit)</span>
              </div>
              <p>1. Head North on Main Avenue toward Innovation Parkway (0.4 km)</p>
              <p>2. Turn right onto Innovation Parkway (0.8 km)</p>
              <p>3. Arrive at {showDirectionsModal.name} on the right side.</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDirectionsModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
              >
                Close
              </button>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(showDirectionsModal.name + ' ' + showDirectionsModal.address)}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Open in Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
