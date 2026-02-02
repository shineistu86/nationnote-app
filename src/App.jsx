import React, { useState, useEffect } from 'react';

// Ini komponen kecil buat nampilin tiap baris di tabel
// Kita pake "props" buat oper data negara ke sini
const BarisNegara = ({ data, aksiHapus }) => {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-3 text-center">
        <img src={data.flags.png} alt="bendera" className="w-12 h-8 object-cover rounded shadow-sm mx-auto" />
      </td>
      <td className="p-3 font-medium">{data.name.common}</td>
      <td className="p-3">{data.capital ? data.capital[0] : 'Ga ada ibukota'}</td>
      <td className="p-3">{data.region}</td>
      <td className="p-3 text-right">{data.population.toLocaleString('id-ID')}</td>
      <td className="p-3 text-center">
        {/* Tombol hapus buat praktek fitur Delete */}
        <button
          onClick={() => aksiHapus(data.name.common)}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition" >
          Hapus
        </button>
      </td>
    </tr>
  );
};

function App() {
  // --- TEMPAT NYIMPEN DATA (STATE) ---
  const [listNegara, setListNegara] = useState([]); // Buat nampung daftar negara
  const [loading, setLoading] = useState(true); // Buat status loading pas ambil API
  const [kataKunci, setKataKunci] = useState(''); // Buat nyatet apa yang diketik di kolom cari

  // State buat form tambah negara baru (biar bisa CRUD)
  const [inputNama, setInputNama] = useState('');
  const [inputIbukota, setInputIbukota] = useState('');

  // --- AMBIL DATA DARI API ---
  // Fungsi ini jalan otomatis pas halaman pertama kali dibuka
  const ambilSemuaNegara = async () => {
    try {
      setLoading(true);
      const respon = await fetch('https://restcountries.com/v3.1/all');
      const hasil = await respon.json();
      // Kita ambil 10 data aja ya biar gak kebanyakan pas pertama muncul
      setListNegara(hasil.slice(0, 10));
      setLoading(false);
    } catch (error) {
      console.log("Aduh, gagal ambil data negaranya nih:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    ambilSemuaNegara();
  }, []);

  // --- LOGIKA FITUR ---

  // Fungsi buat nyari negara berdasarkan nama
  const handleCari = async (e) => {
    e.preventDefault();
    if (!kataKunci) return ambilSemuaNegara(); // Kalo kosong, balikin ke data awal

    try {
      setLoading(true);
      const respon = await fetch(`https://restcountries.com/v3.1/name/${kataKunci}`);
      if (respon.ok) {
        const hasil = await respon.json();
        setListNegara(hasil);
      } else {
        alert("Negaranya gak ketemu, coba cek tulisannya deh!");
      }
      setLoading(false);
    } catch (err) {
      alert("Error pas lagi nyari negara...");
      setLoading(false);
    }
  };

  // Fungsi buat nambah negara buatan sendiri (Create)
  const handleTambahNegara = (e) => {
    e.preventDefault();
    if (!inputNama) return alert("Namanya diisi dulu ya!");

    // Data negara baru yang mau kita selipin
    const negaraBaru = {
      name: { common: inputNama },
      capital: [inputIbukota || 'Misteri'],
      flags: { png: 'https://via.placeholder.com/150?text=Baru' },
      region: 'Kustom',
      population: 0
    };

    // Update list negara: yang baru ditaruh paling atas
    setListNegara([negaraBaru, ...listNegara]);

    // Kosongin lagi inputannya
    setInputNama('');
    setInputIbukota('');
  };

  // Fungsi buat hapus negara dari list (Delete)
  const handleHapus = (namaNegara) => {
    if (window.confirm(`Beneran mau hapus ${namaNegara}?`)) {
      const sisaNegara = listNegara.filter(item => item.name.common !== namaNegara);
      setListNegara(sisaNegara);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-6">

        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-blue-600">NationNote 🌏</h1>
          <p className="text-gray-500 mt-2">Catat dan cari info negara favoritmu di sini!</p>
        </header>

        {/* Form Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">

          {/* Form Cari (Read/Search) */}
          <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
            <h2 className="font-bold text-blue-800 mb-3">Cari Negara di API</h2>
            <form onSubmit={handleCari} className="flex gap-2">
              <input
                type="text"
                className="flex-1 p-2 border rounded-lg focus:outline-blue-400"
                placeholder="Misal: Indonesia..."
                value={kataKunci}
                onChange={(e) => setKataKunci(e.target.value)}
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Cari</button>
            </form>
          </div>

          {/* Form Tambah (Create) */}
          <div className="bg-green-50 p-5 rounded-xl border border-green-100">
            <h2 className="font-bold text-green-800 mb-3">Tambah Negara Baru</h2>
            <form onSubmit={handleTambahNegara} className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 p-2 border rounded-lg focus:outline-green-400"
                  placeholder="Nama Negara"
                  value={inputNama}
                  onChange={(e) => setInputNama(e.target.value)}
                />
                <input
                  type="text"
                  className="flex-1 p-2 border rounded-lg focus:outline-green-400"
                  placeholder="Ibukota"
                  value={inputIbukota}
                  onChange={(e) => setInputIbukota(e.target.value)}
                />
              </div>
              <button className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700">Simpan Ke List</button>
            </form>
          </div>

        </div>

        {/* Tabel Data (Conditional Rendering) */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-xl animate-bounce">Sabar ya, lagi ngambil data...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
                  <th className="p-3 text-center">Bendera</th>
                  <th className="p-3">Nama</th>
                  <th className="p-3">Ibukota</th>
                  <th className="p-3">Wilayah</th>
                  <th className="p-3 text-right">Populasi</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {listNegara.length > 0 ? (
                  listNegara.map((item, index) => (
                    <BarisNegara
                      key={index}
                      data={item}
                      aksiHapus={handleHapus}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-10 text-center text-gray-400">Wah, listnya kosong nih...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <footer className="mt-10 text-center text-gray-400 text-sm">
          &copy; 2024 NationNote - Dibuat dengan cinta dan React
        </footer>
      </div>
    </div>
  );
}

export default App
