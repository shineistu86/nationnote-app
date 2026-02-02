import React, { useState, useEffect } from 'react';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const countriesPerPage = 8;

  // Fetch countries from API
  const fetchCountries = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,flags,region,population');
      const data = await response.json();
      
      // Calculate total pages based on data
      const total = Math.ceil(data.length / countriesPerPage);
      setTotalPages(total);
      
      // Get countries for current page
      const startIndex = (currentPage - 1) * countriesPerPage;
      const endIndex = startIndex + countriesPerPage;
      const paginatedData = data.slice(startIndex, endIndex);
      
      setCountries(paginatedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching countries:', error);
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchCountries();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`https://restcountries.com/v3.1/name/${searchTerm}?fields=name,capital,flags,region,population`);
      if (response.ok) {
        const data = await response.json();
        setCountries(data);
        setTotalPages(1);
        setCurrentPage(1);
      } else {
        setCountries([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error searching countries:', error);
      setLoading(false);
    }
  };

  // Handle pagination
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Fetch countries on initial load and when page changes
  useEffect(() => {
    if (!searchTerm) {
      fetchCountries();
    }
  }, [currentPage]);

  // If search term changes, reset to page 1 and search
  useEffect(() => {
    if (searchTerm) {
      const timer = setTimeout(() => {
        handleSearch({ preventDefault: () => {}, target: {} });
      }, 500); // Debounce search
      return () => clearTimeout(timer);
    }
  }, [searchTerm]);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navbar */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center">NationNote</h1>
          <p className="text-center mt-2 text-blue-100">Temukan Negara Kesukaanmu</p>
          
          {/* Search Bar */}
          <div className="mt-6 max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Cari negara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow p-3 rounded-l-lg text-gray-800 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-r-lg flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Cari
              </button>
            </form>
          </div>
          
          {/* Globe Icon and "Semua Negara" */}
          <div className="flex items-center justify-center mt-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-lg">Semua Negara</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-lg">Memuat negara...</p>
          </div>
        ) : (
          <>
            {/* Countries Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {countries.map((country, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="p-4">
                    <div className="flex justify-center mb-3">
                      <img 
                        src={country.flags?.png || 'https://placehold.co/150x100?text=Flag'} 
                        alt={`Flag of ${country.name?.common}`} 
                        className="w-full h-32 object-contain rounded border"
                      />
                    </div>
                    <h3 className="font-bold text-lg text-center text-gray-800 truncate">{country.name?.common || 'N/A'}</h3>
                    <p className="text-gray-600 text-sm text-center mt-1"><strong>Ibu Kota:</strong> {country.capital && country.capital.length > 0 ? country.capital[0] : 'N/A'}</p>
                    <p className="text-gray-600 text-sm text-center"><strong>Wilayah:</strong> {country.region || 'N/A'}</p>
                    <p className="text-gray-700 text-sm text-center mt-1"><strong>Penduduk:</strong> {country.population ? country.population.toLocaleString('id-ID') : 'N/A'}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {countries.length > 0 && !searchTerm && (
              <div className="mt-10 flex flex-wrap justify-center items-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                  &lt;&lt; Sebelumnya
                </button>
                
                {getPageNumbers().map((page, index) => (
                  page === '...' ? (
                    <span key={index} className="px-3 py-2">...</span>
                  ) : (
                    <button
                      key={index}
                      onClick={() => goToPage(page)}
                      className={`px-4 py-2 rounded-lg ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                      {page}
                    </button>
                  )
                ))}
                
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                  Selanjutnya &gt;&gt;
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 NationNote. Dibuat dengan cinta dan React.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;