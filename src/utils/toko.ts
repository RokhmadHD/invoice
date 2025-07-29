const kataDepan = [
  "Toko", "Warung", "Kios", "Lapak", "Rumah", "Kebun", "Gerai", "Saung", "Sentra", "Gudang"
];

const kataHijau = [
  "Hijau", "Organik", "Alam", "Segar", "Lestari", "Sehat", "Eco", "Ramah", "Bumi", "Daun",
  "Pangan", "Hutan", "Tumbuh", "Sari", "Sawah", "Pohon", "Flora", "Langit", "Bersih", "Kehidupan"
];

const kataBelakang = [
  "Indah", "Abadi", "Makmur", "Berseri", "Mandiri", "Jaya", "Murni", "Kita", "Tani", "Hijrah",
  "Loka", "Sejahtera", "Makmur", "Natural", "Mart", "Point", "Corner", "Shop", "Farm", "Fresh"
];

function getRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateNamaTokoHijau(): string {
  const depan = Math.random() < 0.5 ? getRandom(kataDepan) + " " : "";
  const tengah = getRandom(kataHijau);
  const belakang = Math.random() < 0.8 ? " " + getRandom(kataBelakang) : "";
  return (depan + tengah + belakang).trim();
}

