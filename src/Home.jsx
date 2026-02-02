import React from 'react';
import BarisNegara from './BarisNegara';

const Home = ({
  listNegara,
  loading,
  kataKunci,
  setKataKunci,
  selectedRegion,
  setSelectedRegion,
  sortField,
  sortDirection,
  sortList,
  handleCari,
  filterByRegion,
  handleBukaCatatanFavorit,
  listFavorit,
  ambilSemuaNegara
}) => {
  return (
    <div className="space-y-8">
      {/* Form Section */}
      <div className="grid md:grid-cols-1 gap-6 mb-10">

        {/* Form Cari (Read/Search) */}
        <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
          <h2 className="font-bold text-blue-800 mb-3">Cari & Filter Negara</h2>
          <form onSubmit={handleCari} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 p-2 border rounded-lg focus:outline-blue-400"
                placeholder="Cari negara..."
                value={kataKunci}
                onChange={(e) => setKataKunci(e.target.value)}
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Cari</button>
            </div>
            
            {/* Filter per Wilayah */}
            <div className="pt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter per Wilayah:</label>
              <div className="flex gap-2">
                <select
                  value={selectedRegion}
                  onChange={(e) => filterByRegion(e.target.value)}
                  className="flex-1 p-2 border rounded-lg focus:outline-blue-400"
                >
                  <option value="">Semua Wilayah</option>
                  <option value="Asia">Asia</option>
                  <option value="Europe">Europe</option>
                  <option value="Africa">Africa</option>
                  <option value="Americas">Americas</option>
                  <option value="Oceania">Oceania</option>
                </select>
                <button 
                  type="button" 
                  onClick={() => {
                    setSelectedRegion('');
                    setKataKunci('');
                    ambilSemuaNegara();
                  }}
                  className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600"
                >
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>

      </div>

      {/* Reset Button */}
      <div className="mb-6 text-center">
        <button
          onClick={ambilSemuaNegara}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition"
        >
          Reset ke Data Awal
        </button>
      </div>

      {/* Tabel Data (Conditional Rendering) */}
      {loading ? (
        <div className="text-center py-20">
          <p className="text-xl animate-bounce">Sabar ya, lagi ngambil data...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Tabel untuk hasil pencarian/API */}
          <div>
            <h3 className="text-xl font-bold text-blue-700 mb-4">Hasil Pencarian</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
                    <th className="p-3 text-center cursor-pointer hover:bg-gray-300" onClick={() => sortList('flags')}>
                      Bendera {sortField === 'flags' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="p-3 cursor-pointer hover:bg-gray-300" onClick={() => sortList('name')}>
                      Nama {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="p-3 cursor-pointer hover:bg-gray-300" onClick={() => sortList('capital')}>
                      Ibukota {sortField === 'capital' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="p-3 cursor-pointer hover:bg-gray-300" onClick={() => sortList('region')}>
                      Wilayah {sortField === 'region' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="p-3 text-right cursor-pointer hover:bg-gray-300" onClick={() => sortList('population')}>
                      Populasi {sortField === 'population' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="p-3">Catatan</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {listNegara.length > 0 ? (
                    listNegara.map((item, index) => {
                      const isFavorit = listFavorit.some(fav => fav.name?.common === item.name?.common);
                      return (
                        <BarisNegara
                          key={`api-${item.name?.common || index}`}
                          data={item}
                          aksiHapus={() => {}}
                          aksiTambahFavorit={handleBukaCatatanFavorit}
                          isFavorit={isFavorit}
                        />
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="p-10 text-center text-gray-400">Wah, listnya kosong nih...</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;