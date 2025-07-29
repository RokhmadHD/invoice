import React, { useState } from 'react';
import { Printer, Download, Image, Edit3, Plus, Trash2, Sparkles } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


interface ShopeeItem {
  id: number;
  name: string[];
  variation: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface ShopeeReceiptData {
  orderId: string;
  transactionDate: string;
  sellerName: string;
  paymentMethod: string;
  shippingService: string;
  buyer: {
    name: string;
    phone: string;
    address: string[];
  };
  items: ShopeeItem[];
  summary: {
    orderSubtotal: number;
    shippingSubtotal: number;
    serviceFee: number;
    shippingDiscount: number;
    totalPayment: number;
  };
}

function App() {
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [receiptData, setReceiptData] = useState<ShopeeReceiptData>({
    orderId: '2507132SRH1GYW',
    transactionDate: '13/07/2025',
    sellerName: 'warungpancingindonesia',
    paymentMethod: 'Saldo ShopeePay',
    shippingService: 'Reguler',
    buyer: {
      name: 'tensanq',
      phone: '6289529158428',
      address: [
        'Dusun Tembalang, Jalan Egong Kecamatan Bejen, RT.4/RW.5, Jlegong, Bejen, KAB.',
        'TEMANGGUNG, BEJEN, JAWA TENGAH, ID, 56258',
      ],
    },
    items: [
      {
        id: 1,
        name: ['tegek import yoshita keiryu japan ,spek,med', 'ium ringan, ruas pendek 33cm'],
        variation: 'Yoshita keiryu,450cm gen 2',
        price: 335000,
        quantity: 1,
        subtotal: 335000,
      },
    ],
    summary: {
      orderSubtotal: 335000,
      shippingSubtotal: 6500,
      serviceFee: 1900,
      shippingDiscount: 6500,
      totalPayment: 336900,
    },
  });

  const calculateTotals = (items: ShopeeItem[], shipping: number, fee: number, discount: number) => {
    const orderSubtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const totalPayment = orderSubtotal + shipping + fee - discount;
    return {
      orderSubtotal,
      shippingSubtotal: shipping,
      serviceFee: fee,
      shippingDiscount: discount,
      totalPayment,
    };
  };

  // DIUBAH: Format ke Rupiah tanpa desimal
  const formatCurrency = (amount: number) => {
    return `Rp${new Intl.NumberFormat('id-ID').format(amount)}`;
  };

  const generateFakeReceiptData = async () => {
    setIsGenerating(true);
    // Kita tetap gunakan jeda singkat untuk mensimulasikan loading
    await new Promise(resolve => setTimeout(resolve, 500));

    // Fungsi helper untuk memecah judul panjang (tetap berguna)
    const splitTitleIntoLines = (title: string, maxLength = 35): string[] => {
      const words = title.split(' ');
      const lines: string[] = [];
      let currentLine = '';

      for (const word of words) {
        if ((currentLine + ' ' + word).length > maxLength) {
          lines.push(currentLine.trim());
          currentLine = word;
        } else {
          currentLine += ` ${word}`;
        }
      }
      lines.push(currentLine.trim());
      return lines;
    };

    try {
      // DIUBAH: Panggilan API dihapus dan diganti dengan data lokal
      const products = [
        { name: ['Mangga Harum Manis Super'], variation: 'per kg', price: 35000 },
        { name: ['Apel Malang Hijau Renyah'], variation: '500 gr', price: 22000 },
        { name: ['Durian Montong Palu'], variation: 'per buah (~2kg)', price: 150000 },
        { name: ['Jeruk Sunkist Impor Manis'], variation: 'per kg', price: 45000 },
        { name: ['Bayam Segar Organik'], variation: 'per ikat', price: 5000 },
        { name: ['Tomat Ceri Hidroponik'], variation: 'pack 250 gr', price: 18000 },
        { name: ['Wortel Berastagi Manis'], variation: '500 gr', price: 12000 },
        { name: ['Rujak Buah Segar Komplit', 'dengan Bumbu Kacang Mede'], variation: 'porsi besar', price: 25000 },
        { name: ['Jus Jambu Merah Asli', 'Tanpa Gula Tambahan'], variation: 'botol 500ml', price: 20000 },
         { name: ['Selada ORGANIK Fresh'], variation: 'pack 200 gr', price: 15000 },
        { name: ['Paket Sayur Sop ORGANIK', 'Siap Masak'], variation: '1 paket', price: 20000 },
        { name: ['Pisang Cavendish ORGANIK'], variation: 'per sisir', price: 28000 },
        { name: ['ECO Friendly Reusable Bag', 'Tas Belanja Ramah Lingkungan'], variation: 'Ukuran Large', price: 19000 },
        { name: ['Madu Hutan Murni ORGANIK'], variation: 'botol 250ml', price: 85000 },
        { name: ['Teh Hijau ORGANIK Premium'], variation: 'box 25 sachet', price: 45000 },
      ];

      const sellers = ['KebunPakTani', 'FreshFruit_ID', 'SayurSegarJakarta', 'WarungBuahIbu'];
      const buyers = ['Andi_Wijaya', 'Siti_Aisyah', 'Budi_Santoso', 'Dewi_Lestari'];

      // Ambil produk acak dari daftar lokal


      const newItems: ShopeeItem[] = [];
      const numItems = Math.floor(Math.random() * 2) + 1; // 1 atau 2 item

      for (let i = 0; i < numItems; i++) {
        const randomApiProduct = products[Math.floor(Math.random() * products.length)];
        // const randomApiProduct = apiProducts[Math.floor(Math.random() * apiProducts.length)];
        const quantity = Math.floor(Math.random() * 2) + 1;

        // Konversi harga dari USD ke IDR dan bulatkan
        const priceInIdr = Math.round((randomApiProduct.price * 1) / 500) * 500;

        newItems.push({
          id: i + 1,
          name: splitTitleIntoLines(randomApiProduct.name[0]), // Gunakan helper
          variation: randomApiProduct.variation.charAt(0).toUpperCase() + randomApiProduct.variation.slice(1),
          price: priceInIdr,
          quantity: quantity,
          subtotal: priceInIdr * quantity,
        });
      }

      // Hitung total
      const shipping = 15000;
      const fee = 1000;
      const discount = Math.random() > 0.5 ? 10000 : 0; // Diskon pengiriman
      const newSummary = calculateTotals(newItems, shipping, fee, discount);

      // Susun data nota lengkap
      setReceiptData({
        orderId: `${Date.now().toString().slice(-8)}FRT`,
        transactionDate: (() => {
          const today = new Date();
          const randomDaysAgo = Math.floor(Math.random() * 15); // Angka acak dari 0 sampai 14
          today.setDate(today.getDate() - randomDaysAgo);
          return today.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
        })(),
        sellerName: sellers[Math.floor(Math.random() * sellers.length)],
        paymentMethod: 'ShopeePay',
        shippingService: 'Sameday',
        buyer: {
          name: buyers[Math.floor(Math.random() * buyers.length)],
          phone: `62812${Date.now().toString().slice(-8)}`,
          address: ['Jl. Kebon Jeruk No. 8, Kel. Cempaka Putih, Kec. Makmur Jaya', 'KOTA JAKARTA PUSAT, ID, 10110'],
        },
        items: newItems,
        summary: newSummary
      });

    } catch (error) {
      console.error("Error generating fake data:", error);
      alert("Terjadi kesalahan saat membuat data.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (format: 'png' | 'pdf') => {
    const element = document.getElementById('shopee-receipt-content');
    if (!element) return;
    document.querySelector('.action-bar')?.setAttribute('style', 'display: none');

    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      if (format === 'png') {
        canvas.toBlob(blob => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `nota-shopee-${receiptData.orderId}.png`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        });
      } else {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`nota-shopee-${receiptData.orderId}.pdf`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      document.querySelector('.action-bar')?.removeAttribute('style');
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-4xl mb-8 print:hidden action-bar">
        <div className="flex flex-wrap items-center justify-center gap-2 bg-white p-4 rounded-lg shadow-md">
          {/* Action buttons... */}
          <button onClick={generateFakeReceiptData} disabled={isGenerating} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm font-medium disabled:opacity-50">
            <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Membuat...' : 'Buat Nota Baru'}
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-md text-sm font-medium hover:bg-gray-300"><Printer className="w-4 h-4" /> Cetak</button>
          <button onClick={() => handleDownload('png')} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"><Image className="w-4 h-4" /> PNG</button>
          <button onClick={() => handleDownload('pdf')} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"><Download className="w-4 h-4" /> PDF</button>
        </div>
      </div>

      {/* DIUBAH: KONTEN NOTA DENGAN BACKGROUND IMAGE */}
      <div
        id="shopee-receipt-content"
        className="
          relative
          w-full max-w-2xl
          shadow-lg print:shadow-none 
          font-sans
          bg-white
          bg-shopee-receipt    /* Menerapkan gambar latar */
          bg-contain           /* Pastikan seluruh gambar muat */
          bg-no-repeat         /* Jangan diulang */
          bg-top               /* Posisikan di atas */
        "
        // Atur aspect-ratio agar sesuai dengan gambar A4
        style={{ aspectRatio: '1 / 1.414' }}
      >
        {/* Konten diletakkan di dalam dengan padding untuk memberi ruang */}
        <div className="relative z-10 p-16 pt-28"> {/* Padding atas besar untuk logo */}
          {/* Header (sekarang tidak perlu logo) */}
          <header className="flex justify-between items-start">
            <div>
              <h1 className="text-sm">Nota Pesanan</h1>
            </div>
          </header>

          {/* Info Utama */}
          <main className="mt-4 grid grid-cols-2 gap-8 text-xs">
            {/* Kolom Kiri */}
            <div className="space-y-3">
              <div>
                <h3 className="font-bold text-gray-500">Nama Pembeli:</h3>
                <p>{receiptData.buyer.name}</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-500">Alamat Pembeli:</h3>
                {receiptData.buyer.address.map((line, i) => <p key={i}>{line}</p>)}
              </div>
              <div>
                <h3 className="font-bold text-gray-500">No. Handphone Pembeli:</h3>
                <p>{receiptData.buyer.phone}</p>
              </div>
            </div>
            {/* Kolom Kanan */}
            <div className="space-y-3">
              <div>
                <h3 className="font-bold text-gray-500">Nama Penjual:</h3>
                <p>{receiptData.sellerName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-bold text-gray-500">No. Pesanan</h3>
                  <p>{receiptData.orderId}</p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-500">Tanggal Transaksi</h3>
                  <p>{receiptData.transactionDate}</p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-500">Metode Pembayaran</h3>
                  <p>{receiptData.paymentMethod}</p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-500">Jasa Kirim</h3>
                  <p>{receiptData.shippingService}</p>
                </div>
              </div>
            </div>
          </main>

          {/* Tabel Rincian Pesanan */}
          <section className="mt-6">
            <h3 className="font-bold text-gray-500 mb-2 text-xs">Rincian Pesanan</h3>
            <table className="w-full text-left text-xs">
              <thead className="border-y border-gray-200">
                <tr>
                  <th className="p-2 w-8">No.</th>
                  <th className="p-2 w-2/5">Produk</th>
                  <th className="p-2 w-1/5">Variasi</th>
                  <th className="p-2 text-right">Harga Produk</th>
                  <th className="p-2 text-center">Kuantitas</th>
                  <th className="p-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {receiptData.items.map((item, index) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">
                      {item.name.map((line, i) => <p key={i}>{line}</p>)}
                    </td>
                    <td className="p-2">{item.variation}</td>
                    <td className="p-2 text-right">{formatCurrency(item.price)}</td>
                    <td className="p-2 text-center">{item.quantity}</td>
                    <td className="p-2 text-right font-semibold">{formatCurrency(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Ringkasan Pembayaran */}
          <section className="mt-4 flex justify-end">
            <div className="w-2/5 text-xs space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">{formatCurrency(receiptData.summary.orderSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Kuantitas (Aktif)</span>
                <span>{receiptData.items.reduce((sum, item) => sum + item.quantity, 0)} produk</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal Pesanan</span>
                <span>{formatCurrency(receiptData.summary.orderSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal Pengiriman</span>
                <span>{formatCurrency(receiptData.summary.shippingSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Biaya Layanan</span>
                <span>{formatCurrency(receiptData.summary.serviceFee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Diskon Pengiriman</span>
                <span>-{formatCurrency(receiptData.summary.shippingDiscount)}</span>
              </div>

              <div className="bg-gray-50 border border-gray-200 p-2 rounded-md mt-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Total Pembayaran</span>
                  <span className="text-lg font-bold text-gray-600">{formatCurrency(receiptData.summary.totalPayment)}</span>
                </div>
              </div>

              <p className="text-gray-500 pt-2 text-center">Biaya-biaya yang ditagihkan oleh Shopee (jika ada) sudah termasuk PPN</p>
            </div>
          </section>

          {/* Footer */}
          <footer className="text-xs text-gray-500 mt-10 pt-4 border-t border-gray-200">
            <p className="font-bold">PT Shopee International Indonesia</p>
            <p>Sopo Del Tower, 15th Floor, Jl. Mega Kuningan Barat III Lot 10.1-6, Kuningan Timur, Setiabudi,</p>
            <p>Kota Adm. Jakarta Selatan, DKI Jakarta, 12950</p>
            <p>NPWP: 07.366.669.0-003.1000</p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;