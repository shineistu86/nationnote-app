import React, { useState, useEffect } from 'react';
import { Search, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import CountryCard from './CountryCard';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch Data
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const res = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,flags,region,population');
        const data = await res.json();
        const sorted = data.sort((a, b) => a.name.common.localeCompare(b.name.common));
        setCountries(sorted);
        setFilteredCountries(sorted);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  // Filter Logic (Search + Region)
  useEffect(() => {
    const results = countries.filter(c => {
      const matchSearch = c.name.common.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRegion = selectedRegion === "" || c.region === selectedRegion;
      return matchSearch && matchRegion;
    });
    setFilteredCountries(results);
    setCurrentPage(1);
  }, [searchTerm, selectedRegion, countries]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredCountries.length / itemsPerPage);
  const currentItems = filteredCountries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* HEADER SECTION */}
      <header className="bg-gradient-to-r from-emerald-500 to-emerald-600 pt-12 pb-16 px-4 rounded-b-[28px]">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-black text-white tracking-tighter mb-2">NationNote</h1>
          <p className="text-white text-opacity-90 font-medium mb-10">Temukan Negara Kesukaanmu</p>
        </div>
      </header>

      {/* SEARCH BAR */}
      <div className="max-w-6xl mx-auto px-4 -mt-6 mb-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex">
            <input 
              type="text" 
              placeholder="Cari nama negara..." 
              className="flex-1 py-4 px-6 outline-none text-gray-700 font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select 
              className="bg-gray-50 px-6 py-4 outline-none text-gray-600 font-bold cursor-pointer border-l border-gray-200"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              <option value="">Semua Wilayah</option>
              <option value="Asia">Asia</option>
              <option value="Europe">Europe</option>
              <option value="Africa">Africa</option>
              <option value="Americas">Americas</option>
              <option value="Oceania">Oceania</option>
            </select>
            <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-4 font-bold">
              <div className="flex items-center gap-2">
                <Search size={18} /> Cari
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT GRID */}
      <main className="max-w-7xl mx-auto px-4 mt-4">
        <div className="flex items-center gap-3 mb-10 text-gray-800">
          <Globe className="text-emerald-600" size={24} />
          <h2 className="text-xl font-extrabold">Semua Negara</h2>
        </div>

        {loading ? (
          <div className="text-center py-20 animate-pulse text-gray-400">Memuat data dunia...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {currentItems.map((c) => (
                <CountryCard key={c.cca3 || c.name.common} country={c} />
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center items-center gap-6 border-t border-gray-100 pt-10">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 text-gray-400 hover:text-emerald-600 font-bold disabled:opacity-20"
                >
                  <ChevronLeft /> Sebelumnya
                </button>
                <span className="bg-emerald-600 text-white w-10 h-10 flex items-center justify-center rounded-xl font-bold shadow-lg shadow-emerald-200">
                  {currentPage}
                </span>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 text-gray-400 hover:text-emerald-600 font-bold disabled:opacity-20"
                >
                  Selanjutnya <ChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default App;