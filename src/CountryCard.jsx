import React from 'react';

const CountryCard = ({ country }) => {
  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group">
      {/* 1. Bendera (Top) */}
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        <img 
          src={country.flags?.svg || country.flags?.png || 'https://placehold.co/600x400?text=Flag'} 
          alt={country.name.common} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
      </div>

      {/* 2. Nama & Atribut (Menurun) */}
      <div className="p-7">
        <h3 className="text-xl font-black text-gray-900 mb-6 group-hover:text-indigo-600 transition-colors">
          {country.name.common}
        </h3>
        
        <div className="space-y-4">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Ibu Kota</span>
            <span className="text-gray-700 font-semibold">{country.capital?.[0] || 'Tidak ada'}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Wilayah</span>
            <span className="text-gray-700 font-semibold">{country.region}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Penduduk</span>
            <span className="text-gray-700 font-semibold">{country.population?.toLocaleString('id-ID') || 'N/A'} Jiwa</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryCard;