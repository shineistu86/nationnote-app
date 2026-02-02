import React, { useState, useEffect } from 'react';

// Ini komponen kecil buat nampilin tiap baris di tabel
// Kita pake "props" buat oper data negara ke sini
const BarisNegara = ({ data, aksiHapus, aksiEdit }) => {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-3 text-center">
        <img src={data.flags?.png || 'https://via.placeholder.com/64x40?text=Flag'} alt={`bendera ${data.name?.common}`} className="w-12 h-8 object-cover rounded shadow-sm mx-auto" />
      </td>
      <td className="p-3 font-medium">{data.name?.common || 'N/A'}</td>
      <td className="p-3">{data.capital && data.capital.length > 0 ? data.capital[0] : 'Ga ada ibukota'}</td>
      <td className="p-3">{data.region || 'N/A'}</td>
      <td className="p-3 text-right">{data.population ? data.population.toLocaleString('id-ID') : 'N/A'}</td>
      <td className="p-3 text-center flex justify-center space-x-2">
        {/* Tombol edit buat fitur update */}
        <button
          onClick={() => aksiEdit(data)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition"
        >
          Edit
        </button>
        {/* Tombol hapus buat praktek fitur Delete */}
        <button
          onClick={() => aksiHapus(data.name?.common)}
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
  const [sortField, setSortField] = useState('name'); // Bidang untuk sorting
  const [sortDirection, setSortDirection] = useState('asc'); // Arah sorting

  // State buat form tambah/edit negara
  const [inputNama, setInputNama] = useState('');
  const [inputIbukota, setInputIbukota] = useState('');
  const [inputRegion, setInputRegion] = useState('');
  const [inputPopulation, setInputPopulation] = useState('');
  const [inputFlagUrl, setInputFlagUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false); // Status apakah sedang edit atau tambah
  const [currentEditId, setCurrentEditId] = useState(null); // ID negara yang sedang diedit

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
      console.error("Aduh, gagal ambil data negaranya nih:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    ambilSemuaNegara();
  }, []);

  // --- SORTING LOGIC ---
  const sortList = (field) => {
    let direction = 'asc';
    if (sortField === field && sortDirection === 'asc') {
      direction = 'desc';
    }
    setSortDirection(direction);
    setSortField(field);

    const sorted = [...listNegara].sort((a, b) => {
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

    setListNegara(sorted);
  };

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
      console.error("Error pas lagi nyari negara...", err);
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
      flags: { png: inputFlagUrl || 'https://via.placeholder.com/150?text=Baru' },
      region: inputRegion || 'Kustom',
      population: parseInt(inputPopulation) || 0,
      id: Date.now() // Tambahkan ID unik untuk membedakan negara buatan
    };

    // Update list negara: yang baru ditaruh paling atas
    setListNegara([negaraBaru, ...listNegara]);

    // Kosongin lagi inputannya
    resetForm();
  };

  // Fungsi buat edit negara (Update)
  const handleEditNegara = (e) => {
    e.preventDefault();
    if (!inputNama) return alert("Namanya diisi dulu ya!");

    // Update negara yang dipilih
    const updatedList = listNegara.map(item => {
      if ((item.id && item.id === currentEditId) ||
          (!item.id && item.name?.common === currentEditId)) {
        return {
          ...item,
          name: { common: inputNama },
          capital: [inputIbukota || 'Misteri'],
          flags: { png: inputFlagUrl || 'https://via.placeholder.com/150?text=Baru' },
          region: inputRegion || 'Kustom',
          population: parseInt(inputPopulation) || 0
        };
      }
      return item;
    });

    setListNegara(updatedList);

    // Kosongin form dan kembali ke mode tambah
    resetForm();
  };

  // Reset form ke kondisi awal
  const resetForm = () => {
    setInputNama('');
    setInputIbukota('');
    setInputRegion('');
    setInputPopulation('');
    setInputFlagUrl('');
    setIsEditing(false);
    setCurrentEditId(null);
  };

  // Fungsi untuk memproses edit negara
  const handleEditClick = (negara) => {
    setInputNama(negara.name?.common || '');
    setInputIbukota(negara.capital && negara.capital[0] ? negara.capital[0] : '');
    setInputRegion(negara.region || '');
    setInputPopulation(negara.population ? negara.population.toString() : '');
    setInputFlagUrl(negara.flags?.png || '');
    setIsEditing(true);
    setCurrentEditId(negara.id || negara.name?.common);
  };

  // Fungsi buat hapus negara dari list (Delete)
  const handleHapus = (namaNegara) => {
    if (window.confirm(`Beneran mau hapus ${namaNegara}?`)) {
      const sisaNegara = listNegara.filter(item =>
        (item.id && item.id === namaNegara) ||
        (!item.id && item.name?.common === namaNegara)
      );
      setListNegara(sisaNegara);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-6">

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

          {/* Form Tambah/Edit (Create/Update) */}
          <div className={`p-5 rounded-xl border ${isEditing ? 'bg-yellow-50 border-yellow-100' : 'bg-green-50 border-green-100'}`}>
            <h2 className={`font-bold mb-3 ${isEditing ? 'text-yellow-800' : 'text-green-800'}`}>
              {isEditing ? 'Edit Negara' : 'Tambah Negara Baru'}
            </h2>
            <form onSubmit={isEditing ? handleEditNegara : handleTambahNegara} className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  className="col-span-2 p-2 border rounded-lg focus:outline-green-400"
                  placeholder="Nama Negara *"
                  value={inputNama}
                  onChange={(e) => setInputNama(e.target.value)}
                  required
                />
                <input
                  type="text"
                  className="p-2 border rounded-lg focus:outline-green-400"
                  placeholder="Ibukota"
                  value={inputIbukota}
                  onChange={(e) => setInputIbukota(e.target.value)}
                />
                <input
                  type="text"
                  className="p-2 border rounded-lg focus:outline-green-400"
                  placeholder="Wilayah"
                  value={inputRegion}
                  onChange={(e) => setInputRegion(e.target.value)}
                />
                <input
                  type="number"
                  className="p-2 border rounded-lg focus:outline-green-400"
                  placeholder="Populasi"
                  value={inputPopulation}
                  onChange={(e) => setInputPopulation(e.target.value)}
                />
                <input
                  type="text"
                  className="col-span-2 p-2 border rounded-lg focus:outline-green-400"
                  placeholder="URL Bendera"
                  value={inputFlagUrl}
                  onChange={(e) => setInputFlagUrl(e.target.value)}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className={`${isEditing ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'} text-white p-2 rounded-lg flex-1`}
                >
                  {isEditing ? 'Update Negara' : 'Simpan Ke List'}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-lg flex-1"
                  >
                    Batal
                  </button>
                )}
              </div>
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
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {listNegara.length > 0 ? (
                  listNegara.map((item, index) => (
                    <BarisNegara
                      key={item.id || `${item.name?.common}-${index}`}
                      data={item}
                      aksiHapus={handleHapus}
                      aksiEdit={handleEditClick}
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
