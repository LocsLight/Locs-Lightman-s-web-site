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
  {
    slug: "t-shirt",
    name: "T-shirts",
    price: "25€",
    colors: [
      { name: "Noir", image: "merch_tshirt_noir.png" },
      { name: "Blanc", image: "merch_tshirt_blanc.png" },
    ],
    description: "T-shirt 100% coton, coupe unisexe, sérigraphie du logo.",
    sizes: ["S", "M", "L", "XL"],
    href: "#",
  },
  {
    slug: "sweat",
    name: "Hoodies",
    price: "45€",
    colors: [
      { name: "Noir", image: "merch_sweat_noir.png" },
      { name: "Gris chiné", image: "merch_sweat_gris.png" },
    ],
    description: "Sweat à capuche, molleton épais, broderie poitrine.",
    sizes: ["S", "M", "L", "XL"],
    href: "#",
  },
  {
    slug: "casquette",
    name: "Casquettes",
    price: "20€",
    colors: [
      { name: "Noir", image: "merch_casquette_noir.png" },
      { name: "Beige", image: "merch_casquette_beige.png" },
    ],
    description: "Casquette ajustable, broderie avant.",
    sizes: ["Taille unique"],
    href: "#",
  },
  {
    slug: "mug",
    name: "Mugs",
    price: "12€",
    image: "merch_mug.png",
    description: "Mug céramique 325 ml, impression résistante au lave-vaisselle.",
    sizes: [],
    href: "#",
  },
  {
    slug: "affiche",
    name: "Affiches",
    price: "15€",
    colors: [
      { name: "Affiche 1", image: "merch_affiche1.png" },
      { name: "Affiche 2", image: "merch_affiche2.png" },
    ],
    description: "Affiche A3, papier mat 250g.",
    sizes: ["A3"],
    href: "#",
  },
];

export const albums = [
  {
    title: "L'Iceberg de Magma",
    year: 2026,
    cover: "cover_idm.png",
    description:
      "L'album 'L'Iceberg de Magma' est une exploration sonore qui fusionne des éléments de différents styles de rap. Chaque piste est conçue pour emmener l'auditeur dans un voyage émotionnel à travers des paysages sonores riches et variés.",
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
