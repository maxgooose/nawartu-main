import React, { useState, useEffect, useContext } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/input";
import logo from "../logo.png";
import {
  MapPin,
  Search as SearchIcon,
  Heart,
  Globe,
  Menu as MenuIcon,
  PlusCircle,
  Building2,
  Home,
  Trees,
  ShoppingBag,
  Landmark,
} from "lucide-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import apiRequest from "../services/api";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";
import CreateListingModal from "../components/CreateListingModal";

const PRIMARY_GREEN = "#012F01";
const ACCENT_GREEN = "#025220";
const SOFT_GREEN = "#E5F2E8";

const categories = [
  { name: "Al-Malki", icon: Building2 },
  { name: "Mazzeh", icon: Building2 },
  { name: "Mezzeh Villas", icon: Home },
  { name: "Abu Rummaneh", icon: Trees },
  { name: "Shaalan", icon: ShoppingBag },
  { name: "Bab Touma", icon: Landmark },
  { name: "Al-Qasaa", icon: Trees },
  { name: "Al-Hamidiyah", icon: Landmark },
  { name: "Old City", icon: Landmark },
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user, logout, loading: authLoading } = useContext(AuthContext);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isCreateListingModalOpen, setCreateListingModalOpen] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const data = await apiRequest(`/api/properties?search=${query}`);
        setListings(data.properties || []);
      } catch (err) {
        console.error("Failed to load listings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [query]);

  const handleListingCreated = (newListing) => {
    setListings((prev) => [newListing, ...prev]);
  };

  const filtered = listings;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900" style={{ backgroundColor: SOFT_GREEN }}>
      {/* Navigation */}
      <nav className="bg-white sticky top-0 z-30 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Nawartu Logo" className="h-11 w-11" />
            <span className="text-2xl font-extrabold" style={{ color: PRIMARY_GREEN }}>
              Nawartu
            </span>
          </div>
          <div className="flex items-center gap-4">
            {!authLoading && (
              <>
                {user ? (
                  <>
                    <Button onClick={() => setCreateListingModalOpen(true)} className="hidden sm:inline-flex items-center gap-2">
                      <PlusCircle size={16} /> List your place
                    </Button>
                    <Link to="/trips">
                      <Button variant="outline">My Trips</Button>
                    </Link>
                    <Link to="/my-listings">
                      <Button variant="outline">My Listings</Button>
                    </Link>
                    <Button onClick={logout} variant="outline">Logout</Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => setLoginModalOpen(true)}>Log In</Button>
                    <Button onClick={() => setRegisterModalOpen(true)} variant="outline">Sign Up</Button>
                  </>
                )}
              </>
            )}
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Globe className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full border hover:shadow-sm">
              <MenuIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Search Section */}
      <section className="py-12 px-4 text-center" style={{ backgroundColor: PRIMARY_GREEN }}>
        <h1 className="text-4xl font-bold text-white mb-2">Find your next stay in Damascus</h1>
        <p className="text-lg text-gray-200 mb-6">Discover amazing traditional houses, apartments, and villas.</p>
        <div className="w-full max-w-3xl mx-auto flex items-center bg-white rounded-full shadow-lg px-2 py-2 gap-2">
          <SearchIcon className="w-5 h-5 text-gray-400 ml-4" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by neighborhood, e.g., 'Old City'"
            className="flex-1 outline-none text-base border-none focus:ring-0"
          />
          <button className="px-6 h-12 flex items-center justify-center rounded-full text-white font-semibold" style={{ backgroundColor: ACCENT_GREEN }}>
            Search
          </button>
        </div>
      </section>

      {/* Category row */}
      <div className="py-8 bg-white">
        <div className="flex justify-center gap-4 flex-wrap max-w-6xl mx-auto px-4">
          {categories.map((c) => (
            <button
              key={c.name}
              className="flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition"
            >
              <c.icon size={16} />
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Listings */}
      <main className="max-w-7xl mx-auto p-6 space-y-8">
        <h2 className="text-3xl font-bold text-gray-800">Homes in Damascus</h2>
        {loading ? (
          <p>Loading listings...</p>
        ) : listings.length === 0 ? (
          <p>No listings found.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listings.map((home) => (
              <Card key={home._id} className="overflow-hidden bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-300 group">
                <Link to={`/property/${home._id}`} className="block">
                  <div className="relative">
                    <img
                      src={home.images?.[0] || "https://picsum.photos/800/600"}
                      alt={home.title}
                      className="h-56 w-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 rounded-full p-1.5 cursor-pointer">
                      <Heart className="w-4 h-4 text-gray-600 group-hover:text-red-500 transition-colors" />
                    </div>
                  </div>
                </Link>
                <CardContent className="p-4 space-y-1">
                  <h3 className="font-semibold text-lg truncate">{home.title}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" /> {home.location?.neighborhood || 'Damascus'}
                  </div>
                  <p className="text-sm text-gray-500 pt-1">
                    {home.capacity?.guests || 2} guests · {home.capacity?.bedrooms || 1} bedroom
                  </p>
                  <p className="pt-2">
                    <span className="font-bold text-lg" style={{ color: PRIMARY_GREEN }}>
                      ${home.price}
                    </span>
                    <span className="text-gray-500"> / night</span>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSwitchToRegister={() => {
          setLoginModalOpen(false);
          setRegisterModalOpen(true);
        }}
      />
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onSwitchToLogin={() => {
          setRegisterModalOpen(false);
          setLoginModalOpen(true);
        }}
      />
      {user && (
        <CreateListingModal
          isOpen={isCreateListingModalOpen}
          onClose={() => setCreateListingModalOpen(false)}
          onListingCreated={handleListingCreated}
        />
      )}
    </div>
  );
} 