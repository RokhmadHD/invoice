/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Printer, Download, Image, Edit3, Plus, Trash2, Sparkles } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { products } from './utils/products';
import { fakeAddresses } from './utils/address';
import { generateFakeIndoNameAuto } from './utils/names';
import { generateNamaTokoHijau } from './utils/toko';


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
  const [editData, setEditData] = useState<ShopeeReceiptData | null>(null);
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
      phone: '089529158424',
      address: [
        'PT Shopee International Indonesia, Gedung Pacific Century Place Lt. 22.23.25.26 SCBD LOT 10,',
        'Jalan Jenderal Sudirman Kav. 52-53, RT.005/RW.003, Senayan, Kebayoran Baru, Jakarta Selatan, DKI Jakarta',
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

  useEffect(() => {
    const savedBuyerDataString = localStorage.getItem('savedBuyerData');
    if (savedBuyerDataString) {
      try {
        const savedBuyer = JSON.parse(savedBuyerDataString);
        // Perbarui hanya data pembeli di state awal
        setReceiptData(prevData => ({
          ...prevData,
          buyer: savedBuyer
        }));
      } catch (error) {
        console.error("Gagal memuat data pembeli dari localStorage:", error);
      }
    }
  }, []);

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

      let buyerData;
      const savedBuyerDataString = localStorage.getItem('savedBuyerData');

      if (savedBuyerDataString) {
        // Jika ada data di localStorage, gunakan data itu
        buyerData = JSON.parse(savedBuyerDataString);
      } else {
        // Jika tidak ada, buat data pembeli baru
        const randomAddress = fakeAddresses[Math.floor(Math.random() * fakeAddresses.length)];
        buyerData = {
          name: generateFakeIndoNameAuto(),
          phone: `62812${Date.now().toString().slice(-8)}`,
          address: [randomAddress.line1, randomAddress.line2],
        };
      }
      const newItems: ShopeeItem[] = [];
      const numItems = Math.floor(Math.random() * 4) + 1; // 1 atau 2 item

      for (let i = 0; i < numItems; i++) {
        const randomApiProduct = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 2) + 1;

        // Konversi harga dari USD ke IDR dan bulatkan
        // const priceInIdr = Math.round((randomApiProduct.price * 1) / 500) * 500;
        const priceInIdr = randomApiProduct.price

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
      const shipping = Math.floor(Math.random() * 15000) + 2000;
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
        sellerName: generateNamaTokoHijau(),
        paymentMethod: 'ShopeePay',
        shippingService: 'Sameday',
        buyer: buyerData,
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

    try {
      const buyerToSave = {
        name: receiptData.buyer.name,
        phone: receiptData.buyer.phone,
        address: receiptData.buyer.address,
      };
      localStorage.setItem('savedBuyerData', JSON.stringify(buyerToSave));
    } catch (error) {
      console.error("Gagal menyimpan data pembeli:", error);
    }

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

  const handleEditInvoice = () => {
    setEditData({ ...receiptData });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editData) {
      // Recalculate totals
      const newSummary = calculateTotals(
        editData.items,
        editData.summary.shippingSubtotal,
        editData.summary.serviceFee,
        editData.summary.shippingDiscount
      );
      setReceiptData({
        ...editData,
        summary: newSummary
      });
    }
    setIsEditing(false);
    setEditData(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData(null);
  };

  const handleEditChange = (field: string, value: any, index?: number, subField?: string) => {
    if (!editData) return;

    const newData = { ...editData };

    if (field === 'buyer' && subField) {
      if (subField === 'address') {
        newData.buyer.address = value;
      } else {
        (newData.buyer as any)[subField] = value;
      }
    } else if (field === 'items' && typeof index === 'number') {
      if (subField === 'name') {
        newData.items[index].name = value.split('\n').filter((line: string) => line.trim());
      } else if (subField === 'price' || subField === 'quantity') {
        const numValue = parseInt(value) || 0;
        (newData.items[index] as any)[subField] = numValue;
        newData.items[index].subtotal = newData.items[index].price * newData.items[index].quantity;
      } else if (subField) {
        (newData.items[index] as any)[subField] = value;
      }
    } else if (field === 'summary' && subField) {
      const numValue = parseInt(value) || 0;
      (newData.summary as any)[subField] = numValue;
    } else {
      (newData as any)[field] = value;
    }

    setEditData(newData);
  };

  const handleAddItem = () => {
    if (!editData) return;
    const newItem: ShopeeItem = {
      id: editData.items.length + 1,
      name: ['Produk Baru'],
      variation: 'Standar',
      price: 10000,
      quantity: 1,
      subtotal: 10000
    };
    setEditData({
      ...editData,
      items: [...editData.items, newItem]
    });
  };

  const handleRemoveItem = (index: number) => {
    if (!editData || editData.items.length <= 1) return;
    const newItems = editData.items.filter((_, i) => i !== index);
    setEditData({
      ...editData,
      items: newItems
    });
  };

  return (
    <div className="min-h-screen bg-gray-200 py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-4xl mb-8 print:hidden action-bar">
        <div className="flex flex-wrap items-center justify-center gap-2 bg-white p-4 rounded-lg shadow-md w-max mx-auto">
          {isEditing ? (
            <>
              <button onClick={handleSaveEdit} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium">
                <Download className="w-4 h-4" />
                Simpan
              </button>
              <button onClick={handleCancelEdit} className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm font-medium">
                <Trash2 className="w-4 h-4" />
                Batal
              </button>
            </>
          ) : (
            <>
              <button onClick={generateFakeReceiptData} disabled={isGenerating} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm font-medium disabled:opacity-50">
                <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                {isGenerating ? 'Membuat...' : 'Buat Nota Baru'}
              </button>
              <button onClick={handleEditInvoice} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                <Edit3 className="w-4 h-4" />
                Edit Nota
              </button>
              <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-md text-sm font-medium hover:bg-gray-300"><Printer className="w-4 h-4" /> Cetak</button>
              <button onClick={() => handleDownload('png')} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"><Image className="w-4 h-4" /> PNG</button>
              <button onClick={() => handleDownload('pdf')} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"><Download className="w-4 h-4" /> PDF</button>
            </>
          )}
        </div>
      </div>

      {isEditing && editData ? (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-8" style={{
          // aspectRatio: 1/1.414
        }}>
          <h2 className="text-xl font-bold mb-6 text-gray-800">Edit Nota Pesanan</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700">Informasi Dasar</h3>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">No. Pesanan</label>
                <input
                  type="text"
                  value={editData.orderId}
                  onChange={(e) => handleEditChange('orderId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Tanggal Transaksi</label>
                <input
                  type="text"
                  value={editData.transactionDate}
                  onChange={(e) => handleEditChange('transactionDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Nama Penjual</label>
                <input
                  type="text"
                  value={editData.sellerName}
                  onChange={(e) => handleEditChange('sellerName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Metode Pembayaran</label>
                <input
                  type="text"
                  value={editData.paymentMethod}
                  onChange={(e) => handleEditChange('paymentMethod', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Jasa Kirim</label>
                <input
                  type="text"
                  value={editData.shippingService}
                  onChange={(e) => handleEditChange('shippingService', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Buyer Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700">Informasi Pembeli</h3>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Nama Pembeli</label>
                <input
                  type="text"
                  value={editData.buyer.name}
                  onChange={(e) => handleEditChange('buyer', e.target.value, undefined, 'name')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">No. Handphone</label>
                <input
                  type="text"
                  value={editData.buyer.phone}
                  onChange={(e) => handleEditChange('buyer', e.target.value, undefined, 'phone')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Alamat (pisahkan dengan enter)</label>
                <textarea
                  value={editData.buyer.address.join('\n')}
                  onChange={(e) => handleEditChange('buyer', e.target.value.split('\n'), undefined, 'address')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-700">Produk</h3>
              <button
                onClick={handleAddItem}
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                <Plus className="w-4 h-4" />
                Tambah Produk
              </button>
            </div>

            {editData.items.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium text-gray-700">Produk {index + 1}</h4>
                  {editData.items.length > 1 && (
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Nama Produk (pisahkan dengan enter)</label>
                    <textarea
                      value={item.name.join('\n')}
                      onChange={(e) => handleEditChange('items', e.target.value, index, 'name')}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Variasi</label>
                    <input
                      type="text"
                      value={item.variation}
                      onChange={(e) => handleEditChange('items', e.target.value, index, 'variation')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Harga</label>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => handleEditChange('items', e.target.value, index, 'price')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Kuantitas</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleEditChange('items', e.target.value, index, 'quantity')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-2 text-right">
                  <span className="text-sm text-gray-600">Subtotal: </span>
                  <span className="font-semibold">{formatCurrency(item.subtotal)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-700 mb-4">Ringkasan Pembayaran</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Subtotal Pengiriman</label>
                <input
                  type="number"
                  value={editData.summary.shippingSubtotal}
                  onChange={(e) => handleEditChange('summary', e.target.value, undefined, 'shippingSubtotal')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Biaya Layanan</label>
                <input
                  type="number"
                  value={editData.summary.serviceFee}
                  onChange={(e) => handleEditChange('summary', e.target.value, undefined, 'serviceFee')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Diskon Pengiriman</label>
                <input
                  type="number"
                  value={editData.summary.shippingDiscount}
                  onChange={(e) => handleEditChange('summary', e.target.value, undefined, 'shippingDiscount')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          id="shopee-receipt-content"
          className="
          relative
          w-full max-w-2xl
          mx-auto
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
          <div className="relative z-10 p-16 pt-24"> {/* Padding atas besar untuk logo */}
            {/* Header (sekarang tidak perlu logo) */}
            <header className="flex justify-between items-start">
              <div>
                <h1 className="text-sm">Nota Pesanan</h1>
              </div>
            </header>

            {/* Info Utama */}
            <main className="mt-2 grid grid-cols-2 gap-2 text-xs bg-gray-50 p-2 rounded">
              {/* Kolom Kiri */}
              <div className="space-y-2">
                <div className='flex gap-2'>
                  <h3 className="font-bold text-black">Nama Pembeli:</h3>
                  <p>{receiptData.buyer.name}</p>
                </div>
              </div>
              {/* Kolom Kanan */}
              <div className="space-y-2">
                <div className='flex gap-2'>
                  <h3 className="font-bold text-black">Nama Penjual:</h3>
                  <p className='uppercase'>{receiptData.sellerName}</p>
                </div>
              </div>
              <div className="space-y-2 col-span-full">
                <div>
                  <h3 className="font-bold text-black">Alamat Pembeli:</h3>
                  {receiptData.buyer.address.map((line, i) => <p key={i} className='w-full'>{line}</p>)}
                </div>
                <div>
                  <h3 className="font-bold text-black">No. Handphone Pembeli:</h3>
                  <p>{receiptData.buyer.phone}</p>
                </div>
              </div>
            </main>
            <section className='mt-5 text-xs'>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <h3 className="font-bold text-black">No. Pesanan</h3>
                  <p>{receiptData.orderId}</p>
                </div>
                <div>
                  <h3 className="font-bold text-black">Tanggal Transaksi</h3>
                  <p>{receiptData.transactionDate}</p>
                </div>
                <div>
                  <h3 className="font-bold text-black inline-flex">Metode Pembayaran</h3>
                  <p>{receiptData.paymentMethod}</p>
                </div>
                <div>
                  <h3 className="font-bold text-black">Jasa Kirim</h3>
                  <p>{receiptData.shippingService}</p>
                </div>
              </div>
            </section>

            {/* Tabel Rincian Pesanan */}
            <section className="mt-6">
              <h3 className="font-bold text-black mb-2 text-xs">Rincian Pesanan</h3>
              <table className="w-full text-left text-xs">
                <thead className="border-y border-gray-200">
                  <tr>
                    <th className="p-2 w-8">No.</th>
                    <th className="p-2 w-2/5">Produk</th>
                    <th className="p-2 w-1/5">Variasi</th>
                    <th className="p-2 text-right inline-block w-max">Harga Produk</th>
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
                <div className="bg-gray-50 border border-gray-200 p-2 rounded-md mt-2 space-y-2">
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

                  <div className="flex justify-between items-center">
                    <span className="font-bold">Total Pembayaran</span>
                    <span className="text-total font-bold text-black">{formatCurrency(receiptData.summary.totalPayment)}</span>
                  </div>
                </div>

                <p className="text-black pt-2 text-center">Biaya-biaya yang ditagihkan oleh Shopee (jika ada) sudah termasuk PPN</p>
              </div>
            </section>

            {/* Footer */}
            <footer className="text-xs text-black mt-10 pt-4 border-t border-gray-200">
              <p className="font-bold">PT Shopee International Indonesia</p>
              <p>Sopo Del Tower, 15th Floor, Jl. Mega Kuningan Barat III Lot 10.1-6, Kuningan Timur, Setiabudi,</p>
              <p>Kota Adm. Jakarta Selatan, DKI Jakarta, 12950</p>
              <p>NPWP: 07.366.669.0-003.1000</p>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;