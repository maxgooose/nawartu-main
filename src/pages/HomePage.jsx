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
import { useTranslation } from "react-i18next";
import BackButton from "../components/ui/BackButton";
import LanguageSwitcher from "../components/ui/LanguageSwitcher";

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
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Import useTranslation hook
  const { t } = useTranslation();

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
                    {user.isHost && (
                      <Link to="/host/dashboard">
                        <Button variant="outline">Host Dashboard</Button>
                      </Link>
                    )}
                    {user.role === 'admin' && (
                      <Link to="/admin">
                        <Button variant="outline" className="bg-red-600 text-white hover:bg-red-700">Admin Panel</Button>
                      </Link>
                    )}
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
            <LanguageSwitcher />
            <button 
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-full border hover:shadow-sm lg:hidden"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
          </div>
                  </div>
        </motion.nav>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden bg-white border-b border-gray-200 shadow-lg"
            >
              <div className="px-6 py-4 space-y-4">
                {user ? (
                  <>
                    <div className="flex flex-col space-y-3">
                      <button 
                        onClick={() => {
                          setCreateListingModalOpen(true);
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                      >
                        <PlusCircle size={16} /> List your place
                      </button>
                      <Link 
                        to="/trips" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                      >
                        My Trips
                      </Link>
                      <Link 
                        to="/my-listings" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                      >
                        My Listings
                      </Link>
                      {user.isHost && (
                        <Link 
                          to="/host/dashboard" 
                          onClick={() => setMobileMenuOpen(false)}
                          className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                          Host Dashboard
                        </Link>
                      )}
                      {user.role === 'admin' && (
                        <Link 
                          to="/admin" 
                          onClick={() => setMobileMenuOpen(false)}
                          className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button 
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-left"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <button 
                      onClick={() => {
                        setLoginModalOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                    >
                      Log In
                    </button>
                    <button 
                      onClick={() => {
                        setRegisterModalOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
                
                {/* Additional Mobile Links */}
                <div className="pt-4 border-t border-gray-200">
                  <Link 
                    to="/contact" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Contact Us
                  </Link>
                  <Link 
                    to="/terms" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Terms & Policies
                  </Link>
                  <Link 
                    to="/privacy" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <div className="px-4 py-2 text-sm text-gray-500">
                    Phone: +963 969 864 741
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      {/* Hero Search Section */}
      <section className="py-12 px-4 text-center" style={{ backgroundColor: PRIMARY_GREEN }}>
        <h1 className="text-4xl font-bold text-white mb-2">{t('homepage.hero.title')}</h1>
        <p className="text-lg text-gray-200 mb-6">{t('homepage.hero.subtitle')}</p>
        <div className="w-full max-w-3xl mx-auto flex items-center bg-white rounded-full shadow-lg px-2 py-2 gap-2">
          <SearchIcon className="w-5 h-5 text-gray-400 ml-4" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('homepage.hero.searchPlaceholder')}
            className="flex-1 outline-none text-base border-none focus:ring-0"
          />
          <button className="px-6 h-12 flex items-center justify-center rounded-full text-white font-semibold" style={{ backgroundColor: ACCENT_GREEN }}>
            {t('homepage.hero.searchButton')}
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <img src={logo} alt="Nawartu Logo" className="h-10 w-10" />
                <span className="text-2xl font-bold text-white">Nawartu</span>
              </div>
              <p className="text-gray-300 mb-4">
                Discover amazing traditional houses, apartments, and villas in Damascus. 
                Your perfect stay awaits in the heart of Syria.
              </p>
              <div className="flex space-x-4 mb-4">
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
                <span className="text-gray-500">|</span>
                <span className="text-gray-300">+963 969 864 741</span>
                <span className="text-gray-500">|</span>
                <span className="text-gray-300">Damascus, Syria</span>
              </div>
              
              {/* Social Media */}
              <div className="flex space-x-4">
                <a 
                  href="https://instagram.com/nawartuofficial" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-pink-400 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  @nawartuofficial
                </a>
                <a 
                  href="https://tiktok.com/@nawartu" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.11V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                  @nawartu
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
                {user && (
                  <>
                    <li><Link to="/trips" className="text-gray-300 hover:text-white transition-colors">My Trips</Link></li>
                    <li><Link to="/my-listings" className="text-gray-300 hover:text-white transition-colors">My Listings</Link></li>
                  </>
                )}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Safety</Link></li>
                <li><Link to="/terms" className="text-gray-300 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Nawartu. All rights reserved. Made with ❤️ in Damascus.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 