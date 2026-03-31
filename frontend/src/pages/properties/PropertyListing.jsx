import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from './components/PropertyCard';
import { fetchProperties } from './api/call';

const FILTER_KEYS = ['search', 'suburb', 'property_type', 'min_price', 'max_price', 'min_bedrooms', 'min_bathrooms'];
const NEPAL_SUBURBS = [
  "Thamel", "Baneshwor", "Lazimpat", "Baluwatar", "Maharajgunj",
  "Koteshwor", "Kalanki", "Kirtipur", "Bhaktapur", "Lalitpur",
  "Patan", "Boudha", "Pashupatinath", "Chabahil", "Gongabu",
  "Thankot", "Budhanilkantha", "Tokha", "Gokarneshwor", "Jorpati",
  "Pokhara", "Chitwan", "Butwal", "Dharan", "Biratnagar",
  "Birgunj", "Nepalgunj", "Dhangadhi", "Janakpur", "Hetauda",
];

const PropertyListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Read initial filters directly from URL
  const [filters, setFilters] = useState(() =>
    Object.fromEntries(FILTER_KEYS.map(k => [k, searchParams.get(k) || '']))
  );

  const loadProperties = async (url = null, activeFilters = null) => {
    setLoading(true);
    try {
      const params = activeFilters ? { ...activeFilters, page_size: 9 } : null;
      const res = await fetchProperties(params ?? url);
      const data = res.data || res;
      setProperties(prev => activeFilters ? data.results : [...prev, ...data.results]);
      setNextUrl(data.next);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  // On mount — fetch using whatever is already in the URL
  useEffect(() => {
    loadProperties(null, filters);
  }, []);

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();

    // Put non-empty filters into URL: /?suburb=Boudha&property_type=house
    const params = Object.fromEntries(
      FILTER_KEYS.filter(k => filters[k]).map(k => [k, filters[k]])
    );
    setSearchParams(params);           // ← updates the browser URL
    loadProperties(null, filters);     // ← fetch with current filters
  };

  const removeFilter = (key) => {
    const updated = { ...filters, [key]: '' };
    setFilters(updated);
    const params = Object.fromEntries(
      FILTER_KEYS.filter(k => updated[k]).map(k => [k, updated[k]])
    );
    setSearchParams(params);
    loadProperties(null, updated);
  };

  const handleClear = () => {
    const empty = Object.fromEntries(FILTER_KEYS.map(k => [k, '']));
    setFilters(empty);
    setSearchParams({});
    loadProperties(null, empty);
  };

  const hasActiveFilters = FILTER_KEYS.some(k => filters[k] !== '');

  return (
    <div className="container mx-auto px-4 py-8">

      <section className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-10">
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-3 items-end">

            <div>
              <label className="block text-xs text-gray-400 mb-1 tracking-wide">Search</label>
              <input name="search" value={filters.search}
                placeholder="Keywords, title, description…"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                onChange={handleFilterChange} />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1 tracking-wide">Location</label>
              <select
                name="suburb"
                value={filters.suburb}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
                onChange={handleFilterChange}
              >
                <option value="">All locations</option>
                {NEPAL_SUBURBS.map(suburb => (
                  <option key={suburb} value={suburb}>{suburb}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1 tracking-wide">Type</label>
              <select name="property_type" value={filters.property_type}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
                onChange={handleFilterChange}>
                <option value="">All types</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="townhouse">Townhouse</option>
                <option value="land">Land</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1 tracking-wide">Price range</label>
              <div className="flex gap-2">
                <input name="min_price" value={filters.min_price} placeholder="Min" type="number"
                  className="w-1/2 px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
                  onChange={handleFilterChange} />
                <input name="max_price" value={filters.max_price} placeholder="Max" type="number"
                  className="w-1/2 px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
                  onChange={handleFilterChange} />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1 tracking-wide">Rooms</label>
              <div className="flex gap-2">
                <input name="min_bedrooms" value={filters.min_bedrooms} placeholder="Min Beds Room" type="number"
                  className="w-1/2 px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
                  onChange={handleFilterChange} />
                <input name="min_bathrooms" value={filters.min_bathrooms} placeholder="Min Baths Room" type="number"
                  className="w-1/2 px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
                  onChange={handleFilterChange} />
              </div>
            </div>

            <div className="flex gap-2">
              <button type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition">
                Search
              </button>
              {hasActiveFilters && (
                <button type="button" onClick={handleClear}
                  className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  Clear
                </button>
              )}
            </div>

          </div>
        </form>

        {/* Active filter pills */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
            {FILTER_KEYS.filter(k => filters[k]).map(key => (
              <span key={key}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                <span className="text-blue-400 capitalize">{key.replace(/_/g, ' ')}:</span>
                {filters[key]}
                <button type="button" onClick={() => removeFilter(key)}
                  className="ml-0.5 hover:text-blue-900 font-bold">×</button>
              </span>
            ))}
          </div>
        )}
      </section>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Properties</h1>
        <p className="text-gray-500 mt-2">Showing {properties.length} results</p>
      </header>

      {initialLoading ? (
        <div className="p-20 text-center animate-pulse text-gray-400">Searching listings...</div>
      ) : properties.length === 0 ? (
        <div className="p-20 text-center">
          <p className="text-lg font-medium text-gray-500 mb-1">No properties found</p>
          <p className="text-sm text-gray-400">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property, index) => (
            <PropertyCard key={`${property.id}-${index}`} property={property} />
          ))}
        </div>
      )}

      <div className="mt-16 flex justify-center">
        {nextUrl && (
          <button onClick={() => loadProperties(nextUrl)}
            disabled={loading}
            className="px-10 py-3 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all disabled:opacity-50">
            {loading ? 'Loading...' : 'Load More'}
          </button>
        )}
      </div>

    </div>
  );
};

export default PropertyListing;