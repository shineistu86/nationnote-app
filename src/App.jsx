import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink, useLocation } from 'react-router-dom';
import Home from './Home';
import Favorites from './Favorites';

// Main App component that manages shared state
function App() {
  // --- TEMPAT NYIMPEN DATA (STATE) ---
  const [listNegara, setListNegara] = useState([]); // Buat nampung daftar negara dari API
  const [listFavorit, setListFavorit] = useState([]); // Buat nampung daftar negara favorit
  const [loading, setLoading] = useState(true); // Buat status loading pas ambil API
  const [kataKunci, setKataKunci] = useState(''); // Buat nyatet apa yang diketik di kolom cari
  const [selectedRegion, setSelectedRegion] = useState(''); // Buat nyaring berdasarkan wilayah
  const [sortField, setSortField] = useState('name'); // Bidang untuk sorting
  const [sortDirection, setSortDirection] = useState('asc'); // Arah sorting
  const [inputCatatan, setInputCatatan] = useState(''); // Catatan pribadi untuk negara favorit
  const [showNoteModal, setShowNoteModal] = useState(false); // Menampilkan modal untuk menambahkan catatan
  const [selectedCountry, setSelectedCountry] = useState(null); // Negara yang dipilih untuk ditambahkan catatan

  // --- AMBIL DATA DARI API ---
  // Fungsi ini jalan otomatis pas halaman pertama kali dibuka
  const ambilSemuaNegara = async () => {
    try {
      setLoading(true);
      
      // Coba beberapa endpoint API untuk memastikan salah satunya bekerja
      let respon;
      let apiUrl = 'https://restcountries.com/v3.1/all?fields=name,capital,flags,region,population';
      
      // Coba endpoint utama dulu tanpa headers
      try {
        respon = await fetch(apiUrl);
      } catch (fetchError) {
        console.warn('Endpoint utama gagal, mencoba alternatif...');
      }
      
      // Jika endpoint utama gagal, coba endpoint alternatif
      if (!respon || !respon.ok) {
        apiUrl = 'https://restcountries.com/v3.1/all';
        try {
          respon = await fetch(apiUrl);
        } catch (fetchError) {
          console.warn('Endpoint alternatif juga gagal, menggunakan data contoh...');
        }
      }
      
      // Jika masih gagal, gunakan data contoh
      if (!respon || !respon.ok) {
        console.warn(`API error! status: ${respon ? respon.status : 'unknown'}. Menggunakan data contoh...`);
        const sampleData = [
          {
            name: { common: "Indonesia" },
            capital: ["Jakarta"],
            flags: { png: "https://flagcdn.com/w320/id.png" },
            region: "Asia",
            population: 273523615
          },
          {
            name: { common: "United States" },
            capital: ["Washington, D.C."],
            flags: { png: "https://flagcdn.com/w320/us.png" },
            region: "Americas",
            population: 329484123
          },
          {
            name: { common: "Germany" },
            capital: ["Berlin"],
            flags: { png: "https://flagcdn.com/w320/de.png" },
            region: "Europe",
            population: 83240525
          },
          {
            name: { common: "Japan" },
            capital: ["Tokyo"],
            flags: { png: "https://flagcdn.com/w320/jp.png" },
            region: "Asia",
            population: 125836021
          },
          {
            name: { common: "Brazil" },
            capital: ["Brasília"],
            flags: { png: "https://flagcdn.com/w320/br.png" },
            region: "Americas",
            population: 212559409
          },
          {
            name: { common: "Nigeria" },
            capital: ["Abuja"],
            flags: { png: "https://flagcdn.com/w320/ng.png" },
            region: "Africa",
            population: 206139587
          },
          {
            name: { common: "Australia" },
            capital: ["Canberra"],
            flags: { png: "https://flagcdn.com/w320/au.png" },
            region: "Oceania",
            population: 25687041
          },
          {
            name: { common: "Canada" },
            capital: ["Ottawa"],
            flags: { png: "https://flagcdn.com/w320/ca.png" },
            region: "Americas",
            population: 38005238
          },
          {
            name: { common: "France" },
            capital: ["Paris"],
            flags: { png: "https://flagcdn.com/w320/fr.png" },
            region: "Europe",
            population: 67391582
          },
          {
            name: { common: "Egypt" },
            capital: ["Cairo"],
            flags: { png: "https://flagcdn.com/w320/eg.png" },
            region: "Africa",
            population: 102334403
          }
        ];
        setListNegara(sampleData);
      } else {
        const hasil = await respon.json();

        // Pastikan hasil adalah array sebelum menggunakan slice
        if (Array.isArray(hasil)) {
          // Kita ambil 10 data aja ya biar gak kebanyakan pas pertama muncul
          setListNegara(hasil.slice(0, 10));
        } else {
          console.error("Hasil dari API bukan array:", hasil);
          // Gunakan data contoh jika respons bukan array
          const sampleData = [
            {
              name: { common: "Indonesia" },
              capital: ["Jakarta"],
              flags: { png: "https://flagcdn.com/w320/id.png" },
              region: "Asia",
              population: 273523615
            },
            {
              name: { common: "United States" },
              capital: ["Washington, D.C."],
              flags: { png: "https://flagcdn.com/w320/us.png" },
              region: "Americas",
              population: 329484123
            },
            {
              name: { common: "Germany" },
              capital: ["Berlin"],
              flags: { png: "https://flagcdn.com/w320/de.png" },
              region: "Europe",
              population: 83240525
            },
            {
              name: { common: "Japan" },
              capital: ["Tokyo"],
              flags: { png: "https://flagcdn.com/w320/jp.png" },
              region: "Asia",
              population: 125836021
            },
            {
              name: { common: "Brazil" },
              capital: ["Brasília"],
              flags: { png: "https://flagcdn.com/w320/br.png" },
              region: "Americas",
              population: 212559409
            },
            {
              name: { common: "Nigeria" },
              capital: ["Abuja"],
              flags: { png: "https://flagcdn.com/w320/ng.png" },
              region: "Africa",
              population: 206139587
            },
            {
              name: { common: "Australia" },
              capital: ["Canberra"],
              flags: { png: "https://flagcdn.com/w320/au.png" },
              region: "Oceania",
              population: 25687041
            },
            {
              name: { common: "Canada" },
              capital: ["Ottawa"],
              flags: { png: "https://flagcdn.com/w320/ca.png" },
              region: "Americas",
              population: 38005238
            },
            {
              name: { common: "France" },
              capital: ["Paris"],
              flags: { png: "https://flagcdn.com/w320/fr.png" },
              region: "Europe",
              population: 67391582
            },
            {
              name: { common: "Egypt" },
              capital: ["Cairo"],
              flags: { png: "https://flagcdn.com/w320/eg.png" },
              region: "Africa",
              population: 102334403
            }
          ];
          setListNegara(sampleData);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error("Aduh, gagal ambil data negaranya nih:", error);
      // Gunakan data contoh jika terjadi error
      const sampleData = [
        {
          name: { common: "Indonesia" },
          capital: ["Jakarta"],
          flags: { png: "https://flagcdn.com/w320/id.png" },
          region: "Asia",
          population: 273523615
        },
        {
          name: { common: "United States" },
          capital: ["Washington, D.C."],
          flags: { png: "https://flagcdn.com/w320/us.png" },
          region: "Americas",
          population: 329484123
        },
        {
          name: { common: "Germany" },
          capital: ["Berlin"],
          flags: { png: "https://flagcdn.com/w320/de.png" },
          region: "Europe",
          population: 83240525
        },
        {
          name: { common: "Japan" },
          capital: ["Tokyo"],
          flags: { png: "https://flagcdn.com/w320/jp.png" },
          region: "Asia",
          population: 125836021
        },
        {
          name: { common: "Brazil" },
          capital: ["Brasília"],
          flags: { png: "https://flagcdn.com/w320/br.png" },
          region: "Americas",
          population: 212559409
        }
      ];
      setListNegara(sampleData);
      setLoading(false);
    }
  };

  useEffect(() => {
    ambilSemuaNegara();
  }, []);

  // Apply region filter when selectedRegion changes (but only if no search term is active)
  useEffect(() => {
    if (!kataKunci && selectedRegion) {
      // Only apply region filter if there's no active search term
      // But don't trigger this effect when the search button is clicked
      // The search button will handle region filtering in handleCari
    } else if (!kataKunci && !selectedRegion) {
      // Reload all countries if both filters are cleared
      ambilSemuaNegara();
    }
  }, [selectedRegion, kataKunci]); // Only update when region or keyword changes, not on search

  // --- FILTER BY REGION LOGIC ---
  const filterByRegion = (region) => {
    setSelectedRegion(region);
  };

  // --- SORTING LOGIC ---
  const sortList = (field) => {
    let direction = 'asc';
    if (sortField === field && sortDirection === 'asc') {
      direction = 'desc';
    }
    setSortDirection(direction);
    setSortField(field);

    // Urutkan listNegara
    const sortedNegara = [...listNegara].sort((a, b) => {
      let valA, valB;

      if (field === 'name') {
        valA = a.name?.common?.toLowerCase() || '';
        valB = b.name?.common?.toLowerCase() || '';
      } else if (field === 'capital') {
        valA = (a.capital && a.capital[0]) ? a.capital[0].toLowerCase() : 'zzz';
        valB = (b.capital && b.capital[0]) ? b.capital[0].toLowerCase() : 'zzz';
      } else if (field === 'region') {
        valA = a.region?.toLowerCase() || '';
        valB = b.region?.toLowerCase() || '';
      } else if (field === 'population') {
        valA = a.population || 0;
        valB = b.population || 0;
      } else {
        valA = a[field]?.toString().toLowerCase() || '';
        valB = b[field]?.toString().toLowerCase() || '';
      }

      if (direction === 'asc') {
        return valA < valB ? -1 : valA > valB ? 1 : 0;
      } else {
        return valA > valB ? -1 : valA < valB ? 1 : 0;
      }
    });

    // Urutkan listFavorit
    const sortedFavorit = [...listFavorit].sort((a, b) => {
      let valA, valB;

      if (field === 'name') {
        valA = a.name?.common?.toLowerCase() || '';
        valB = b.name?.common?.toLowerCase() || '';
      } else if (field === 'capital') {
        valA = (a.capital && a.capital[0]) ? a.capital[0].toLowerCase() : 'zzz';
        valB = (b.capital && b.capital[0]) ? b.capital[0].toLowerCase() : 'zzz';
      } else if (field === 'region') {
        valA = a.region?.toLowerCase() || '';
        valB = b.region?.toLowerCase() || '';
      } else if (field === 'population') {
        valA = a.population || 0;
        valB = b.population || 0;
      } else {
        valA = a[field]?.toString().toLowerCase() || '';
        valB = b[field]?.toString().toLowerCase() || '';
      }

      if (direction === 'asc') {
        return valA < valB ? -1 : valA > valB ? 1 : 0;
      } else {
        return valA > valB ? -1 : valA < valB ? 1 : 0;
      }
    });

    setListNegara(sortedNegara);
    setListFavorit(sortedFavorit);
  };

  // --- LOGIKA FITUR ---

  // Fungsi buat nyari negara berdasarkan nama
  const handleCari = async (e) => {
    e.preventDefault();
    if (!kataKunci && !selectedRegion) return ambilSemuaNegara(); // Kalo kosong, balikin ke data awal

    try {
      setLoading(true);
      
      let hasil = [];
      
      if (kataKunci) {
        // Jika ada kata kunci, cari berdasarkan nama
        let respon;
        let apiUrl = `https://restcountries.com/v3.1/name/${kataKunci}?fields=name,capital,flags,region,population`;
        
        try {
          respon = await fetch(apiUrl); // Tanpa headers
        } catch (fetchError) {
          console.warn('Pencarian nama negara gagal, mencoba alternatif...');
        }
        
        if (respon && respon.ok) {
          hasil = await respon.json();
        } else {
          // Coba endpoint alternatif untuk pencarian nama
          try {
            apiUrl = `https://restcountries.com/v3.1/name/${kataKunci}`;
            respon = await fetch(apiUrl); // Tanpa headers
            
            if (respon.ok) {
              hasil = await respon.json();
            } else {
              alert("Negaranya gak ketemu, coba cek tulisannya deh!");
              setLoading(false);
              return;
            }
          } catch (altError) {
            alert("Negaranya gak ketemu, coba cek tulisannya deh!");
            setLoading(false);
            return;
          }
        }
      } else {
        // Jika tidak ada kata kunci, ambil semua data untuk filter region
        let respon;
        let apiUrl = 'https://restcountries.com/v3.1/all?fields=name,capital,flags,region,population';
        
        try {
          respon = await fetch(apiUrl); // Tanpa headers
        } catch (fetchError) {
          console.warn('Endpoint utama gagal, mencoba alternatif...');
        }
        
        if (!respon || !respon.ok) {
          console.warn(`API error! status: ${respon ? respon.status : 'unknown'}. Menggunakan data contoh...`);
          // Gunakan data contoh jika API gagal
          hasil = [
            {
              name: { common: "Indonesia" },
              capital: ["Jakarta"],
              flags: { png: "https://flagcdn.com/w320/id.png" },
              region: "Asia",
              population: 273523615
            },
            {
              name: { common: "United States" },
              capital: ["Washington, D.C."],
              flags: { png: "https://flagcdn.com/w320/us.png" },
              region: "Americas",
              population: 329484123
            },
            {
              name: { common: "Germany" },
              capital: ["Berlin"],
              flags: { png: "https://flagcdn.com/w320/de.png" },
              region: "Europe",
              population: 83240525
            },
            {
              name: { common: "Japan" },
              capital: ["Tokyo"],
              flags: { png: "https://flagcdn.com/w320/jp.png" },
              region: "Asia",
              population: 125836021
            },
            {
              name: { common: "Brazil" },
              capital: ["Brasília"],
              flags: { png: "https://flagcdn.com/w320/br.png" },
              region: "Americas",
              population: 212559409
            },
            {
              name: { common: "Nigeria" },
              capital: ["Abuja"],
              flags: { png: "https://flagcdn.com/w320/ng.png" },
              region: "Africa",
              population: 206139587
            },
            {
              name: { common: "Australia" },
              capital: ["Canberra"],
              flags: { png: "https://flagcdn.com/w320/au.png" },
              region: "Oceania",
              population: 25687041
            },
            {
              name: { common: "Canada" },
              capital: ["Ottawa"],
              flags: { png: "https://flagcdn.com/w320/ca.png" },
              region: "Americas",
              population: 38005238
            },
            {
              name: { common: "France" },
              capital: ["Paris"],
              flags: { png: "https://flagcdn.com/w320/fr.png" },
              region: "Europe",
              population: 67391582
            },
            {
              name: { common: "Egypt" },
              capital: ["Cairo"],
              flags: { png: "https://flagcdn.com/w320/eg.png" },
              region: "Africa",
              population: 102334403
            }
          ];
        } else {
          hasil = await respon.json();
        }
      }

      // Pastikan hasil adalah array sebelum menggunakan filter
      if (Array.isArray(hasil)) {
        // Terapkan filter region jika ada (baik dengan maupun tanpa kata kunci)
        if (selectedRegion) {
          hasil = hasil.filter(country => country?.region === selectedRegion);
        }
      } else {
        console.error("Hasil dari API bukan array:", hasil);
        hasil = [];
      }

      setListNegara(hasil);
      setLoading(false);
    } catch (err) {
      console.error("Error pas lagi nyari negara...", err);
      alert("Error pas lagi nyari negara...");
      setLoading(false);
    }
  };

  // Fungsi untuk membuka modal catatan sebelum menambahkan ke favorit
  const handleBukaCatatanFavorit = (negara) => {
    // Cek apakah negara sudah ada di favorit
    const sudahAda = listFavorit.some(fav => fav.name?.common === negara.name?.common);

    if (sudahAda) {
      alert("Negara ini udah ada di favorit kamu!");
      return;
    }
    
    setSelectedCountry(negara);
    setInputCatatan(''); // Reset catatan
    setShowNoteModal(true);
  };

  // Fungsi untuk menambahkan negara ke favorit dengan catatan
  const handleTambahFavorit = () => {
    if (!selectedCountry) return;
    
    // Tambahkan negara ke list favorit dengan catatan
    const negaraFavorit = {
      ...selectedCountry,
      isFavorite: true,
      catatan: inputCatatan || '' // Tambahkan catatan jika ada
    };
    
    setListFavorit([...listFavorit, negaraFavorit]);
    setShowNoteModal(false);
    setInputCatatan('');
    setSelectedCountry(null);
  };

  // Fungsi buat hapus negara dari list (Delete)
  const handleHapus = (namaNegara) => {
    if (window.confirm(`Beneran mau hapus ${namaNegara} dari favorit?`)) {
      // Hapus dari list favorit
      const sisaFavorit = listFavorit.filter(item => item.name?.common !== namaNegara);
      setListFavorit(sisaFavorit);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-5 md:p-10 font-sans">
        <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-6">
          
          {/* Navigation Header */}
          <nav className="mb-10">
            <div className="flex justify-between items-center border-b pb-4">
              <h1 className="text-3xl font-extrabold text-blue-600">NationNote 🌏</h1>
              <div className="flex space-x-4">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
                      : "bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300"
                  }
                >
                  Beranda
                </NavLink>
                <NavLink
                  to="/favorites"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-purple-600 text-white px-4 py-2 rounded-lg font-medium"
                      : "bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300"
                  }
                >
                  Favorit ({listFavorit.length})
                </NavLink>
              </div>
            </div>
            <p className="text-gray-500 mt-2 text-center">Catat dan cari info negara favoritmu di sini!</p>
          </nav>

          {/* Routes */}
          <Routes>
            <Route 
              path="/" 
              element={
                <Home 
                  listNegara={listNegara}
                  loading={loading}
                  kataKunci={kataKunci}
                  setKataKunci={setKataKunci}
                  selectedRegion={selectedRegion}
                  setSelectedRegion={setSelectedRegion}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  sortList={sortList}
                  handleCari={handleCari}
                  filterByRegion={filterByRegion}
                  handleBukaCatatanFavorit={handleBukaCatatanFavorit}
                  listFavorit={listFavorit}
                  ambilSemuaNegara={ambilSemuaNegara}
                />
              } 
            />
            <Route 
              path="/favorites" 
              element={
                <Favorites 
                  listFavorit={listFavorit}
                  loading={loading}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  sortList={sortList}
                  handleHapus={handleHapus}
                />
              } 
            />
          </Routes>

          {/* Modal untuk menambahkan catatan */}
          {showNoteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-96 max-w-90vw">
                <h3 className="text-lg font-bold mb-4">Tambah Catatan untuk {selectedCountry?.name?.common}</h3>
                <textarea
                  className="w-full p-2 border rounded mb-4"
                  rows="4"
                  placeholder="Tulis catatan pribadi tentang negara ini..."
                  value={inputCatatan}
                  onChange={(e) => setInputCatatan(e.target.value)}
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setShowNoteModal(false);
                      setInputCatatan('');
                      setSelectedCountry(null);
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleTambahFavorit}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Simpan ke Favorit
                  </button>
                </div>
              </div>
            </div>
          )}

          <footer className="mt-10 text-center text-gray-400 text-sm">
            &copy; 2024 NationNote - Dibuat dengan cinta dan React
          </footer>
        </div>
      </div>
    </Router>
  );
}

export default App;