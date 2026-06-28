export interface Product {
  id: string;
  slug?: string;
  name: string;
  subtitle: string;
  price: number;
  mrp?: number;
  currency: string;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  badge?: string;
  description: string;
  benefits: string[];
  spiritualMeaning: string;
}

export const products: Product[] = [
  {
    id: "amethyst-cluster",
    name: "Amethyst Cluster",
    subtitle: "Crown Chakra Activator",
    price: 89,
    mrp: 149,
    currency: "₹",
    category: "Crystals",
    image: "/products/crystal",
    rating: 4.9,
    reviews: 127,
    badge: "Bestseller",
    description: "A stunning natural amethyst cluster sourced from Uruguay, radiating deep purple energy to calm the mind and awaken spiritual insight.",
    benefits: ["Enhances intuition", "Promotes restful sleep", "Calms anxiety", "Deepens meditation"],
    spiritualMeaning: "Amethyst connects to the Crown and Third Eye chakras, opening pathways to higher consciousness and inner peace."
  },
  {
    id: "chakra-bracelet",
    name: "7 Chakra Bracelet",
    subtitle: "Full Spectrum Alignment",
    price: 45,
    mrp: 79,
    currency: "₹",
    category: "Bracelets",
    image: "/products/bracelet",
    rating: 4.8,
    reviews: 243,
    badge: "Popular",
    description: "Handcrafted with seven genuine gemstones representing each chakra.",
    benefits: ["Balances all 7 chakras", "Promotes energy flow", "Beautiful daily wear", "Handcrafted quality"],
    spiritualMeaning: "Each stone resonates with a specific energy center, creating harmony throughout your being."
  },
  {
    id: "sandalwood-mala",
    name: "Sandalwood Mala",
    subtitle: "108 Bead Meditation Mala",
    price: 68,
    mrp: 120,
    currency: "₹",
    category: "Malas",
    image: "/products/mala",
    rating: 4.9,
    reviews: 89,
    description: "Traditional 108-bead mala crafted from aromatic sandalwood and rudraksha seeds.",
    benefits: ["Deepens meditation practice", "Natural calming aroma", "Traditional craftsmanship", "Sacred 108 beads"],
    spiritualMeaning: "The mala is a sacred tool for counting mantras, guiding the practitioner into deeper awareness."
  },
  {
    id: "clear-quartz-point",
    name: "Clear Quartz Tower",
    subtitle: "Master Healer Crystal",
    price: 56,
    mrp: 95,
    currency: "₹",
    category: "Crystals",
    image: "/products/crystal-point",
    rating: 4.7,
    reviews: 156,
    badge: "New",
    description: "A polished clear quartz generator point that amplifies energy and intention.",
    benefits: ["Amplifies energy", "Enhances clarity", "Programmable intentions", "Universal healer"],
    spiritualMeaning: "Known as the Master Healer, clear quartz amplifies the energy of all other crystals."
  },
  {
    id: "sage-selenite-kit",
    name: "Cleansing Ritual Kit",
    subtitle: "Sage & Selenite Bundle",
    price: 38,
    mrp: 65,
    currency: "₹",
    category: "Healing Tools",
    image: "/products/healing-kit",
    rating: 4.8,
    reviews: 198,
    description: "Complete energy cleansing kit with sage bundle and selenite wand.",
    benefits: ["Clears negative energy", "Purifies spaces", "Promotes fresh starts", "Complete ritual set"],
    spiritualMeaning: "Sage cleanses while selenite brings liquid light to dissolve stagnant energy."
  },
  {
    id: "lapis-pendant",
    name: "Lapis Lazuli Pendant",
    subtitle: "Third Eye Awakener",
    price: 120,
    mrp: 199,
    currency: "₹",
    category: "Pendants",
    image: "/products/pendant",
    rating: 4.9,
    reviews: 67,
    badge: "Premium",
    description: "Genuine lapis lazuli set in 18k gold-plated sterling silver.",
    benefits: ["Enhances wisdom", "Stimulates truth", "Royal elegance", "Handcrafted setting"],
    spiritualMeaning: "Lapis Lazuli was treasured by ancient Egyptians, activating the Third Eye chakra."
  },
  {
    id: "rose-quartz-heart",
    name: "Rose Quartz Heart",
    subtitle: "Unconditional Love Stone",
    price: 42,
    mrp: 75,
    currency: "₹",
    category: "Crystals",
    image: "/products/rose-quartz",
    rating: 4.8,
    reviews: 312,
    badge: "Bestseller",
    description: "Hand-carved rose quartz heart stone, polished to perfection.",
    benefits: ["Opens the heart chakra", "Attracts love", "Heals emotional wounds", "Promotes self-compassion"],
    spiritualMeaning: "Rose Quartz dissolves emotional wounds and opens the heart to love."
  },
  {
    id: "tiger-eye-bracelet",
    name: "Tiger Eye Power Bracelet",
    subtitle: "Courage & Confidence",
    price: 35,
    mrp: 60,
    currency: "₹",
    category: "Bracelets",
    image: "/products/tiger-eye",
    rating: 4.7,
    reviews: 189,
    description: "Genuine tiger eye beads radiating confidence, courage, and personal power.",
    benefits: ["Boosts confidence", "Enhances willpower", "Attracts abundance", "Grounds energy"],
    spiritualMeaning: "Tiger Eye empowers with courage of a tiger and vision of an eagle."
  },
  {
    id: "feng-shui-buddha",
    name: "Golden Laughing Buddha",
    subtitle: "Prosperity & Joy Figurine",
    price: 85,
    mrp: 150,
    currency: "₹",
    category: "Feng Shui",
    image: "/products/feng-shui",
    rating: 4.9,
    reviews: 94,
    badge: "Featured",
    description: "Handcrafted golden Laughing Buddha figurine for happiness and abundance.",
    benefits: ["Attracts wealth", "Promotes happiness", "Brings good fortune", "Feng Shui essential"],
    spiritualMeaning: "The Laughing Buddha represents joy of enlightenment and generous abundance."
  },
  {
    id: "evil-eye-bracelet",
    name: "Evil Eye Protection Bracelet",
    subtitle: "Nazar Shield",
    price: 32,
    mrp: 55,
    currency: "₹",
    category: "Evil Eye",
    image: "/products/evil-eye",
    rating: 4.6,
    reviews: 276,
    badge: "Popular",
    description: "Sterling silver evil eye bracelet with deep blue glass nazar bead.",
    benefits: ["Wards off negativity", "Ancient protection", "Elegant design", "Daily wear safe"],
    spiritualMeaning: "The Evil Eye amulet reflects negative energy back to its source."
  },
  {
    id: "rudraksha-mala",
    name: "5 Mukhi Rudraksha Mala",
    subtitle: "Sacred Shiva Beads",
    price: 95,
    mrp: 175,
    currency: "₹",
    category: "Rudraksha",
    image: "/products/rudraksha",
    rating: 4.9,
    reviews: 143,
    badge: "Sacred",
    description: "Authentic 5 Mukhi Rudraksha mala from Nepal, energized with Vedic mantras.",
    benefits: ["Enhances meditation", "Reduces stress", "Spiritual protection", "Sacred blessing"],
    spiritualMeaning: "Rudraksha beads are the tears of Lord Shiva, carrying divine energy."
  },
  {
    id: "black-tourmaline",
    name: "Black Tourmaline Shield",
    subtitle: "Ultimate Protection Stone",
    price: 48,
    mrp: 85,
    currency: "₹",
    category: "Crystals",
    image: "/products/tourmaline",
    rating: 4.8,
    reviews: 203,
    description: "Raw black tourmaline, nature's most powerful protection stone.",
    benefits: ["EMF protection", "Grounds energy", "Shields negativity", "Promotes security"],
    spiritualMeaning: "Black Tourmaline forms an energetic boundary against negative influences."
  },
  {
    id: "citrine-cluster",
    name: "Citrine Abundance Cluster",
    subtitle: "Merchant's Stone",
    price: 78,
    mrp: 135,
    currency: "₹",
    category: "Crystals",
    image: "/products/citrine",
    rating: 4.7,
    reviews: 118,
    badge: "New",
    description: "Natural citrine cluster radiating warm golden energy for prosperity.",
    benefits: ["Attracts abundance", "Boosts creativity", "Energizes motivation", "Manifests success"],
    spiritualMeaning: "Citrine carries the power of the sun, filling life with warmth and abundance."
  },
];

export const categories = ["All", "Crystals", "Bracelets", "Malas", "Pendants", "Rudraksha", "Feng Shui", "Evil Eye", "Healing Tools", "Aroma Oils", "Candles", "Jewelry"];
