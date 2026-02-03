import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCountryByName } from '../services/api';

/**
 * Komponen untuk menampilkan detail negara
 * @returns {JSX.Element} Komponen halaman detail negara
 */
const CountryDetail = () => {
  const { name } = useParams(); // Ambil nama negara dari URL
  const navigate = useNavigate();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ambil data negara saat komponen dimuat
  useEffect(() => {
    const fetchCountry = async () => {
      try {
        setLoading(true);
        const data = await getCountryByName(name);
        setCountry(data[0]); // Ambil negara pertama dari hasil pencarian
        setError(null);
      } catch (err) {
        setError('Gagal memuat data negara');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCountry();
  }, [name]);

  // Tampilkan loading jika masih mengambil data
  if (loading) {
    return <div className="detail-page">Memuat...</div>;
  }

  // Tampilkan error jika gagal mengambil data
  if (error) {
    return <div className="detail-page">{error}</div>;
  }

  // Jika tidak ada data negara
  if (!country) {
    return <div className="detail-page">Negara tidak ditemukan</div>;
  }

  const {
    flags,
    name: countryName,
    capital,
    region,
    subregion,
    population,
    languages,
    currencies,
    timezones,
    cca2,
    cca3,
    independent,
    demonym,
    idd
  } = country;

  // Format bahasa
  const languagesList = languages ? Object.values(languages).join(', ') : 'Tidak diketahui';

  // Format mata uang
  const currenciesList = currencies ?
    Object.values(currencies).map(currency => `${currency.name} (${currency.symbol})`).join(', ') :
    'Tidak diketahui';

  return (
    <div className="detail-page">
      <button onClick={() => navigate(-1)} className="back-button">Kembali</button>

      <div className="detail-container">
        <div className="flag-section">
          <img src={flags.svg} alt={`Bendera ${countryName.common}`} />
        </div>

        <div className="info-section">
          <h1>{countryName.common} ({countryName.official})</h1>

          <div className="info-grid">
            <div className="info-item">
              <h3>Nama Umum</h3>
              <p>{countryName.common}</p>
            </div>

            <div className="info-item">
              <h3>Nama Resmi</h3>
              <p>{countryName.official}</p>
            </div>

            <div className="info-item">
              <h3>Ibu Kota</h3>
              <p>{capital ? capital[0] : 'Tidak diketahui'}</p>
            </div>

            <div className="info-item">
              <h3>Region</h3>
              <p>{region}</p>
            </div>

            <div className="info-item">
              <h3>Subregion</h3>
              <p>{subregion || 'Tidak diketahui'}</p>
            </div>

            <div className="info-item">
              <h3>Populasi</h3>
              <p>{population?.toLocaleString()}</p>
            </div>

            <div className="info-item">
              <h3>Bahasa</h3>
              <p>{languagesList}</p>
            </div>

            <div className="info-item">
              <h3>Mata Uang</h3>
              <p>{currenciesList}</p>
            </div>

            <div className="info-item">
              <h3>Zona Waktu</h3>
              <p>{timezones ? timezones.join(', ') : 'Tidak diketahui'}</p>
            </div>

            <div className="info-item">
              <h3>Kode Negara (CCA2)</h3>
              <p>{cca2}</p>
            </div>

            <div className="info-item">
              <h3>Kode Negara (CCA3)</h3>
              <p>{cca3}</p>
            </div>

            <div className="info-item">
              <h3>Status Kemerdekaan</h3>
              <p>{independent !== undefined ? (independent ? 'Merdeka' : 'Tidak Merdeka') : 'Tidak diketahui'}</p>
            </div>

            <div className="info-item">
              <h3>Demonym (Nama Penduduk)</h3>
              <p>{demonym || 'Tidak diketahui'}</p>
            </div>

            <div className="info-item">
              <h3>Kode Telepon</h3>
              <p>{idd?.root + (idd?.suffixes ? idd.suffixes.join(', ') : '') || 'Tidak diketahui'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryDetail;