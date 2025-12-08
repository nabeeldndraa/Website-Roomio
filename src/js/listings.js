// ==================== DATABASE FETCH ====================
let allListings = [];

async function fetchListingsFromDB(filters = {}) {
  try {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.location) params.append('location', filters.location);
    if (filters.priceMin) params.append('priceMin', filters.priceMin);
    if (filters.priceMax) params.append('priceMax', filters.priceMax);
    
    const response = await fetch(`api/get_listings.php?${params.toString()}`);
    const result = await response.json();
    
    // ✅ Handle response - bisa array langsung atau object dengan success
    if (Array.isArray(result)) {
      allListings = result;
      return allListings;
    } else if (result.success) {
      allListings = result.data;
      return allListings;
    } else {
      console.error('Error fetching listings:', result.error);
      allListings = getMockListings();
      return allListings;
    }
  } catch (error) {
    console.error('Network error:', error);
    allListings = getMockListings();
    return allListings;
  }
}

// ==================== MOCK DATA (FALLBACK) ====================
function getMockListings() {
  return [
    {
      id: "1",
      title: "Kost Putri Bougenville 51",
      type: "Kos Putri",
      location: "Tegalgede, Jember",
      price: 500000,
      rating: 4.4,
      reviews: 27,
      image: "assets/Kosan4.jpg",
      facilities: ["Wifi", "AC", "Kamar Mandi Dalam"],
      badges: ["Student-Friendly", "Verified"],
      description: "Kos nyaman dan strategis dekat kampus POLIJE dan UNEJ dengan fasilitas lengkap",
      rooms: 20,
      available: 1,
      address: "Lingkungan Krajan Timur, Tegalgede",
      rules: ["Dilarang merokok", "Tamu maksimal jam 23.00"],
      nearbyPlaces: ["POLIJE - 1,2km", "UNEJ - 800m", "Alfamart - 350m"],
    },
    {
      id: "2",
      title: "Kontrakan Premium 2 Kamar",
      type: "Kontrakan",
      location: "Sumbersari, Jember",
      price: 2500000,
      rating: 4.9,
      reviews: 18,
      image: "https://images.unsplash.com/photo-1613575831056-0acd5da8f085?w=800",
      facilities: ["Wifi", "Parkir", "Dapur"],
      badges: ["Inspected", "Featured"],
      description: "Kontrakan premium dengan 2 kamar tidur, cocok untuk keluarga kecil",
      rooms: 2,
      available: 1,
      address: "Jl. Sumatra No. 45, Sumbersari",
      rules: ["Keluarga only", "No pesta", "Bayar tepat waktu"],
      nearbyPlaces: ["Supermarket - 300m", "Sekolah - 1km", "Masjid - 200m"],
    },
    {
      id: "3",
      title: "Kos Eksklusif untuk Pekerja",
      type: "Kos Putra",
      location: "Patrang, Jember",
      price: 1200000,
      rating: 4.7,
      reviews: 32,
      image: "https://images.unsplash.com/photo-1564273795917-fe399b763988?w=800",
      facilities: ["Wifi", "AC", "Laundry"],
      badges: ["Verified"],
      description: "Kos eksklusif dengan fasilitas premium untuk pekerja profesional",
      rooms: 15,
      available: 5,
      address: "Jl. Jawa No. 78, Patrang",
      rules: ["Profesional only", "No noise after 22.00", "Keep clean"],
      nearbyPlaces: ["Kantor Pusat - 1km", "Mall - 2km", "Gym - 500m"],
    },
  ];
}

// ==================== MAIN FUNCTIONS ====================
// ✅ UPDATE: getFeaturedListings sekarang async dan sort by rating
async function getFeaturedListings() {
  // Load data dari database jika belum ada
  if (allListings.length === 0) {
    await fetchListingsFromDB();
  }
  
  // Return top 6 dengan rating tertinggi
  if (allListings.length > 0) {
    // Sort by rating DESC, reviews DESC
    const sorted = [...allListings].sort((a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      return b.reviews - a.reviews;
    });
    return sorted.slice(0, 6);
  }
  
  return getMockListings().slice(0, 6);
}

async function getListingById(id) {
  // Try to get from database first
  try {
    const response = await fetch(`api/get_listing_detail.php?id=${id}`);
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    }
  } catch (error) {
    console.error('Error fetching listing detail:', error);
  }
  
  // Fallback to mock data
  const mockListings = getMockListings();
  return mockListings.find((l) => l.id === id);
}

function searchListings(query, category, location, priceRange) {
  let listings = allListings.length > 0 ? [...allListings] : getMockListings();

  // Search filter
  if (query) {
    query = query.toLowerCase();
    listings = listings.filter(
      (l) =>
        l.title.toLowerCase().includes(query) ||
        l.location.toLowerCase().includes(query) ||
        (l.description && l.description.toLowerCase().includes(query)) ||
        (l.address && l.address.toLowerCase().includes(query))
    );
  }

  // Category filter
  if (category) {
    listings = listings.filter((l) => {
      if (category === "kos-mahasiswa") return l.badges && l.badges.includes("Student-Friendly");
      if (category === "kos-profesional") return l.type.includes("Kos") && (!l.badges || !l.badges.includes("Student-Friendly"));
      if (category === "kontrakan") return l.type === "Kontrakan";
      
      // For specific kos types
      const typeMap = {
        'kos-putri': 'putri',
        'kos-putra': 'putra',
        'kos-campur': 'campur',
        'kos-bebas': 'bebas'
      };
      const searchType = typeMap[category];
      if (searchType) {
        return l.type.toLowerCase().includes(searchType);
      }
      
      return true;
    });
  }

  // Location filter
  if (location) {
    location = location.toLowerCase();
    listings = listings.filter((l) => l.location.toLowerCase().includes(location));
  }

  // Price range filter
  if (priceRange) {
    const [min, max] = priceRange.split("-").map(Number);
    listings = listings.filter((l) => l.price >= min && l.price <= max);
  }

  // Facility filters
  const facilities = [];
  const acCheck = document.getElementById('acCheck');
  const kipasCheck = document.getElementById('kipasCheck');
  const kmDalamCheck = document.getElementById('kmDalamCheck');
  const kmLuarCheck = document.getElementById('kmLuarCheck');
  
  if (acCheck && acCheck.checked) facilities.push('AC');
  if (kipasCheck && kipasCheck.checked) facilities.push('Kipas Angin');
  if (kmDalamCheck && kmDalamCheck.checked) facilities.push('Kamar Mandi Dalam');
  if (kmLuarCheck && kmLuarCheck.checked) facilities.push('Kamar Mandi Luar');
  
  if (facilities.length > 0) {
    listings = listings.filter(listing => 
      facilities.every(facility => 
        listing.facilities && listing.facilities.some(f => 
          f.toLowerCase().includes(facility.toLowerCase())
        )
      )
    );
  }

  return listings;
}

// ==================== FAVORITES MANAGEMENT ====================
function getFavorites() {
  const favStr = localStorage.getItem("favorites");
  return favStr ? JSON.parse(favStr) : [];
}

function addToFavorites(listingId) {
  const favorites = getFavorites();
  if (!favorites.includes(listingId)) {
    favorites.push(listingId);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
}

function removeFromFavorites(listingId) {
  let favorites = getFavorites();
  favorites = favorites.filter((id) => id !== listingId);
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function isFavorite(listingId) {
  const favorites = getFavorites();
  return favorites.includes(listingId);
}

// ==================== BOOKINGS MANAGEMENT ====================
function getBookings() {
  const bookingsStr = localStorage.getItem("bookings");
  return bookingsStr ? JSON.parse(bookingsStr) : [];
}

function addBooking(listing, checkIn, duration) {
  const bookings = getBookings();
  const booking = {
    id: Date.now().toString(),
    listingId: listing.id,
    listing: listing,
    checkIn: checkIn,
    duration: duration,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  bookings.push(booking);
  localStorage.setItem("bookings", JSON.stringify(bookings));
  return booking;
}

function updateBookingStatus(bookingId, status) {
  let bookings = getBookings();
  const index = bookings.findIndex(b => b.id === bookingId);
  if (index !== -1) {
    bookings[index].status = status;
    localStorage.setItem('bookings', JSON.stringify(bookings));
    return bookings[index];
  }
  return null;
}

function deleteBooking(bookingId) {
  let bookings = getBookings();
  bookings = bookings.filter(b => b.id !== bookingId);
  localStorage.setItem('bookings', JSON.stringify(bookings));
}

// ==================== HOST LISTINGS MANAGEMENT ====================
function getHostListings() {
  const listingsStr = localStorage.getItem("hostListings");
  return listingsStr ? JSON.parse(listingsStr) : [];
}

function addHostListing(listing) {
  const listings = getHostListings();
  listing.id = Date.now().toString();
  listing.createdAt = new Date().toISOString();
  listings.push(listing);
  localStorage.setItem("hostListings", JSON.stringify(listings));
  return listing;
}

function updateHostListing(id, updates) {
  let listings = getHostListings();
  const index = listings.findIndex((l) => l.id === id);
  if (index !== -1) {
    listings[index] = { ...listings[index], ...updates };
    localStorage.setItem("hostListings", JSON.stringify(listings));
    return listings[index];
  }
  return null;
}

function deleteHostListing(id) {
  let listings = getHostListings();
  listings = listings.filter((l) => l.id !== id);
  localStorage.setItem("hostListings", JSON.stringify(listings));
}

// ==================== INITIALIZATION ====================
window.addEventListener('DOMContentLoaded', () => {
  fetchListingsFromDB();
});