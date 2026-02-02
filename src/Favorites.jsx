import React, { useState } from 'react';
import BarisNegara from './BarisNegara';
import CountryCard from './CountryCard';

const Favorites = ({
  listFavorit,
  loading,
  sortField,
  sortDirection,
  sortList,
  handleHapus
}) => {
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  return (
    <div className="space-y-8">
      {/* View Mode Toggle */}
      <div className="flex justify-end mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded-lg font-medium ${
              viewMode === 'table'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Tabel
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-lg font-medium ${
              viewMode === 'grid'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Grid
          </button>
        </div>
      </div>

      {/* Tabel atau Grid untuk negara favorit */}
      {listFavorit.length > 0 ? (
        <div>
          <h3 className="text-xl font-bold text-purple-700 mb-4">Daftar Negara Favorit Kamu</h3>

          {/* Grid View */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {listFavorit.map((item, index) => (
                <CountryCard
                  key={`fav-grid-${item.name?.common || index}`}
                  country={item}
                  isFavorit={true}
                  onToggleFavorite={handleHapus}
                />
              ))}
            </div>
          ) : (
            /* Table View */
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-purple-200 text-gray-700 uppercase text-sm">
                    <th className="p-3 text-center">Bendera</th>
                    <th className="p-3 cursor-pointer hover:bg-purple-300" onClick={() => sortList('name')}>
                      Nama {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="p-3 cursor-pointer hover:bg-purple-300" onClick={() => sortList('capital')}>
                      Ibukota {sortField === 'capital' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="p-3 cursor-pointer hover:bg-purple-300" onClick={() => sortList('region')}>
                      Wilayah {sortField === 'region' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="p-3 text-right cursor-pointer hover:bg-purple-300" onClick={() => sortList('population')}>
                      Populasi {sortField === 'population' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="p-3">Catatan</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {listFavorit.map((item, index) => (
                    <BarisNegara
                      key={`fav-${item.name?.common || index}`}
                      data={item}
                      aksiHapus={handleHapus}
                      aksiTambahFavorit={() => {}}
                      isFavorit={true}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20">
          <h3 className="text-xl font-bold text-gray-500 mb-4">Belum ada negara favorit</h3>
          <p className="text-gray-500">Tambahkan negara ke favorit dari halaman Beranda</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-20">
          <p className="text-xl animate-bounce">Sabar ya, lagi ngambil data...</p>
        </div>
      )}
    </div>
  );
};

export default Favorites;