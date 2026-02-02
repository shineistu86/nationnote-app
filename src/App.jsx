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

  // 1. Ambil data dari API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const res = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,flags,region,population');
        const data = await res.json();
        // Urutkan berdasarkan nama agar konsisten
        const sortedData = data.sort((a, b) => a.name.common.localeCompare(b.name.common));
        setCountries(sortedData);
        setFilteredCountries(sortedData);
        setLoading(false);
      } catch (err) {
        console.error("Gagal ambil data:", err);
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  // 2. Logika Filter (Nama & Wilayah)
  useEffect(() => {
    let result = countries;

    if (searchTerm) {
      result = result.filter(c => 
        c.name.common.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRegion) {
      result = result.filter(c => c.region === selectedRegion);
    }

    setFilteredCountries(result);
    setCurrentPage(1); // Reset ke halaman 1 tiap kali filter berubah
  }, [searchTerm, selectedRegion, countries]);

  // 3. Logika Pagination
  const totalPages = Math.ceil(filteredCountries.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCountries.slice(indexOfFirstItem, indexOfLastItem);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* NAVBAR & HEADER */}
      <header className="bg-white border-b border-gray-100 pt-10 pb-16 px-4 shadow-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-black text-indigo-600 tracking-tighter mb-2">NationNote</h1>
          <p className="text-gray-500 font-medium text-lg mb-10">Temukan Negara Kesukaanmu</p>
          
          {/* Search Bar & Filter */}
          <div className="flex flex-col md:flex-row gap-3 bg-white p-2 rounded-2xl md:rounded-full shadow-xl border border-gray-50">
            <div className="flex-1 flex items-center px-4 gap-2">
              <Search className="text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Cari nama negara..." 
                className="w-full py-3 outline-none text-gray-700 font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select 
              className="bg-gray-50 px-6 py-3 rounded-full outline-none text-gray-600 font-semibold cursor-pointer"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              <option value="">Semua Wilayah</option>
              <option value="Africa">Africa</option>
              <option value="Americas">Americas</option>
              <option value="Asia">Asia</option>
              <option value="Europe">Europe</option>
              <option value="Oceania">Oceania</option>
            </select>

            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-bold flex items-center justify-center gap-2 transition-all">
              <Search size={18} /> Cari
            </button>
          </div>
        </div>
      </header>

      {/* CONTENT SECTION */}
      <main className="max-w-7xl mx-auto px-4 mt-12">
        <div className="flex items-center gap-3 mb-10 text-gray-800">
          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
            <Globe size={24} />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Semua Negara</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <>
            {/* GRID 4-2-1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {currentItems.map((country) => (
                <CountryCard key={country.name.common} country={country} />
              ))}
            </div>

            {/* PAGINATION NAVIGATION */}
            {totalPages > 1 && (
              <div className="mt-20 flex flex-wrap justify-center items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-4 py-2 text-gray-500 hover:text-indigo-600 font-bold disabled:opacity-30"
                >
                  <ChevronLeft size={20} /> Sebelumnya
                </button>
                
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, i) => (
                    <button
                      key={i}
                      onClick={() => typeof page === 'number' && setCurrentPage(page)}
                      className={`w-10 h-10 rounded-xl font-bold transition-all ${
                        currentPage === page 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                        : 'text-gray-400 hover:bg-white hover:text-indigo-600'
                      } ${typeof page !== 'number' ? 'cursor-default' : ''}`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-4 py-2 text-gray-500 hover:text-indigo-600 font-bold disabled:opacity-30"
                >
                  Selanjutnya <ChevronRight size={20} />
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