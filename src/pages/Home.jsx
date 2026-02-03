import React, { useState, useEffect } from 'react';
import CountryCard from '../components/CountryCard';
import SearchBar from '../components/SearchBar';
import { getAllCountries, getCountryByName, getCountriesByRegion } from '../services/api';

/**
 * Komponen halaman utama untuk menampilkan daftar negara
 * @returns {JSX.Element} Komponen halaman utama
 */
const Home = () => {
  // State untuk menyimpan data negara
  const [countries, setCountries] = useState([]);
  // State untuk menyimpan negara yang difilter
  const [filteredCountries, setFilteredCountries] = useState([]);
  // State untuk status loading
  const [loading, setLoading] = useState(true);
  // State untuk menyimpan pesan error
  const [error, setError] = useState(null);
  // State untuk menyimpan region yang dipilih
  const [selectedRegion, setSelectedRegion] = useState('');
  // State untuk menyimpan halaman saat ini
  const [currentPage, setCurrentPage] = useState(1);
  // Jumlah negara yang ditampilkan per halaman
  const countriesPerPage = 12;

  // Daftar region yang tersedia untuk filter
  const regions = [
    'Africa', 'Americas', 'Asia', 'Europe', 'Oceania'
  ];

  // Efek untuk mengambil semua negara saat komponen dimuat
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const data = await getAllCountries();
        setCountries(data);
        setFilteredCountries(data);
        setError(null);
      } catch (err) {
        setError('Gagal memuat data negara');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  /**
   * Fungsi untuk menangani pencarian negara
   * @param {string} searchTerm - Kata kunci pencarian
   */
  const handleSearch = async (searchTerm) => {
    try {
      setLoading(true);
      const data = await getCountryByName(searchTerm);
      setFilteredCountries(data);
      // Reset ke halaman pertama saat pencarian
      setCurrentPage(1);
      setError(null);
    } catch (err) {
      setError('Negara tidak ditemukan');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fungsi untuk menangani filter region
   * @param {string} region - Region yang dipilih
   */
  const handleRegionChange = async (region) => {
    setSelectedRegion(region);

    if (!region) {
      // Jika tidak ada filter region, kembali ke semua negara
      setFilteredCountries(countries);
      // Reset ke halaman pertama saat filter direset
      setCurrentPage(1);
      return;
    }

    try {
      setLoading(true);
      const data = await getCountriesByRegion(region);
      setFilteredCountries(data);
      // Reset ke halaman pertama saat filter diterapkan
      setCurrentPage(1);
      setError(null);
    } catch (err) {
      setError('Gagal memuat data negara berdasarkan region');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fungsi untuk menangani pencarian dengan reset filter region
   * @param {string} searchTerm - Kata kunci pencarian
   */
  const handleSearchWithReset = (searchTerm) => {
    setSelectedRegion('');
    handleSearch(searchTerm);
  };

  // Logika pagination
  const indexOfLastCountry = currentPage * countriesPerPage;
  const indexOfFirstCountry = indexOfLastCountry - countriesPerPage;
  const currentCountries = filteredCountries.slice(indexOfFirstCountry, indexOfLastCountry);
  const totalPages = Math.ceil(filteredCountries.length / countriesPerPage);

  /**
   * Fungsi untuk mengganti halaman
   * @param {number} pageNumber - Nomor halaman yang ingin dituju
   */
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  /**
   * Fungsi untuk pindah ke halaman sebelumnya
   */
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  /**
   * Fungsi untuk pindah ke halaman berikutnya
   */
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Tampilkan loading jika masih mengambil data
  if (loading && !error) {
    return <div className="home-page">Memuat...</div>;
  }

  return (
    <div className="home-page">
      <div className="controls">
        <SearchBar onSearch={handleSearchWithReset} />

        <div className="region-filter">
          <label htmlFor="region-select">Filter berdasarkan region:</label>
          <select
            id="region-select"
            value={selectedRegion}
            onChange={(e) => handleRegionChange(e.target.value)}
            className="region-select"
          >
            <option value="">Semua Region</option>
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="countries-list">
        {currentCountries.length > 0 ? (
          currentCountries.map(country => (
            <CountryCard key={country.cca3} country={country} />
          ))
        ) : (
          <p>Tidak ada negara yang ditemukan</p>
        )}
      </div>

      {/* Sistem pagination untuk menavigasi antar halaman */}
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={goToPreviousPage} disabled={currentPage === 1} className="pagination-btn">
            &lt;&lt; Sebelumnya
          </button>

          {/* Tampilkan tombol halaman */}
          {(() => {
            const pages = [];
            const maxVisiblePages = 5; // Maksimal jumlah halaman yang ditampilkan sekaligus

            if (totalPages <= maxVisiblePages) {
              // Jika total halaman kurang dari atau sama dengan maxVisiblePages, tampilkan semua
              for (let i = 1; i <= totalPages; i++) {
                pages.push(
                  <button
                    key={i}
                    onClick={() => paginate(i)}
                    className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
                  >
                    {i}
                  </button>
                );
              }
            } else {
              // Jika total halaman lebih dari maxVisiblePages, tampilkan dengan ellipsis

              // Tentukan range halaman yang akan ditampilkan
              let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
              let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

              // Pastikan range cukup panjang
              if (endPage - startPage + 1 < maxVisiblePages) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
              }

              // Tampilkan halaman pertama
              if (startPage > 1) {
                pages.push(
                  <button
                    key={1}
                    onClick={() => paginate(1)}
                    className={`pagination-btn ${currentPage === 1 ? 'active' : ''}`}
                  >
                    1
                  </button>
                );

                // Tampilkan ellipsis jika ada jarak antara halaman pertama dan startPage
                if (startPage > 2) {
                  pages.push(<span key="start-ellipsis" className="pagination-ellipsis">...</span>);
                }
              }

              // Tampilkan halaman dalam range
              for (let i = startPage; i <= endPage; i++) {
                pages.push(
                  <button
                    key={i}
                    onClick={() => paginate(i)}
                    className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
                  >
                    {i}
                  </button>
                );
              }

              // Tampilkan ellipsis dan halaman terakhir jika perlu
              if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                  pages.push(<span key="end-ellipsis" className="pagination-ellipsis">...</span>);
                }

                pages.push(
                  <button
                    key={totalPages}
                    onClick={() => paginate(totalPages)}
                    className={`pagination-btn ${currentPage === totalPages ? 'active' : ''}`}
                  >
                    {totalPages}
                  </button>
                );
              }
            }

            return pages;
          })()}

          <button onClick={goToNextPage} disabled={currentPage === totalPages} className="pagination-btn">
            Selanjutnya &gt;&gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;