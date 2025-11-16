// Mock listings data
function getFeaturedListings() {
    return [
        {
            id: '1',
            title: 'Kos Nyaman Dekat Kampus POLIJE',
            type: 'Kos Putri',
            location: 'Tegalboto, Jember',
            price: 850000,
            rating: 4.8,
            reviews: 24,
            image: 'assets/Kosan4.jpg',
            facilities: ['Wifi', 'AC', 'Kamar Mandi Dalam'],
            badges: ['Student-Friendly', 'Verified'],
            description: 'Kos nyaman dan strategis dekat kampus UNEJ dengan fasilitas lengkap',
            rooms: 10,
            available: 3,
            address: 'Jl. Kalimantan No. 123, Tegalboto',
            rules: ['No smoking', 'No pets', 'Tamu maksimal jam 21.00'],
            nearbyPlaces: ['UNEJ - 500m', 'Indomaret - 100m', 'Rumah Sakit - 2km']
        },
        {
            id: '2',
            title: 'Kontrakan Premium 2 Kamar',
            type: 'Kontrakan',
            location: 'Sumbersari, Jember',
            price: 2500000,
            rating: 4.9,
            reviews: 18,
            image: 'https://images.unsplash.com/photo-1613575831056-0acd5da8f085?w=800',
            facilities: ['Wifi', 'Parkir', 'Dapur'],
            badges: ['Inspected', 'Featured'],
            description: 'Kontrakan premium dengan 2 kamar tidur, cocok untuk keluarga kecil',
            rooms: 2,
            available: 1,
            address: 'Jl. Sumatra No. 45, Sumbersari',
            rules: ['Keluarga only', 'No pesta', 'Bayar tepat waktu'],
            nearbyPlaces: ['Supermarket - 300m', 'Sekolah - 1km', 'Masjid - 200m']
        },
        {
            id: '3',
            title: 'Kos Eksklusif untuk Pekerja',
            type: 'Kos Putra',
            location: 'Patrang, Jember',
            price: 1200000,
            rating: 4.7,
            reviews: 32,
            image: 'https://images.unsplash.com/photo-1564273795917-fe399b763988?w=800',
            facilities: ['Wifi', 'AC', 'Laundry'],
            badges: ['Verified'],
            description: 'Kos eksklusif dengan fasilitas premium untuk pekerja profesional',
            rooms: 15,
            available: 5,
            address: 'Jl. Jawa No. 78, Patrang',
            rules: ['Profesional only', 'No noise after 22.00', 'Keep clean'],
            nearbyPlaces: ['Kantor Pusat - 1km', 'Mall - 2km', 'Gym - 500m']
        },
        {
            id: '4',
            title: 'Kos Modern Dekat Alun-Alun',
            type: 'Kos Campur',
            location: 'Kaliwates, Jember',
            price: 950000,
            rating: 4.6,
            reviews: 15,
            image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
            facilities: ['Wifi', 'AC', 'Kasur', 'Lemari'],
            badges: ['New', 'Verified'],
            description: 'Kos modern di lokasi strategis dekat pusat kota',
            rooms: 12,
            available: 4,
            address: 'Jl. Gajah Mada No. 12, Kaliwates',
            rules: ['No smoking in room', 'Guest max 21.00', 'Monthly payment'],
            nearbyPlaces: ['Alun-alun - 300m', 'Bioskop - 500m', 'Foodcourt - 200m']
        },
        {
            id: '5',
            title: 'Kontrakan Minimalis 1 Kamar',
            type: 'Kontrakan',
            location: 'Mangli, Jember',
            price: 1500000,
            rating: 4.5,
            reviews: 12,
            image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
            facilities: ['Wifi', 'Dapur', 'Parkir Motor'],
            badges: ['Budget-Friendly'],
            description: 'Kontrakan minimalis cocok untuk pasangan muda atau single',
            rooms: 1,
            available: 1,
            address: 'Jl. Mawar No. 67, Mangli',
            rules: ['Max 2 orang', 'No pets', 'Maintain cleanliness'],
            nearbyPlaces: ['Pasar - 400m', 'Puskesmas - 600m', 'ATM - 150m']
        },
        {
            id: '6',
            title: 'Kos Nyaman untuk Mahasiswi',
            type: 'Kos Putri',
            location: 'Jember Lor, Jember',
            price: 750000,
            rating: 4.8,
            reviews: 28,
            image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800',
            facilities: ['Wifi', 'Kasur', 'Meja Belajar'],
            badges: ['Student-Friendly', 'Safe'],
            description: 'Kos khusus putri dengan keamanan 24 jam',
            rooms: 8,
            available: 2,
            address: 'Jl. Brawijaya No. 34, Jember Lor',
            rules: ['No male visitors', 'Curfew 22.00', 'No smoking'],
            nearbyPlaces: ['Kampus - 800m', 'Minimarket - 50m', 'Warung Makan - 100m']
        }
    ];
}

function getListingById(id) {
    const listings = getFeaturedListings();
    return listings.find(l => l.id === id);
}

function searchListings(query, category, location, priceRange) {
    let listings = getFeaturedListings();
    
    if (query) {
        query = query.toLowerCase();
        listings = listings.filter(l => 
            l.title.toLowerCase().includes(query) ||
            l.location.toLowerCase().includes(query) ||
            l.description.toLowerCase().includes(query)
        );
    }
    
    if (category) {
        listings = listings.filter(l => {
            if (category === 'kos-mahasiswa') return l.badges.includes('Student-Friendly');
            if (category === 'kos-profesional') return l.type.includes('Kos') && !l.badges.includes('Student-Friendly');
            if (category === 'kontrakan') return l.type === 'Kontrakan';
            return true;
        });
    }
    
    if (location) {
        location = location.toLowerCase();
        listings = listings.filter(l => l.location.toLowerCase().includes(location));
    }
    
    if (priceRange) {
        const [min, max] = priceRange.split('-').map(Number);
        listings = listings.filter(l => l.price >= min && l.price <= max);
    }
    
    return listings;
}

// Favorites management
function getFavorites() {
    const favStr = localStorage.getItem('favorites');
    return favStr ? JSON.parse(favStr) : [];
}

function addToFavorites(listingId) {
    const favorites = getFavorites();
    if (!favorites.includes(listingId)) {
        favorites.push(listingId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
}

function removeFromFavorites(listingId) {
    let favorites = getFavorites();
    favorites = favorites.filter(id => id !== listingId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function isFavorite(listingId) {
    const favorites = getFavorites();
    return favorites.includes(listingId);
}

// Bookings management
function getBookings() {
    const bookingsStr = localStorage.getItem('bookings');
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
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    return booking;
}

// Host listings management
function getHostListings() {
    const listingsStr = localStorage.getItem('hostListings');
    return listingsStr ? JSON.parse(listingsStr) : [];
}

function addHostListing(listing) {
    const listings = getHostListings();
    listing.id = Date.now().toString();
    listing.createdAt = new Date().toISOString();
    listings.push(listing);
    localStorage.setItem('hostListings', JSON.stringify(listings));
    return listing;
}

function updateHostListing(id, updates) {
    let listings = getHostListings();
    const index = listings.findIndex(l => l.id === id);
    if (index !== -1) {
        listings[index] = { ...listings[index], ...updates };
        localStorage.setItem('hostListings', JSON.stringify(listings));
        return listings[index];
    }
    return null;
}

function deleteHostListing(id) {
    let listings = getHostListings();
    listings = listings.filter(l => l.id !== id);
    localStorage.setItem('hostListings', JSON.stringify(listings));
}
