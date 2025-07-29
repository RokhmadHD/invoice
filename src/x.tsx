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
    const [isGenerating, setIsGenerating] = useState(false);
    const [editData, setEditData] = useState<ShopeeReceiptData | null>(null);
    const [isEditing, setIsEditing] = useState(false);
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
      type Product = { name: string[]; variation: string; price: number };

      const products: Product[] = [
        { name: ["Paket Sayur Sop"], variation: "per kg", price: 77097 },
        { name: ["Jeruk Sunkist"], variation: "per buah (~2kg)", price: 31868 },
        { name: ["Paket Sayur Sop", "Ramah Lingkungan", "ECO"], variation: "per sisir", price: 115604 },
        { name: ["Mangga Harum Manis"], variation: "500 gr", price: 62314 },
        { name: ["Jeruk Sunkist", "ORGANIK", "Segar"], variation: "box 25 sachet", price: 147853 },
        { name: ["Wortel Berastagi"], variation: "pack 200 gr", price: 77926 },
        { name: ["Reusable Bag"], variation: "per buah (~2kg)", price: 115785 },
        { name: ["Tomat Ceri", "Premium"], variation: "per ikat", price: 93236 },
        { name: ["Apel Fuji"], variation: "botol 500ml", price: 30353 },
        { name: ["Tomat Ceri", "Fresh"], variation: "per kg", price: 125435 },
        { name: ["Jus Jambu Merah"], variation: "botol 500ml", price: 25656 },
        { name: ["Jus Jambu Merah", "Manis"], variation: "per sisir", price: 55407 },
        { name: ["Pisang Cavendish"], variation: "per kg", price: 64742 },
        { name: ["Reusable Bag", "ECO"], variation: "per ikat", price: 31476 },
        { name: ["Wortel Berastagi", "Tanpa Gula"], variation: "Ukuran Large", price: 100638 },
        { name: ["Durian Medan", "Manis"], variation: "per ikat", price: 74986 },
        { name: ["Pisang Cavendish", "ECO", "Premium"], variation: "1 paket", price: 69175 },
        { name: ["Durian Medan", "Impor"], variation: "pack 250 gr", price: 62570 },
        { name: ["Paket Sayur Sop", "ORGANIK"], variation: "per ikat", price: 13414 },
        { name: ["Reusable Bag", "Impor"], variation: "pack 250 gr", price: 22350 },
        { name: ["Jeruk Sunkist", "Manis", "Segar"], variation: "Ukuran Large", price: 135870 },
        { name: ["Wortel Berastagi", "Tanpa Gula", "Premium"], variation: "pack 250 gr", price: 41603 },
        { name: ["Jeruk Sunkist", "Ramah Lingkungan", "Fresh"], variation: "box 25 sachet", price: 117311 },
        { name: ["Teh Hijau", "Impor", "Manis"], variation: "per ikat", price: 41262 },
        { name: ["Jus Jambu Merah", "ECO"], variation: "per kg", price: 33743 },
        { name: ["Durian Medan", "Premium", "Impor"], variation: "per sisir", price: 21653 },
        { name: ["Wortel Berastagi", "Tanpa Gula"], variation: "1 paket", price: 70906 },
        { name: ["Jus Jambu Merah"], variation: "Ukuran Large", price: 35029 },
        { name: ["Paket Sayur Sop", "Fresh", "Manis"], variation: "500 gr", price: 81939 },
        { name: ["Wortel Berastagi"], variation: "pack 200 gr", price: 5850 },
        { name: ["Pisang Cavendish", "Fresh", "Premium"], variation: "1 paket", price: 32894 },
        { name: ["Madu Hutan Murni", "Fresh", "Segar"], variation: "per buah (~2kg)", price: 103019 },
        { name: ["Reusable Bag"], variation: "1 paket", price: 144029 },
        { name: ["Teh Hijau"], variation: "per sisir", price: 89975 },
        { name: ["Rujak Buah"], variation: "500 gr", price: 100153 },
        { name: ["Teh Hijau", "Segar"], variation: "per kg", price: 68143 },
        { name: ["Teh Hijau", "ECO", "Ramah Lingkungan"], variation: "box 25 sachet", price: 132399 },
        { name: ["Madu Hutan Murni"], variation: "1 paket", price: 37967 },
        { name: ["Durian Medan", "Tanpa Gula", "Premium"], variation: "pack 250 gr", price: 143326 },
        { name: ["Madu Hutan Murni", "Impor", "Segar"], variation: "1 paket", price: 57730 },
        { name: ["Pisang Cavendish", "Impor"], variation: "Ukuran Large", price: 102889 },
        { name: ["Rujak Buah", "Tanpa Gula", "ECO"], variation: "per ikat", price: 63903 },
        { name: ["Apel Fuji", "ORGANIK"], variation: "per sisir", price: 65323 },
        { name: ["Selada ORGANIK"], variation: "per kg", price: 23610 },
        { name: ["Pisang Cavendish", "ORGANIK", "Segar"], variation: "500 gr", price: 13234 },
        { name: ["Madu Hutan Murni", "ECO"], variation: "1 paket", price: 67391 },
        { name: ["Bayam Segar", "Tanpa Gula", "Segar"], variation: "1 paket", price: 39684 },
        { name: ["Pisang Cavendish", "Tanpa Gula", "Segar"], variation: "pack 200 gr", price: 111708 },
        { name: ["Jeruk Sunkist"], variation: "500 gr", price: 117997 },
        { name: ["Tomat Ceri", "Impor"], variation: "pack 200 gr", price: 19200 },
        { name: ["Paket Sayur Sop", "ECO", "ORGANIK"], variation: "botol 500ml", price: 93946 },
        { name: ["Reusable Bag"], variation: "per ikat", price: 55224 },
        { name: ["Jeruk Sunkist", "Tanpa Gula", "Premium"], variation: "botol 500ml", price: 53100 },
        { name: ["Bayam Segar", "Segar"], variation: "500 gr", price: 121164 },
        { name: ["Reusable Bag", "ECO", "ORGANIK"], variation: "Ukuran Large", price: 146711 },
        { name: ["Madu Hutan Murni"], variation: "500 gr", price: 66965 },
        { name: ["Durian Medan", "Tanpa Gula"], variation: "pack 200 gr", price: 61032 },
        { name: ["Madu Hutan Murni", "ORGANIK"], variation: "per buah (~2kg)", price: 104345 },
        { name: ["Mangga Harum Manis", "Fresh"], variation: "pack 200 gr", price: 79776 },
        { name: ["Wortel Berastagi", "Ramah Lingkungan", "Tanpa Gula"], variation: "per buah (~2kg)", price: 54780 },
        { name: ["Bayam Segar"], variation: "per kg", price: 147133 },
        { name: ["Mangga Harum Manis", "Manis", "ORGANIK"], variation: "per kg", price: 129987 },
        { name: ["Jus Jambu Merah", "Premium", "ORGANIK"], variation: "1 paket", price: 26000 },
        { name: ["Madu Hutan Murni"], variation: "500 gr", price: 22815 },
        { name: ["Paket Sayur Sop"], variation: "botol 500ml", price: 36427 },
        { name: ["Teh Hijau", "Segar", "ORGANIK"], variation: "per sisir", price: 26491 },
        { name: ["Wortel Berastagi", "Ramah Lingkungan", "Manis"], variation: "pack 250 gr", price: 58545 },
        { name: ["Paket Sayur Sop", "Manis", "Segar"], variation: "pack 250 gr", price: 108752 },
        { name: ["Durian Medan", "Fresh", "Tanpa Gula"], variation: "porsi besar", price: 24016 },
        { name: ["Mangga Harum Manis", "ECO"], variation: "500 gr", price: 145937 },
        { name: ["Jeruk Sunkist", "Fresh", "Premium"], variation: "porsi besar", price: 23033 },
        { name: ["Teh Hijau"], variation: "porsi besar", price: 79707 },
        { name: ["Durian Medan", "Ramah Lingkungan"], variation: "box 25 sachet", price: 84303 },
        { name: ["Selada ORGANIK", "Ramah Lingkungan", "ORGANIK"], variation: "Ukuran Large", price: 83480 },
        { name: ["Teh Hijau", "ECO", "Premium"], variation: "pack 250 gr", price: 35258 },
        { name: ["Teh Hijau"], variation: "box 25 sachet", price: 45749 },
        { name: ["Bayam Segar", "Segar"], variation: "box 25 sachet", price: 94884 },
        { name: ["Jeruk Sunkist", "Fresh", "Tanpa Gula"], variation: "pack 250 gr", price: 18316 },
        { name: ["Apel Fuji", "Impor", "Fresh"], variation: "per kg", price: 5929 },
        { name: ["Tomat Ceri"], variation: "Ukuran Large", price: 73670 },
        { name: ["Durian Medan", "Tanpa Gula", "Impor"], variation: "1 paket", price: 7534 },
        { name: ["Apel Fuji"], variation: "box 25 sachet", price: 44073 },
        { name: ["Jus Jambu Merah"], variation: "porsi besar", price: 149841 },
        { name: ["Durian Medan", "Premium"], variation: "per kg", price: 85808 },
        { name: ["Tomat Ceri"], variation: "porsi besar", price: 60070 },
        { name: ["Paket Sayur Sop"], variation: "Ukuran Large", price: 31946 },
        { name: ["Tomat Ceri", "Impor", "Premium"], variation: "per ikat", price: 47598 },
        { name: ["Reusable Bag"], variation: "botol 500ml", price: 11497 },
        { name: ["Durian Medan", "Manis", "Impor"], variation: "Ukuran Large", price: 70055 },
        { name: ["Bayam Segar"], variation: "box 25 sachet", price: 33336 },
        { name: ["Wortel Berastagi"], variation: "pack 200 gr", price: 63309 },
        { name: ["Jeruk Sunkist", "Manis"], variation: "pack 250 gr", price: 64662 },
        { name: ["Jeruk Sunkist"], variation: "Ukuran Large", price: 55627 },
        { name: ["Wortel Berastagi", "Fresh"], variation: "500 gr", price: 78170 },
        { name: ["Tomat Ceri", "Ramah Lingkungan", "Impor"], variation: "Ukuran Large", price: 145565 },
        { name: ["Tomat Ceri"], variation: "500 gr", price: 73475 },
        { name: ["Durian Medan", "Fresh", "ORGANIK"], variation: "500 gr", price: 118918 },
        { name: ["Tomat Ceri", "Manis", "Impor"], variation: "per sisir", price: 139066 },
        { name: ["Apel Fuji", "Segar"], variation: "pack 250 gr", price: 16635 },
        { name: ["Pisang Cavendish", "ORGANIK"], variation: "1 paket", price: 146151 },
        { name: ["Paket Sayur Sop", "Segar", "Manis"], variation: "botol 500ml", price: 23343 },
        { name: ["Paket Sayur Sop", "Manis"], variation: "Ukuran Large", price: 37669 },
        { name: ["Pisang Cavendish", "Ramah Lingkungan"], variation: "pack 250 gr", price: 112057 },
        { name: ["Tomat Ceri", "Fresh"], variation: "1 paket", price: 38367 },
        { name: ["Jeruk Sunkist", "Impor"], variation: "Ukuran Large", price: 50620 },
        { name: ["Selada ORGANIK", "Fresh", "Impor"], variation: "1 paket", price: 5106 },
        { name: ["Bayam Segar", "Segar"], variation: "botol 500ml", price: 89475 },
        { name: ["Rujak Buah", "Tanpa Gula"], variation: "Ukuran Large", price: 61020 },
        { name: ["Jus Jambu Merah", "Premium"], variation: "Ukuran Large", price: 27228 },
        { name: ["Bayam Segar", "Manis", "ECO"], variation: "per ikat", price: 86374 },
        { name: ["Jeruk Sunkist"], variation: "per buah (~2kg)", price: 11402 },
        { name: ["Mangga Harum Manis"], variation: "pack 200 gr", price: 24091 },
        { name: ["Rujak Buah", "Segar"], variation: "box 25 sachet", price: 105657 },
        { name: ["Rujak Buah", "Segar"], variation: "per buah (~2kg)", price: 6453 },
        { name: ["Teh Hijau"], variation: "botol 500ml", price: 62367 },
        { name: ["Durian Medan", "Ramah Lingkungan", "Tanpa Gula"], variation: "per kg", price: 70325 },
        { name: ["Teh Hijau"], variation: "pack 200 gr", price: 39954 },
        { name: ["Reusable Bag", "Ramah Lingkungan"], variation: "1 paket", price: 88177 },
        { name: ["Reusable Bag", "Ramah Lingkungan"], variation: "botol 500ml", price: 148621 },
        { name: ["Rujak Buah"], variation: "box 25 sachet", price: 129433 },
        { name: ["Rujak Buah", "Segar"], variation: "Ukuran Large", price: 77695 },
        { name: ["Reusable Bag", "Tanpa Gula", "Segar"], variation: "pack 250 gr", price: 120309 },
        { name: ["Apel Fuji", "Fresh", "Segar"], variation: "pack 250 gr", price: 93040 },
        { name: ["Tomat Ceri", "ECO", "Premium"], variation: "per buah (~2kg)", price: 65623 },
        { name: ["Wortel Berastagi", "Premium", "Segar"], variation: "500 gr", price: 113755 },
        { name: ["Wortel Berastagi", "Ramah Lingkungan"], variation: "pack 200 gr", price: 113992 },
        { name: ["Mangga Harum Manis"], variation: "botol 500ml", price: 107099 },
        { name: ["Teh Hijau", "ORGANIK", "Impor"], variation: "pack 200 gr", price: 6545 },
        { name: ["Tomat Ceri", "Impor"], variation: "botol 500ml", price: 146091 },
        { name: ["Pisang Cavendish", "Ramah Lingkungan", "Segar"], variation: "pack 200 gr", price: 62520 },
        { name: ["Bayam Segar", "Tanpa Gula"], variation: "per kg", price: 106936 },
        { name: ["Tomat Ceri", "Impor", "Premium"], variation: "pack 200 gr", price: 38456 },
        { name: ["Selada ORGANIK", "ORGANIK", "Impor"], variation: "per sisir", price: 12104 },
        { name: ["Apel Fuji", "Impor", "Premium"], variation: "pack 200 gr", price: 52639 },
        { name: ["Mangga Harum Manis", "Impor"], variation: "porsi besar", price: 60485 },
        { name: ["Rujak Buah", "Manis"], variation: "botol 500ml", price: 77943 },
        { name: ["Reusable Bag", "Fresh"], variation: "500 gr", price: 128288 },
        { name: ["Mangga Harum Manis", "Ramah Lingkungan", "ORGANIK"], variation: "porsi besar", price: 63778 },
        { name: ["Paket Sayur Sop"], variation: "Ukuran Large", price: 15553 },
        { name: ["Reusable Bag"], variation: "per ikat", price: 57261 },
        { name: ["Madu Hutan Murni"], variation: "per sisir", price: 44946 },
        { name: ["Jeruk Sunkist"], variation: "pack 200 gr", price: 34986 },
        { name: ["Selada ORGANIK"], variation: "pack 200 gr", price: 72172 },
        { name: ["Reusable Bag", "Premium"], variation: "per sisir", price: 35024 },
        { name: ["Reusable Bag"], variation: "pack 250 gr", price: 33337 },
        { name: ["Selada ORGANIK"], variation: "pack 250 gr", price: 103384 },
        { name: ["Wortel Berastagi", "Segar", "ECO"], variation: "per sisir", price: 68661 },
        { name: ["Apel Fuji", "Fresh", "ECO"], variation: "per sisir", price: 15766 },
        { name: ["Tomat Ceri", "Impor", "Manis"], variation: "500 gr", price: 137634 },
        { name: ["Paket Sayur Sop", "ORGANIK"], variation: "botol 500ml", price: 133503 },
        { name: ["Apel Fuji", "Manis"], variation: "Ukuran Large", price: 125517 },
        { name: ["Pisang Cavendish"], variation: "botol 500ml", price: 51173 },
        { name: ["Pisang Cavendish", "Fresh", "Tanpa Gula"], variation: "pack 200 gr", price: 119183 },
        { name: ["Madu Hutan Murni", "Fresh", "Manis"], variation: "per ikat", price: 27718 },
        { name: ["Bayam Segar", "Segar"], variation: "pack 200 gr", price: 104349 },
        { name: ["Tomat Ceri"], variation: "pack 200 gr", price: 90200 },
        { name: ["Durian Medan", "Segar"], variation: "porsi besar", price: 72725 },
        { name: ["Tomat Ceri", "Fresh"], variation: "1 paket", price: 7661 },
        { name: ["Jus Jambu Merah"], variation: "500 gr", price: 68270 },
        { name: ["Pisang Cavendish", "Tanpa Gula"], variation: "1 paket", price: 67999 },
        { name: ["Pisang Cavendish", "Tanpa Gula"], variation: "pack 200 gr", price: 9520 },
        { name: ["Apel Fuji", "Segar"], variation: "botol 500ml", price: 68780 },
        { name: ["Bayam Segar", "Manis", "Tanpa Gula"], variation: "1 paket", price: 144177 },
        { name: ["Tomat Ceri", "Ramah Lingkungan"], variation: "porsi besar", price: 97225 },
        { name: ["Pisang Cavendish", "Fresh"], variation: "pack 250 gr", price: 70903 },
        { name: ["Jeruk Sunkist"], variation: "box 25 sachet", price: 55484 },
        { name: ["Tomat Ceri"], variation: "box 25 sachet", price: 145473 },
        { name: ["Reusable Bag", "Premium", "Segar"], variation: "per ikat", price: 131929 },
        { name: ["Bayam Segar", "Ramah Lingkungan", "Fresh"], variation: "500 gr", price: 55886 },
        { name: ["Bayam Segar"], variation: "porsi besar", price: 52039 },
        { name: ["Bayam Segar"], variation: "box 25 sachet", price: 145020 },
        { name: ["Durian Medan", "ORGANIK"], variation: "per kg", price: 81581 },
        { name: ["Pisang Cavendish"], variation: "Ukuran Large", price: 133680 },
        { name: ["Apel Fuji"], variation: "per sisir", price: 79537 },
        { name: ["Rujak Buah", "Tanpa Gula"], variation: "porsi besar", price: 53329 },
        { name: ["Mangga Harum Manis", "Tanpa Gula"], variation: "500 gr", price: 22129 },
        { name: ["Wortel Berastagi", "ECO"], variation: "per sisir", price: 19053 },
        { name: ["Durian Medan"], variation: "per sisir", price: 84648 },
        { name: ["Apel Fuji"], variation: "500 gr", price: 114097 },
        { name: ["Selada ORGANIK", "Segar", "Impor"], variation: "pack 200 gr", price: 121056 },
        { name: ["Bayam Segar", "Impor", "Fresh"], variation: "per sisir", price: 20789 },
        { name: ["Selada ORGANIK", "ECO", "Segar"], variation: "Ukuran Large", price: 60318 },
        { name: ["Bayam Segar", "ECO", "Premium"], variation: "per ikat", price: 50564 },
        { name: ["Jus Jambu Merah"], variation: "per buah (~2kg)", price: 5701 },
        { name: ["Wortel Berastagi", "Tanpa Gula"], variation: "pack 250 gr", price: 13556 },
        { name: ["Jeruk Sunkist", "Fresh"], variation: "box 25 sachet", price: 124021 },
        { name: ["Apel Fuji", "Segar", "Fresh"], variation: "Ukuran Large", price: 56857 },
        { name: ["Wortel Berastagi"], variation: "1 paket", price: 63932 },
        { name: ["Paket Sayur Sop"], variation: "pack 250 gr", price: 42286 },
        { name: ["Apel Fuji"], variation: "per buah (~2kg)", price: 85638 },
        { name: ["Selada ORGANIK", "Fresh", "Tanpa Gula"], variation: "500 gr", price: 127866 },
        { name: ["Pisang Cavendish", "Impor"], variation: "pack 250 gr", price: 136195 },
        { name: ["Jus Jambu Merah", "Tanpa Gula"], variation: "500 gr", price: 15449 },
        { name: ["Teh Hijau", "Manis"], variation: "per sisir", price: 70632 },
        { name: ["Mangga Harum Manis"], variation: "per ikat", price: 10438 },
        { name: ["Reusable Bag", "Fresh", "ORGANIK"], variation: "per buah (~2kg)", price: 128338 },
        { name: ["Jus Jambu Merah", "Tanpa Gula", "Fresh"], variation: "per buah (~2kg)", price: 119264 },
        { name: ["Paket Sayur Sop", "ECO"], variation: "pack 200 gr", price: 96215 },
        { name: ["Wortel Berastagi", "Manis"], variation: "Ukuran Large", price: 32420 },
        { name: ["Madu Hutan Murni"], variation: "porsi besar", price: 112910 },
      ];

      const sellers = ['KebunPakTani', 'FreshFruit_ID', 'SayurSegarJakarta', 'WarungBuahIbu'];
      const buyers = ['Andi_Wijaya', 'Siti_Aisyah', 'Budi_Santoso', 'Dewi_Lestari'];

      // BARU: Daftar alamat Indonesia yang realistis
      const indonesianAddresses = [
        {
          line1: 'Jl. Sudirman No. 123, RT.05/RW.12, Karet Tengsin',
          line2: 'KOTA JAKARTA PUSAT, DKI JAKARTA, ID, 10220'
        },
        {
          line1: 'Jl. Gatot Subroto Kav. 18, RT.03/RW.01, Kuningan Timur',
          line2: 'KOTA JAKARTA SELATAN, DKI JAKARTA, ID, 12950'
        },
        {
          line1: 'Jl. Asia Afrika No. 8, RT.02/RW.05, Sumur Bandung',
          line2: 'KOTA BANDUNG, JAWA BARAT, ID, 40111'
        },
        {
          line1: 'Jl. Malioboro No. 56, RT.01/RW.03, Sosromenduran',
          line2: 'KOTA YOGYAKARTA, DI YOGYAKARTA, ID, 55271'
        },
        {
          line1: 'Jl. Diponegoro No. 45, RT.07/RW.02, Pendrikan Kidul',
          line2: 'KOTA SEMARANG, JAWA TENGAH, ID, 50131'
        },
        {
          line1: 'Jl. Pemuda No. 27, RT.04/RW.08, Embong Kaliasin',
          line2: 'KOTA SURABAYA, JAWA TIMUR, ID, 60271'
        },
        {
          line1: 'Jl. Ahmad Yani No. 15, RT.09/RW.04, Ketapang',
          line2: 'KOTA MEDAN, SUMATERA UTARA, ID, 20112'
        },
        {
          line1: 'Jl. Soekarno Hatta No. 234, RT.06/RW.15, Batununggal',
          line2: 'KOTA BANDUNG, JAWA BARAT, ID, 40266'
        },
        {
          line1: 'Jl. Hayam Wuruk No. 67, RT.11/RW.06, Maphar',
          line2: 'KOTA JAKARTA BARAT, DKI JAKARTA, ID, 11160'
        },
        {
          line1: 'Jl. Raya Bogor Km. 24, RT.08/RW.11, Cijantung',
          line2: 'KOTA JAKARTA TIMUR, DKI JAKARTA, ID, 13770'
        },
        {
          line1: 'Jl. Gajah Mada No. 190, RT.05/RW.03, Kraton',
          line2: 'KOTA YOGYAKARTA, DI YOGYAKARTA, ID, 55131'
        },
        {
          line1: 'Jl. Veteran No. 18, RT.02/RW.07, Ketawanggede',
          line2: 'KOTA MALANG, JAWA TIMUR, ID, 65145'
        },
        {
          line1: 'Jl. Imam Bonjol No. 41, RT.12/RW.08, Menteng',
          line2: 'KOTA JAKARTA PUSAT, DKI JAKARTA, ID, 10310'
        },
        {
          line1: 'Jl. Kaliurang Km. 5.2, RT.01/RW.15, Caturtunggal',
          line2: 'KAB. SLEMAN, DI YOGYAKARTA, ID, 55281'
        },
        {
          line1: 'Jl. Raya Ciledug No. 168, RT.03/RW.09, Ulujami',
          line2: 'KOTA JAKARTA SELATAN, DKI JAKARTA, ID, 12250'
        },
        {
          line1: 'Jl. Sisingamangaraja No. 23, RT.07/RW.12, Selong',
          line2: 'KOTA JAKARTA SELATAN, DKI JAKARTA, ID, 12560'
        },
        {
          line1: 'Jl. Pahlawan No. 45, RT.04/RW.06, Sukaluyu',
          line2: 'KOTA BANDUNG, JAWA BARAT, ID, 40123'
        },
        {
          line1: 'Jl. Prof. Dr. Hamka No. 17, RT.09/RW.03, Air Tawar Barat',
          line2: 'KOTA PADANG, SUMATERA BARAT, ID, 25132'
        },
        {
          line1: 'Jl. Sultan Agung No. 88, RT.06/RW.14, Gunungpati',
          line2: 'KOTA SEMARANG, JAWA TENGAH, ID, 50229'
        },
        {
          line1: 'Jl. Basuki Rahmat No. 51, RT.08/RW.02, Sukolilo',
          line2: 'KOTA SURABAYA, JAWA TIMUR, ID, 60111'
        },
        {
          line1: 'Jl. Cihampelas No. 160, RT.05/RW.11, Cipaganti',
          line2: 'KOTA BANDUNG, JAWA BARAT, ID, 40131'
        },
        {
          line1: 'Jl. Thamrin No. 9, RT.02/RW.01, Gondangdia',
          line2: 'KOTA JAKARTA PUSAT, DKI JAKARTA, ID, 10350'
        },
        {
          line1: 'Jl. Erlangga No. 34, RT.10/RW.05, Mergangsan',
          line2: 'KOTA YOGYAKARTA, DI YOGYAKARTA, ID, 55143'
        },
        {
          line1: 'Jl. Veteran No. 129, RT.03/RW.08, Penanggungan',
          line2: 'KOTA MALANG, JAWA TIMUR, ID, 65113'
        },
        {
          line1: 'Jl. Otto Iskandardinata No. 64, RT.07/RW.13, Nyenang',
          line2: 'KOTA BANDUNG, JAWA BARAT, ID, 40614'
        }
      ];

      // Ambil produk acak dari daftar lokal
      const newItems: ShopeeItem[] = [];
      const numItems = Math.floor(Math.random() * 2) + 1; // 1 atau 2 item

      for (let i = 0; i < numItems; i++) {
        const randomApiProduct = products[Math.floor(Math.random() * products.length)];
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

      // Pilih alamat acak dari daftar
      const randomAddress = indonesianAddresses[Math.floor(Math.random() * indonesianAddresses.length)];

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
          address: [randomAddress.line1, randomAddress.line2], // Gunakan alamat acak
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
        <div className="flex flex-wrap items-center justify-center gap-2 bg-white p-4 rounded-lg shadow-md">
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
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 mb-8">
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
      )}
    </div>
  );
}

export default App;