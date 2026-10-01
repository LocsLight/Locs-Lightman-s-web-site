// Remplace ces contenus par les tiens.
export const artist = {
  name: "Locs Lightman",
  tagline: "Nouvel album, bientôt disponible partout.",
  email: "contact@locslightman.com",
  socials: [
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "Spotify", href: "https://open.spotify.com/" },
    { label: "YouTube", href: "https://youtube.com/" },
  ],
};

export const merch = [
  { name: "T-shirt", price: "25€", image: "merch_tshirt.png", href: "#" },
  { name: "Sweat", price: "45€", image: "merch_sweat.png", href: "#" },
  { name: "Casquette", price: "20€", image: "merch_casquette.png", href: "#" },
  { name: "Mug", price: "12€", image: "merch_mug.png", href: "#" },
  { name: "Affiche", price: "15€", image: "merch_affiche2.png", href: "#" },
];

export const albums = [
  {
    title: "L'Iceberg de Magma",
    year: 2026,
    cover: "cover_idm.png",
    description:
      "Quelques lignes sur l'album : d'où il vient, comment il a été enregistré, ce qu'il raconte.",
    links: [
      { label: "Écouter sur Spotify", href: "https://open.spotify.com/" },
      { label: "Écouter sur Apple Music", href: "https://music.apple.com/" },
      { label: "Acheter le vinyle", href: "#" },
    ],
  },
  // Ajoute d'autres albums ici, avec le même format.
];

export const tracks = [
  { title: "Hey ya", duration: "3:42", album: "L'Iceberg de Magma" },
  { title: "Britney", duration: "4:05", album: "L'Iceberg de Magma" },
  { title: "Gorgée d'eau", duration: "2:58", album: "L'Iceberg de Magma" },
  { title: "Tsunami", duration: "3:31", album: "L'Iceberg de Magma" },
  { title: "Spaceship", duration: "5:12", album: "L'Iceberg de Magma" },
  { title: "NBA", duration: "5:12", album: "L'Iceberg de Magma" },
  { title: "What's poppin'", duration: "5:12", album: "L'Iceberg de Magma" },
  { title: "Reviens me voir", duration: "5:12", album: "L'Iceberg de Magma" },
  { title: "Bulma", duration: "3:19", cover: "cover_bulma.png", spotifyId: "0NT5SQQXrcZQeWeBEoCmgj" },
  { title: "À l'antipode", duration: "2:45", cover: "cover_alantipode.png", spotifyId: "73lHNMgP2M1V5FraK4fBdS" },
];

// id = la partie après "v=" dans l'URL YouTube
export const videos = [
   { id: "TewlQiGNwZs", title: "Vent froid", type: "short" },
  { id: "eIe9SPTiSho", title: "Gorgée d'eau", type: "short" },
  { id: "861tzoimu1k", title: "Bulma", type: "short" },
  { id: "AyTTxOYygQc", title: "À l'antipode", type: "video" },
  { id: "0aG95n5n50Y", title: "Bulma", type: "video" },
];

export const news = [
  {
    date: "2026-10-15",
    title: "Sortie de l'album",
    excerpt: "L'album sera disponible sur toutes les plateformes.",
    href: "#",
  },
  {
    date: "2026-04-24",
    title: "Bulma en ligne",
    excerpt: "Le clip du second single est sur YouTube.",
    href: "#",
  },
  {
    date: "2026-04-14",
    title: "À l'antipode en ligne",
    excerpt: "Le clip du premier single est sur YouTube.",
    href: "#",
  },
];
