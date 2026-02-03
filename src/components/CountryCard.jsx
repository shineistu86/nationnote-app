import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Komponen untuk menampilkan kartu negara
 * @param {Object} props - Props komponen
 * @param {Object} props.country - Objek negara yang akan ditampilkan
 * @returns {JSX.Element} Komponen kartu negara
 */
const CountryCard = ({ country }) => {
  // Ambil data yang diperlukan dari objek negara
  const { flags, name, capital, region, population } = country;

  return (
    <Link to={`/detail/${name.common}`} className="country-card">
      <div className="flag-container">
        <img src={flags.svg} alt={`Bendera ${name.common}`} />
      </div>
      <div className="card-content">
        <h3>{name.common}</h3>
        <p><strong>Ibu Kota:</strong> {capital ? capital[0] : 'Tidak diketahui'}</p>
        <p><strong>Region:</strong> {region}</p>
        <p><strong>Populasi:</strong> {population?.toLocaleString()}</p>
      </div>
    </Link>
  );
};

export default CountryCard;