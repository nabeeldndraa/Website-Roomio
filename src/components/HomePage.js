import { useState } from 'react';
import { Search, MapPin, Filter, Star, Wifi, Car, Tv, Wind, Users, Building, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './card/ImageWithFallback';
import Footer from './Footer';

interface HomePageProps {
  onSearch: (params: any) => void;
  onViewListing: (listingId: string) => void;
}

const categories = [
  { id: 'kos-mahasiswa', name: 'Kos Mahasiswa', icon: Users, color: 'bg-blue-100 text-blue-700' },
  { id: 'kos-profesional', name: 'Kos Profesional', icon: Building, color: 'bg-purple-100 text-purple-700' },
  { id: 'kontrakan', name: 'Kontrakan', icon: Building, color: 'bg-green-100 text-green-700' },
];

const featuredListings = [
  {
    id: '1',
    title: 'Kos Nyaman Dekat Kampus UNEJ',
    type: 'Kos Putri',
    location: 'Tegalboto, Jember',
    price: 850000,
    rating: 4.8,
    reviews: 24,
    image: 'https://images.unsplash.com/photo-1616418928117-4e6d19be2df1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwYmVkcm9vbSUyMGludGVyaW9yfGVufDF8fHx8MTc2MTU5MTE2NXww&ixlib=rb-4.1.0&q=80&w=1080',
    facilities: ['Wifi', 'AC', 'Kamar Mandi Dalam'],
    badges: ['Student-Friendly', 'Verified']
  },
  {
    id: '2',
    title: 'Kontrakan Premium 2 Kamar',
    type: 'Kontrakan',
    location: 'Sumbersari, Jember',
    price: 2500000,
    rating: 4.9,
    reviews: 18,
    image: 'https://images.unsplash.com/photo-1613575831056-0acd5da8f085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc2MTY1NDI1OXww&ixlib=rb-4.1.0&q=80&w=1080',
    facilities: ['Wifi', 'Parkir', 'Dapur'],
    badges: ['Inspected', 'Featured']
  },
  {
    id: '3',
    title: 'Kos Eksklusif untuk Pekerja',
    type: 'Kos Putra',
    location: 'Patrang, Jember',
    price: 1200000,
    rating: 4.7,
    reviews: 32,
    image: 'https://images.unsplash.com/photo-1564273795917-fe399b763988?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwZG9ybWl0b3J5JTIwcm9vbXxlbnwxfHx8fDE3NjE2MzA2NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    facilities: ['Wifi', 'AC', 'Laundry'],
    badges: ['Verified']
  }
];

export default function HomePage({ onSearch, onViewListing }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const handleSearch = () => {
    onSearch({
      query: searchQuery,
      location: selectedLocation
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-white">Aktivasi Akun & Verifikasi Layanan di Jember</h1>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Cari kos dan kontrakan untuk si jamban dengan harga terjangkau. Kamu akan luluh dengan harga terjangkau dan kualitas terjamin.
            </p>

            {/* Search Box */}
            <Card className="bg-white p-4 lg:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                <div className="lg:col-span-9">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="Cari lokasi, area, atau nama kos..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                </div>
                <div className="lg:col-span-3">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={handleSearch}
                  >
                    Cari
                  </Button>
                </div>
              </div>
            </Card>

            {/* Statistics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 pt-8">
              <div className="text-center">
                <Building className="w-10 h-10 mx-auto mb-2 text-blue-200" />
                <div className="text-white text-2xl">1.000+</div>
                <div className="text-blue-200 text-sm">Pengguna</div>
              </div>
              <div className="text-center">
                <Users className="w-10 h-10 mx-auto mb-2 text-blue-200" />
                <div className="text-white text-2xl">540+</div>
                <div className="text-blue-200 text-sm">orang</div>
              </div>
              <div className="text-center">
                <Star className="w-10 h-10 mx-auto mb-2 text-blue-200" />
                <div className="text-white text-2xl">100%</div>
                <div className="text-blue-200 text-sm">Verified</div>
              </div>
              <div className="text-center">
                <Building className="w-10 h-10 mx-auto mb-2 text-blue-200" />
                <div className="text-white text-2xl">Harga</div>
                <div className="text-blue-200 text-sm">Murah</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="mb-2">Segera temukan kos</h2>
            <p className="text-gray-600">Pilih sesuai yang cocok dengan keluargamu</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Card
                  key={category.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500"
                  onClick={() => onSearch({ category: category.id })}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 ${category.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div>{category.name}</div>
                    <div className="text-sm text-gray-500 mt-1">1 listing</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Map Section - Jember Focus */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-8">Jelajahi Area Jember</h2>
          <div className="max-w-5xl mx-auto">
            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center relative overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1694876899669-9f76db41bd9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwcmVzaWRlbnRpYWwlMjBhcmVhfGVufDF8fHx8MTc2MTY2MDIzNHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Jember Map"
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm px-6 py-4 rounded-lg text-center">
                  <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                  <p className="text-gray-700">Peta Interaktif Google Maps</p>
                  <p className="text-gray-500 text-sm">Akan terintegrasi dengan fitur pencarian</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-blue-600">POPULER</Badge>
                <h2>Rekomendasi Pilihan</h2>
              </div>
              <p className="text-gray-600">Listing favorit dari dengan rating tertinggi</p>
            </div>
            <Button variant="outline" onClick={() => onSearch({})}>
              Lihat Semua →
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((listing) => (
              <Card
                key={listing.id}
                className="overflow-hidden cursor-pointer hover:shadow-xl transition-shadow group"
                onClick={() => onViewListing(listing.id)}
              >
                <div className="relative h-48">
                  <ImageWithFallback
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 left-3 bg-blue-600">Di Sewa</Badge>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-3 right-3 rounded-full bg-white/90 hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert('Added to favorites');
                    }}
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Badge className="absolute bottom-3 right-3 bg-black/70 text-white">
                    {listing.type === 'Kos Putri' ? '3 kamar' : '5 kamar'}
                  </Badge>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">{listing.type}</Badge>
                    <span className="text-xs text-gray-500">• {listing.location.split(',')[0]}</span>
                  </div>
                  
                  <h3 className="mb-3 line-clamp-1">{listing.title}</h3>

                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {listing.facilities.slice(0, 4).map((facility, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {facility}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    {listing.location}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span>{listing.rating}</span>
                      <span className="text-gray-500 text-sm">({listing.reviews} ulasan)</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="text-blue-600">
                      Rp {listing.price.toLocaleString('id-ID')}
                    </div>
                    <div className="text-xs text-gray-500">per bulan</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-12">Mengapa Memilih Roomio?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="mb-2">Hyperlocal Jember</h3>
              <p className="text-gray-600">Fokus khusus pada area Jember dengan informasi neighborhood yang detail</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="mb-2">Terverifikasi</h3>
              <p className="text-gray-600">Semua listing diverifikasi dengan badge inspeksi dan review asli</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="mb-2">Komunitas</h3>
              <p className="text-gray-600">Fitur roommate matching dan local services marketplace</p>
            </div>
          </div>
        </div>
      </section>

      {/* Listing Terbaru */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2>Listing Terbaru</h2>
            <Button variant="outline" onClick={() => onSearch({})}>
              Lihat Semua →
            </Button>
          </div>
          <p className="text-gray-600 mb-6">Segera listing yang baru saja diumumkan</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((listing) => (
              <Card
                key={`new-${listing.id}`}
                className="overflow-hidden cursor-pointer hover:shadow-xl transition-shadow group"
                onClick={() => onViewListing(listing.id)}
              >
                <div className="relative h-48">
                  <ImageWithFallback
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-3 left-3 bg-green-600">Di Jual</Badge>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-3 right-3 rounded-full bg-white/90"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Badge className="absolute bottom-3 right-3 bg-black/70 text-white">
                    3 kamar
                  </Badge>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">{listing.type}</Badge>
                    <span className="text-xs text-gray-500">• {listing.location.split(',')[0]}</span>
                  </div>
                  
                  <h3 className="mb-3 line-clamp-1">{listing.title}</h3>

                  <div className="flex items-center text-sm mb-2">
                    <Building className="w-4 h-4 mr-1" />
                    <span>2 Kamar Mandi 2K</span>
                  </div>

                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {listing.facilities.map((facility, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {facility}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-xs">Linger Friendly</Badge>
                    <Badge variant="outline" className="text-xs">Common Worth</Badge>
                  </div>

                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span>{listing.rating}</span>
                    <span className="text-gray-500 text-sm">({listing.reviews} ulasan)</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-blue-600">
                      Rp {listing.price.toLocaleString('id-ID')}
                    </div>
                    <div className="text-gray-400 line-through text-sm">
                      Rp {(listing.price * 1.2).toLocaleString('id-ID')}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">per bulan</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA with Gradient */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-white mb-4">Punya Properti untuk Disewakan?</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Mengantarkan dengan properti Anda untuk lebih mudah menghubungkan dengan calon penyewa dengan listing gratis
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => onSearch({})}
            >
              Pasang Listing Gratis
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              onClick={() => onSearch({})}
            >
              Pelajari Lebih Lanjut
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
