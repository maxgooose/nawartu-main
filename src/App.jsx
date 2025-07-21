import React, { useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/Button";
import { Input } from "./components/ui/input";
import { Calendar } from "./components/ui/calendar";
import logo from "./logo.png"
import {
  MapPin,
  Search as SearchIcon,
  Heart,
  Globe,
  Menu as MenuIcon,
} from "lucide-react";


const PRIMARY_GREEN = "#012F01"; // primary green
const ACCENT_GREEN = "#025220"; // vibrant accent
const SOFT_GREEN = "#E5F2E8"; // gentle background

const categories = [
  { name: "Al‑Malki", emoji: "🏙️" },
  { name: "Mazzeh", emoji: "🌇" },
  { name: "Mezzeh Villas", emoji: "🏡" },
  { name: "Abu Rummaneh", emoji: "🌿" },
  { name: "Shaalan", emoji: "🛍️" },
  { name: "Bab Touma", emoji: "🏛️" },
  { name: "Al‑Qasaa", emoji: "🌳" },
  { name: "Al‑Hamidiyah", emoji: "🕌" },
  { name: "Old City", emoji: "🏚️" },
];

// Change to database
const listings = [
  { id: 1, name: "Ard Dyar Courtyard Home", location: "Old Damascus", price: 55, img: "https://syriascopetravel.com/wp-content/uploads/2024/10/Damascus-hotel.jpg" },
  { id: 2, name: "Damascus Roof Terrace", location: "Bab Touma", price: 65, img: "https://syriascopetravel.com/wp-content/uploads/2024/10/IMG_E1873.jpg" },
  { id: 3, name: "Traditional Mosaic Suite", location: "Al‑Qaymariyya", price: 60, img: "https://syriascopetravel.com/wp-content/uploads/2024/10/FB_IMG_1729252510829.jpg" },
  { id: 4, name: " Loft", location: "Straight Street", price: 70, img: "https://images.unsplash.com/photo-1618221358593-706e36ddab1a?auto=format&fit=crop&w=800&q=60" },
  { id: 5, name: "Courtyard House", location: "Al‑Shaghour", price: 58, img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=60" },
  { id: 6, name: "Damascus Salon", location: "Sarouja", price: 75, img: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=60" },
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const filtered = listings.filter(l => `${l.name} ${l.location}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="min-h-screen text-gray-900" style={{ backgroundColor: SOFT_GREEN }}>
      <nav className="bg-white sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
          <img src={logo} alt="Nawartu Logo" className="h-11 w-11" />
          <span className="text-2xl font-extrabold" style={{ color: PRIMARY_GREEN }}>
              Nawartu
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Button className="hidden sm:inline-block bg-white text-gray-700 border-gray-200 hover:bg-gray-50">
              List your place
            </Button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Globe className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full border hover:shadow-sm">
              <MenuIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Search bar  */}
      <section className="flex justify-center py-6" style={{ backgroundColor: PRIMARY_GREEN }}>
        <div className="w-full max-w-3xl flex items-center bg-white rounded-full shadow-lg px-6 py-4 gap-3">
          <SearchIcon className="w-5 h-5 text-gray-500" />
          <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search destinations, homes, experiences..." className="flex-1 outline-none text-sm" />
          <button
            className="w-12 h-12 flex items-center justify-center rounded-full text-white"
            style={{ backgroundColor: ACCENT_GREEN }} >
           <SearchIcon className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Category row */}
      <div className="py-6 bg-white shadow-sm">
        <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
          {categories.map(c => (
            <button key={c.name} className="flex flex-col items-center gap-1 text-sm text-gray-700 hover:text-[var(--accent)] transition" style={{ ['--accent']: ACCENT_GREEN }}>
              <span className="text-xl">{c.emoji}</span>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Listings  */}
      <main className="max-w-6xl mx-auto p-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(home => (
          <Card key={home.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-white rounded-xl">
            <div className="relative group">
              <img src={home.img} alt={home.name} className="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <button className="absolute top-3 right-3 bg-white/80 rounded-full p-1 hover:bg-[var(--accent)]" style={{ ['--accent']: ACCENT_GREEN }}>
                <Heart className="w-4 h-4 text-[var(--accent)]" />
              </button>
            </div>
            <CardContent>
              <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                <MapPin className="w-4 h-4" /> {home.location}
              </div>
              <h2 className="font-semibold text-lg leading-tight mb-1">{home.name}</h2>
              <p className="text-sm text-gray-500 mb-2">2 guests · 1 bedroom · Wi‑Fi</p>
              <p>
                <span className="font-bold text-[var(--accent)]" style={{ ['--accent']: PRIMARY_GREEN }}>${home.price}</span>
                <span className="text-gray-500"> / night</span>
              </p>
              <Button className="mt-3 w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)]" style={{ ['--accent']: ACCENT_GREEN, ['--accent-hover']: PRIMARY_GREEN }}>
                Book now
              </Button>
            </CardContent>
          </Card>
        ))}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-10 text-sm" style={{ backgroundColor: "#F4FCF9" }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6 text-gray-700">
          <div>
            <h3 className="font-semibold mb-3">Support</h3>
            <ul className="space-y-2">
              <li>Help Centre</li>
              <li>Safety information</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Hosting</h3>
            <ul className="space-y-2">
              <li>Nawartu your home</li>
              <li>Host protection</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Company</h3>
            <ul className="space-y-2">
              <li>About</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-500">© {new Date().getFullYear()} Nawartu. All rights reserved.</div>
      </footer>
    </div>
  );
}
