import { useState } from 'react';
import { MapPin, Star, SlidersHorizontal, Grid, Map, Heart, Wifi, Car, Wind, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './card/ImageWithFallback';
import Footer from './Footer';

interface SearchResultsProps {
  searchParams: any;
  onViewListing: (listingId: string) => void;
}

const mockListings = [
  {
    id: '1',
    title: 'Kos Nyaman Dekat Kampus UNEJ',
    type: 'Kos Putri',
    location: 'Tegalboto, Jember',
    price: 850000,
    rating: 4.8,
    reviews: 24,
    image: 'https:
    facilities: ['Wifi', 'AC', 'Kamar Mandi Dalam', 'Laundry'],
    badges: ['Student-Friendly', 'Verified'],
    available: 3,
    distance: '0.5 km dari UNEJ'
  },
  {
    id: '2',
    title: 'Kontrakan Premium 2 Kamar',
    type: 'Kontrakan',
    location: 'Sumbersari, Jember',
    price: 2500000,
    rating: 4.9,
    reviews: 18,
    image: 'https:
    facilities: ['Wifi', 'Parkir', 'Dapur', 'AC'],
    badges: ['Inspected', 'Featured'],
    available: 1,
    distance: '1.2 km dari Alun-Alun'
  },
  {
    id: '3',
    title: 'Kos Eksklusif untuk Pekerja',
    type: 'Kos Putra',
    location: 'Patrang, Jember',
    price: 1200000,
    rating: 4.7,
    reviews: 32,
    image: 'https:
    facilities: ['Wifi', 'AC', 'Laundry', 'Keamanan 24 jam'],
    badges: ['Verified'],
    available: 5,
    distance: '2.5 km dari Lippo Plaza'
  },
  {
    id: '4',
    title: 'Kos Ekonomis Dekat Pasar',
    type: 'Kos Campur',
    location: 'Kaliwates, Jember',
    price: 650000,
    rating: 4.5,
    reviews: 15,
    image: 'https:
    facilities: ['Wifi', 'Kamar Mandi Luar'],
    badges: ['Verified'],
    available: 7,
    distance: '0.3 km dari Pasar Tanjung'
  },
  {
    id: '5',
    title: 'Kontrakan Keluarga Luas',
    type: 'Kontrakan',
    location: 'Sumbersari, Jember',
    price: 3500000,
    rating: 4.8,
    reviews: 12,
    image: 'https:
    facilities: ['Wifi', 'Parkir', 'Dapur', 'Taman'],
    badges: ['Featured'],
    available: 2,
    distance: '1.8 km dari UNEJ'
  },
  {
    id: '6',
    title: 'Kos Modern Full Furnished',
    type: 'Kos Putri',
    location: 'Tegalboto, Jember',
    price: 1500000,
    rating: 4.9,
    reviews: 28,
    image: 'https:
    facilities: ['Wifi', 'AC', 'Kamar Mandi Dalam', 'Smart TV'],
    badges: ['Inspected', 'Student-Friendly'],
    available: 2,
    distance: '0.8 km dari UNEJ'
  }
];

export default function SearchResults({ searchParams, onViewListing }: SearchResultsProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [priceRange, setPriceRange] = useState([500000, 5000000]);
  const [sortBy, setSortBy] = useState('recommended');
  const [favorites, setFavorites] = useState<string[]>([]);
  

  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);

  const toggleFavorite = (listingId: string) => {
    setFavorites(prev => 
      prev.includes(listingId) 
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId]
    );
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <Label className="mb-3 block">Range Harga</Label>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={500000}
          max={5000000}
          step={100000}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>Rp {priceRange[0].toLocaleString('id-ID')}</span>
          <span>Rp {priceRange[1].toLocaleString('id-ID')}</span>
        </div>
      </div>

      {/* Property Type */}
      <div>
        <Label className="mb-3 block">Tipe Properti</Label>
        <div className="space-y-2">
          {['Kos Putra', 'Kos Putri', 'Kos Campur', 'Kontrakan'].map((type) => (
            <div key={type} className="flex items-center">
              <Checkbox
                id={type}
                checked={selectedType.includes(type)}
                onCheckedChange={(checked) => {
                  setSelectedType(prev =>
                    checked
                      ? [...prev, type]
                      : prev.filter(t => t !== type)
                  );
                }}
              />
              <Label htmlFor={type} className="ml-2 cursor-pointer">
                {type}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Facilities */}
      <div>
        <Label className="mb-3 block">Fasilitas</Label>
        <div className="space-y-2">
          {['Wifi', 'AC', 'Kamar Mandi Dalam', 'Parkir', 'Laundry', 'Dapur'].map((facility) => (
            <div key={facility} className="flex items-center">
              <Checkbox
                id={facility}
                checked={selectedFacilities.includes(facility)}
                onCheckedChange={(checked) => {
                  setSelectedFacilities(prev =>
                    checked
                      ? [...prev, facility]
                      : prev.filter(f => f !== facility)
                  );
                }}
              />
              <Label htmlFor={facility} className="ml-2 cursor-pointer">
                {facility}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Special Features */}
      <div>
        <Label className="mb-3 block">Fitur Khusus</Label>
        <div className="space-y-2">
          <div className="flex items-center">
            <Checkbox id="verified" />
            <Label htmlFor="verified" className="ml-2 cursor-pointer">
              Hanya Terverifikasi
            </Label>
          </div>
          <div className="flex items-center">
            <Checkbox id="student-friendly" />
            <Label htmlFor="student-friendly" className="ml-2 cursor-pointer">
              Student-Friendly
            </Label>
          </div>
          <div className="flex items-center">
            <Checkbox id="inspected" />
            <Label htmlFor="inspected" className="ml-2 cursor-pointer">
              Inspected
            </Label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 lg:top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="mb-1">Hasil Pencarian</h2>
              <p className="text-gray-600">Ditemukan {mockListings.length} properti di Jember</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Rekomendasi</SelectItem>
                  <SelectItem value="price-low">Harga Terendah</SelectItem>
                  <SelectItem value="price-high">Harga Tertinggi</SelectItem>
                  <SelectItem value="rating">Rating Tertinggi</SelectItem>
                  <SelectItem value="newest">Terbaru</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="hidden lg:flex border border-gray-200 rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                >
                  <Map className="w-4 h-4" />
                </Button>
              </div>

              {/* Mobile Filter */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filter Pencarian</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3>Filter</h3>
                  <Button variant="ghost" size="sm">Reset</Button>
                </div>
                <FilterContent />
              </CardContent>
            </Card>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {mockListings.map((listing) => (
                  <Card
                    key={listing.id}
                    className="overflow-hidden cursor-pointer hover:shadow-xl transition-shadow group"
                  >
                    <div 
                      className="relative h-48"
                      onClick={() => onViewListing(listing.id)}
                    >
                      <ImageWithFallback
                        src={listing.image}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 flex gap-2">
                        <Badge className="bg-white text-gray-900">{listing.type}</Badge>
                      </div>
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                        {listing.badges.map((badge) => (
                          <Badge key={badge} variant="secondary" className="text-xs">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute bottom-3 right-3 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(listing.id);
                        }}
                      >
                        <Heart
                          className={`w-4 h-4 ${favorites.includes(listing.id) ? 'fill-red-500 text-red-500' : ''}`}
                        />
                      </Button>
                    </div>

                    <CardContent className="p-4" onClick={() => onViewListing(listing.id)}>
                      <h3 className="mb-2">{listing.title}</h3>
                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        {listing.location}
                      </div>
                      <div className="text-xs text-gray-500 mb-3">{listing.distance}</div>

                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        {listing.facilities.slice(0, 3).map((facility, idx) => (
                          <span key={idx} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            {facility}
                          </span>
                        ))}
                        {listing.facilities.length > 3 && (
                          <span className="text-xs text-gray-500">+{listing.facilities.length - 3}</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div>
                          <span className="text-blue-600">
                            Rp {listing.price.toLocaleString('id-ID')}
                          </span>
                          <span className="text-gray-500 text-sm">/bulan</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span>{listing.rating}</span>
                          <span className="text-gray-500 text-sm">({listing.reviews})</span>
                        </div>
                      </div>

                      <div className="mt-2 text-sm text-green-600">
                        {listing.available} kamar tersedia
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
                {/* List */}
                <div className="overflow-y-auto space-y-4">
                  {mockListings.map((listing) => (
                    <Card
                      key={listing.id}
                      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => onViewListing(listing.id)}
                    >
                      <div className="flex">
                        <div className="w-40 h-40 flex-shrink-0">
                          <ImageWithFallback
                            src={listing.image}
                            alt={listing.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="flex-1 p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-base">{listing.title}</h3>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(listing.id);
                              }}
                            >
                              <Heart
                                className={`w-4 h-4 ${favorites.includes(listing.id) ? 'fill-red-500 text-red-500' : ''}`}
                              />
                            </Button>
                          </div>
                          <div className="flex items-center text-gray-600 text-sm mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            {listing.location}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-blue-600">
                              Rp {listing.price.toLocaleString('id-ID')}
                            </span>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span className="text-sm">{listing.rating}</span>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Map */}
                <div className="hidden lg:block sticky top-24 h-full">
                  <div className="bg-gray-200 rounded-lg h-full flex items-center justify-center">
                    <div className="text-center">
                      <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Google Maps View</p>
                      <p className="text-gray-500 text-sm">Menampilkan lokasi listing</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}