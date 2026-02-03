import React, { useState } from 'react';

/**
 * Komponen untuk pencarian negara
 * @param {Object} props - Props komponen
 * @param {Function} props.onSearch - Fungsi yang dipanggil saat pencarian dilakukan
 * @returns {JSX.Element} Komponen form pencarian
 */
const SearchBar = ({ onSearch }) => {
  // State untuk menyimpan nilai input pencarian
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * Fungsi untuk menangani submit pencarian
   * @param {Event} e - Event submit form
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="text"
        placeholder="Cari negara..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <button type="submit" className="search-button">Cari</button>
    </form>
  );
};

export default SearchBar;