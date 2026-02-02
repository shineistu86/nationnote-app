import React from 'react';

const CountryCard = ({ country, isFavorit, onToggleFavorite }) => {
  return (
    <div className="bg-white border rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-4">
        <div className="flex justify-center mb-3">
          <img 
            src={country.flags?.png || 'https://via.placeholder.com/150?text=Flag'} 
            alt={`bendera ${country.name?.common}`} 
            className="w-16 h-12 object-contain rounded border"
          />
        </div>
        <h3 className="font-bold text-lg text-center text-gray-800 truncate">{country.name?.common || 'N/A'}</h3>
        <p className="text-gray-600 text-sm text-center truncate">{country.capital && country.capital.length > 0 ? country.capital[0] : 'Ga ada ibukota'}</p>
        <p className="text-gray-500 text-sm text-center truncate">{country.region || 'N/A'}</p>
        <p className="text-gray-700 text-sm text-center mt-1">{country.population ? country.population.toLocaleString('id-ID') : 'N/A'} penduduk</p>
        <div className="mt-3 text-xs text-gray-500 text-center truncate">
          {country.catatan || 'Tidak ada catatan'}
        </div>
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => onToggleFavorite(country)}
            className={`px-4 py-2 rounded-lg font-medium ${
              isFavorit 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isFavorit ? 'Hapus Favorit' : 'Tambah Favorit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CountryCard;