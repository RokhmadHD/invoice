const namaIndo = [
  "Andi", "Budi", "Citra", "Dewi", "Eka", "Fajar", "Gita", "Hadi", "Intan", "Joko",
  "Kiki", "Lestari", "Maya", "Nina", "Oka", "Putra", "Qori", "Rina", "Sari", "Tono",
  "Udin", "Vina", "Wawan", "Yuni", "Zaki", "Bayu", "Chandra", "Dian", "Endang", "Fitria",
  "Galih", "Hanif", "Irma", "Jihan", "Kevin", "Linda", "Mega", "Novi", "Oni", "Pandu",
  "Rudi", "Sinta", "Tari", "Ujang", "Vera", "Wulan", "Yana", "Zul", "Adit", "Bagas",
  "Cindy", "Dimas", "Elin", "Farhan", "Gilang", "Hana", "Irfan", "Jenny", "Kamal", "Lina",
  "Mira", "Nando", "Okta", "Prima", "Qiana", "Rama", "Seno", "Tina", "Ulya", "Valen",
  "Widi", "Yuli", "Zara", "Ayu", "Bona", "Cakra", "Dewo", "Erlin", "Fani", "Gerry",
  "Heru", "Indri", "Jaya", "Kania", "Leo", "Monik", "Nana", "Omar", "Pipit", "Qila",
  "Riska", "Samsul", "Tegar", "Umi", "Viona", "Wira", "Yoga", "Zidan", "Aris", "Bela",
  "Candra", "Dina", "Erik", "Fitri", "Gani", "Hera", "Ian", "Kurnia", "Lani"
];

function getRandomName(): string {
  return namaIndo[Math.floor(Math.random() * namaIndo.length)];
}

export function generateFakeIndoNameAuto(): string {
  const wordCount = Math.floor(Math.random() * 4) + 1; // antara 1 dan 4 kata
  const nameParts = [];

  for (let i = 0; i < wordCount; i++) {
    nameParts.push(getRandomName());
  }

  return nameParts.join(" ");
}