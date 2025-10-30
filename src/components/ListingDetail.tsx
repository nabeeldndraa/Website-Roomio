import { useState } from 'react';
import { MapPin, Star, Heart, Share2, Wifi, Car, Wind, Tv, Users, Clock, Calendar, MessageSquare, CheckCircle2, X, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ListingDetailProps {
  listingId: string | null;
  currentUser: any;
  onBack: () => void;
}

const mockListing = {
  id: '1',
  title: 'Kos Nyaman Dekat Kampus UNEJ',
  type: 'Kos Putri',
  description: 'Kos eksklusif khusus putri dengan fasilitas lengkap dan lokasi strategis dekat Kampus UNEJ. Lingkungan aman, nyaman, dan cocok untuk mahasiswi yang mencari tempat tinggal berkualitas. Dilengkapi dengan berbagai fasilitas modern untuk menunjang aktivitas sehari-hari.',
  location: 'Jl. Kalimantan No. 45, Tegalboto, Jember',
  price: 850000,
  deposit: 850000,
  minimumStay: '1 bulan',
  rating: 4.8,
  reviews: 24,
  available: 3,
  totalRooms: 12,
  roomSize: '3x4 m',
  images: [
    'https://images.unsplash.com/photo-1616418928117-4e6d19be2df1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwYmVkcm9vbSUyMGludGVyaW9yfGVufDF8fHx8MTc2MTU5MTE2NXww&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1564273795917-fe399b763988?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwZG9ybWl0b3J5JTIwcm9vbXxlbnwxfHx8fDE3NjE2MzA2NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1638799869566-b17fa794c4de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiYXRocm9vbXxlbnwxfHx8fDE3NjE2MzQ4NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1613575831056-0acd5da8f085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc2MTY1NDI1OXww&ixlib=rb-4.1.0&q=80&w=1080',
  ],
  videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  has360: true,
  facilities: {
    room: ['Kasur', 'Lemari', 'Meja Belajar', 'AC', 'Kamar Mandi Dalam'],
    building: ['Wifi 100 Mbps', 'Laundry', 'Dapur Bersama', 'R. Tamu', 'CCTV', 'Keamanan 24 Jam'],
  },
  rules: [
    'Jam malam pukul 22.00 WIB',
    'Tidak boleh membawa tamu menginap',
    'Tidak boleh memelihara hewan',
    'Dilarang merokok di dalam kamar',
  ],
  nearbyPlaces: [
    { name: 'Universitas Jember', distance: '500 m', time: '5 menit jalan kaki' },
    { name: 'Indomaret', distance: '200 m', time: '2 menit jalan kaki' },
    { name: 'Warung Makan', distance: '100 m', time: '1 menit jalan kaki' },
    { name: 'Alun-Alun Jember', distance: '3 km', time: '10 menit berkendara' },
  ],
  badges: ['Student-Friendly', 'Verified', 'Fast Response'],
  host: {
    name: 'Ibu Siti Rahayu',
    avatar: '',
    joinDate: 'Bergabung sejak 2022',
    verified: true,
    responseTime: '< 1 jam',
    properties: 3,
  },
  neighborhoodScore: {
    safety: 4.5,
    transport: 4.0,
    facilities: 4.8,
    food: 4.7,
  }
};

const mockReviews = [
  {
    id: '1',
    user: 'Ayu Lestari',
    rating: 5,
    date: '2 minggu lalu',
    comment: 'Kos yang sangat nyaman dan bersih! Pemilik ramah dan responsif. Lokasi strategis dekat kampus. Recommended!',
    avatar: ''
  },
  {
    id: '2',
    user: 'Dewi Putri',
    rating: 4,
    date: '1 bulan lalu',
    comment: 'Tempatnya bagus, fasilitasnya lengkap. Wifi cepat cocok untuk kuliah online. Hanya saja kadang air agak kecil saat pagi.',
    avatar: ''
  },
  {
    id: '3',
    user: 'Rina Maharani',
    rating: 5,
    date: '2 bulan lalu',
    comment: 'Sudah 6 bulan tinggal disini, sangat puas. Keamanan terjamin, suasana tenang untuk belajar.',
    avatar: ''
  },
];

export default function ListingDetail({ listingId, currentUser, onBack }: ListingDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [bookingData, setBookingData] = useState({
    moveInDate: '',
    duration: '1',
    name: '',
    phone: '',
    message: ''
  });

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % mockListing.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + mockListing.images.length) % mockListing.images.length);
  };

  const handleBooking = () => {
    alert('Permintaan booking akan dikirim ke pemilik!');
    setBookingDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h2 className="mb-1">{mockListing.title}</h2>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span>{mockListing.rating}</span>
                  <span>({mockListing.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{mockListing.location}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => setIsFavorite(!isFavorite)}>
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="bg-black">
        <div className="container mx-auto">
          <div className="relative h-96 lg:h-[500px]">
            <ImageWithFallback
              src={mockListing.images[currentImageIndex]}
              alt={mockListing.title}
              className="w-full h-full object-contain"
            />
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2"
              onClick={prevImage}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2"
              onClick={nextImage}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {mockListing.images.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-2 h-2 rounded-full ${idx === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                  onClick={() => setCurrentImageIndex(idx)}
                />
              ))}
            </div>
            {mockListing.videoUrl && (
              <Button
                variant="secondary"
                className="absolute top-4 right-4"
              >
                <Play className="w-4 h-4 mr-2" />
                Lihat Video Tour
              </Button>
            )}
            {mockListing.has360 && (
              <Badge className="absolute top-4 left-4 bg-blue-600">
                360° View Available
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-blue-100 text-blue-700">{mockListing.type}</Badge>
              {mockListing.badges.map((badge) => (
                <Badge key={badge} variant="secondary">{badge}</Badge>
              ))}
            </div>

            {/* Quick Info */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Harga</div>
                    <div className="text-blue-600">Rp {mockListing.price.toLocaleString('id-ID')}</div>
                    <div className="text-xs text-gray-500">/bulan</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Ukuran Kamar</div>
                    <div>{mockListing.roomSize}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Tersedia</div>
                    <div className="text-green-600">{mockListing.available} kamar</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Min. Sewa</div>
                    <div>{mockListing.minimumStay}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Deskripsi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{mockListing.description}</p>
              </CardContent>
            </Card>

            {/* Facilities */}
            <Card>
              <CardHeader>
                <CardTitle>Fasilitas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="mb-3">Fasilitas Kamar</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {mockListing.facilities.room.map((facility) => (
                      <div key={facility} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{facility}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="mb-3">Fasilitas Bersama</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {mockListing.facilities.building.map((facility) => (
                      <div key={facility} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{facility}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rules */}
            <Card>
              <CardHeader>
                <CardTitle>Peraturan Kos</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {mockListing.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Lokasi & Sekitar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Google Maps</p>
                    <p className="text-sm text-gray-500">{mockListing.location}</p>
                  </div>
                </div>

                <div>
                  <h4 className="mb-3">Tempat Terdekat</h4>
                  <div className="space-y-3">
                    {mockListing.nearbyPlaces.map((place) => (
                      <div key={place.name} className="flex items-center justify-between">
                        <div>
                          <div>{place.name}</div>
                          <div className="text-sm text-gray-500">{place.time}</div>
                        </div>
                        <Badge variant="outline">{place.distance}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Neighborhood Score */}
                <div>
                  <h4 className="mb-3">Skor Lingkungan</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Keamanan</span>
                        <span className="text-sm">{mockListing.neighborhoodScore.safety}/5</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: `${(mockListing.neighborhoodScore.safety / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Transportasi</span>
                        <span className="text-sm">{mockListing.neighborhoodScore.transport}/5</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${(mockListing.neighborhoodScore.transport / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Fasilitas</span>
                        <span className="text-sm">{mockListing.neighborhoodScore.facilities}/5</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500"
                          style={{ width: `${(mockListing.neighborhoodScore.facilities / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Kuliner</span>
                        <span className="text-sm">{mockListing.neighborhoodScore.food}/5</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-500"
                          style={{ width: `${(mockListing.neighborhoodScore.food / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Ulasan Penghuni</CardTitle>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span>{mockListing.rating}</span>
                    <span className="text-gray-500">({mockListing.reviews} ulasan)</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {mockReviews.map((review) => (
                  <div key={review.id} className="space-y-2">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback>{review.user[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span>{review.user}</span>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {Array.from({ length: review.rating }).map((_, idx) => (
                            <Star key={idx} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          ))}
                        </div>
                        <p className="text-gray-700 text-sm">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-4">
                <div>
                  <div className="text-gray-500 text-sm mb-1">Harga Sewa</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-blue-600">Rp {mockListing.price.toLocaleString('id-ID')}</span>
                    <span className="text-gray-500">/bulan</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deposit</span>
                    <span>Rp {mockListing.deposit.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Minimal Sewa</span>
                    <span>{mockListing.minimumStay}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kamar Tersedia</span>
                    <span className="text-green-600">{mockListing.available} kamar</span>
                  </div>
                </div>

                <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Calendar className="w-4 h-4 mr-2" />
                      Request Booking
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Request Booking</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="moveInDate">Tanggal Masuk</Label>
                        <Input
                          id="moveInDate"
                          type="date"
                          value={bookingData.moveInDate}
                          onChange={(e) => setBookingData({ ...bookingData, moveInDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="duration">Durasi Sewa (bulan)</Label>
                        <Input
                          id="duration"
                          type="number"
                          min="1"
                          value={bookingData.duration}
                          onChange={(e) => setBookingData({ ...bookingData, duration: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="name">Nama Lengkap</Label>
                        <Input
                          id="name"
                          value={bookingData.name}
                          onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">No. Telepon</Label>
                        <Input
                          id="phone"
                          value={bookingData.phone}
                          onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="message">Pesan (Opsional)</Label>
                        <Textarea
                          id="message"
                          rows={3}
                          value={bookingData.message}
                          onChange={(e) => setBookingData({ ...bookingData, message: e.target.value })}
                        />
                      </div>
                      <Button className="w-full" onClick={handleBooking}>
                        Kirim Permintaan
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" className="w-full">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat Pemilik
                </Button>
              </CardContent>
            </Card>

            {/* Host Info */}
            <Card>
              <CardHeader>
                <CardTitle>Pemilik Properti</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>{mockListing.host.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span>{mockListing.host.name}</span>
                      {mockListing.host.verified && (
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div className="text-sm text-gray-500">{mockListing.host.joinDate}</div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Response Time</span>
                    <span>{mockListing.host.responseTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Properti</span>
                    <span>{mockListing.host.properties}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Lihat Profil
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
