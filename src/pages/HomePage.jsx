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
import { PropertyCard } from "../components/ui/AnimatedCard";
import InfiniteScroll from "../components/ui/InfiniteScroll";
import { PropertyCardSkeleton } from "../components/ui/Skeleton";
import { motion, AnimatePresence } from "framer-motion";

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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const { user, logout, loading: authLoading } = useContext(AuthContext);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isCreateListingModalOpen, setCreateListingModalOpen] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setPage(1);
      try {
        const data = await apiRequest(`/api/properties?search=${query}&page=1&limit=12`);
        setListings(data.properties || []);
        setHasMore(data.pagination?.hasNext || false);
      } catch (err) {
        console.error("Failed to load listings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [query]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await apiRequest(`/api/properties?search=${query}&page=${nextPage}&limit=12`);
      setListings(prev => [...prev, ...(data.properties || [])]);
      setHasMore(data.pagination?.hasNext || false);
      setPage(nextPage);
    } catch (err) {
      console.error("Failed to load more listings", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleListingCreated = (newListing) => {
    setListings((prev) => [newListing, ...prev]);
  };

  const renderPropertyCard = (property) => (
    <PropertyCard
      property={property}
      onClick={() => window.location.href = `/property/${property._id}`}
    />
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900" style={{ backgroundColor: SOFT_GREEN }}>
      {/* Navigation */}
      <motion.nav 
        className="bg-white sticky top-0 z-30 border-b border-gray-200"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
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
        </motion.nav>

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
        <motion.h2 
          className="text-3xl font-bold text-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Homes in Damascus
        </motion.h2>
        
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-gray-400 mb-4">
              <SearchIcon size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </motion.div>
        ) : (
          <InfiniteScroll
            items={listings}
            renderItem={renderPropertyCard}
            loadMore={loadMore}
            hasMore={hasMore}
            loading={loadingMore}
          />
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