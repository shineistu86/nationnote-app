// Ini komponen kecil buat nampilin tiap baris di tabel
// Kita pake "props" buat oper data negara ke sini
const BarisNegara = ({ data, aksiHapus, aksiTambahFavorit, isFavorit }) => {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-3 text-center">
        <img src={data.flags?.png || 'https://via.placeholder.com/64x40?text=Flag'} alt={`bendera ${data.name?.common}`} className="w-12 h-8 object-cover rounded shadow-sm mx-auto" />
      </td>
      <td className="p-3 font-medium">{data.name?.common || 'N/A'}</td>
      <td className="p-3">{data.capital && data.capital.length > 0 ? data.capital[0] : 'Ga ada ibukota'}</td>
      <td className="p-3">{data.region || 'N/A'}</td>
      <td className="p-3 text-right">{data.population ? data.population.toLocaleString('id-ID') : 'N/A'}</td>
      <td className="p-3">{data.catatan || 'Tidak ada catatan'}</td>
      <td className="p-3 text-center flex justify-center space-x-2">
        {/* Tombol untuk menambahkan ke favorit */}
        {!isFavorit && (
          <button
            onClick={() => aksiTambahFavorit(data)}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition"
          >
            Favorit
          </button>
        )}
        {/* Tombol hapus dari favorit */}
        {isFavorit && (
          <button
            onClick={() => aksiHapus(data.name?.common)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition" >
            Hapus
          </button>
        )}
      </td>
    </tr>
  );
};

export default BarisNegara;