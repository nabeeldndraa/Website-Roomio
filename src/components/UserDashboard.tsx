import { useState } from 'react';
import { Heart, Calendar, FileText, Star, MapPin, MessageSquare, Download } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface UserDashboardProps {
  currentUser: any;
  onViewListing: (listingId: string) => void;
}

const mockFavorites = [
  {
    id: '1',
    title: 'Kos Nyaman Dekat Kampus UNEJ',
    type: 'Kos Putri',
    location: 'Tegalboto, Jember',
    price: 850000,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1616418928117-4e6d19be2df1?w=200',
  },
  {
    id: '3',
    title: 'Kos Eksklusif untuk Pekerja',
    type: 'Kos Putra',
    location: 'Patrang, Jember',
    price: 1200000,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1564273795917-fe399b763988?w=200',
  },
];

const mockBookings = [
  {
    id: '1',
    listing: {
      title: 'Kos Nyaman Dekat Kampus UNEJ',
      type: 'Kos Putri',
      image: 'https://images.unsplash.com/photo-1616418928117-4e6d19be2df1?w=200',
    },
    moveInDate: '2025-11-01',
    moveOutDate: '2026-05-01',
    status: 'active',
    monthlyPrice: 850000,
    totalPaid: 5100000,
    nextPayment: '2025-12-01',
    contract: 'contract-001.pdf',
  },
];

const mockPayments = [
  {
    id: '1',
    date: '2025-10-28',
    listing: 'Kos Nyaman Dekat Kampus UNEJ',
    amount: 850000,
    status: 'paid',
    invoice: 'INV-001',
  },
  {
    id: '2',
    date: '2025-09-28',
    listing: 'Kos Nyaman Dekat Kampus UNEJ',
    amount: 850000,
    status: 'paid',
    invoice: 'INV-002',
  },
];

export default function UserDashboard({ currentUser, onViewListing }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState('favorites');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <h1 className="mb-1">Dashboard Saya</h1>
          <p className="text-gray-600">Kelola favorit, booking, dan pembayaran Anda</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="favorites">
              <Heart className="w-4 h-4 mr-2" />
              Favorit ({mockFavorites.length})
            </TabsTrigger>
            <TabsTrigger value="bookings">
              <Calendar className="w-4 h-4 mr-2" />
              Booking Saya ({mockBookings.length})
            </TabsTrigger>
            <TabsTrigger value="payments">
              <FileText className="w-4 h-4 mr-2" />
              Riwayat Pembayaran
            </TabsTrigger>
          </TabsList>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            {mockFavorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockFavorites.map((listing) => (
                  <Card
                    key={listing.id}
                    className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => onViewListing(listing.id)}
                  >
                    <div className="relative h-48">
                      <ImageWithFallback
                        src={listing.image}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-3 right-3 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert('Removed from favorites');
                        }}
                      >
                        <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                      </Button>
                    </div>

                    <CardContent className="p-4">
                      <h3 className="mb-2">{listing.title}</h3>
                      <Badge variant="outline" className="mb-3">{listing.type}</Badge>

                      <div className="flex items-center text-gray-600 text-sm mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        {listing.location}
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-blue-600">
                            Rp {listing.price.toLocaleString('id-ID')}
                          </span>
                          <span className="text-gray-500 text-sm">/bulan</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm">{listing.rating}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-gray-600 mb-2">Belum Ada Favorit</h3>
                  <p className="text-gray-500 mb-6">
                    Mulai simpan listing favorit Anda untuk akses cepat
                  </p>
                  <Button>Jelajahi Listing</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            {mockBookings.length > 0 ? (
              <div className="space-y-6">
                {mockBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Image */}
                        <div className="w-full lg:w-64 h-48 flex-shrink-0">
                          <ImageWithFallback
                            src={booking.listing.image}
                            alt={booking.listing.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 space-y-4">
                          <div>
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="mb-1">{booking.listing.title}</h3>
                                <Badge variant="outline">{booking.listing.type}</Badge>
                              </div>
                              <Badge className="bg-green-600">
                                {booking.status === 'active' ? 'Aktif' : 'Selesai'}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-gray-600 mb-1">Tanggal Masuk</div>
                              <div>{new Date(booking.moveInDate).toLocaleDateString('id-ID')}</div>
                            </div>
                            <div>
                              <div className="text-gray-600 mb-1">Tanggal Keluar</div>
                              <div>{new Date(booking.moveOutDate).toLocaleDateString('id-ID')}</div>
                            </div>
                            <div>
                              <div className="text-gray-600 mb-1">Harga per Bulan</div>
                              <div>Rp {booking.monthlyPrice.toLocaleString('id-ID')}</div>
                            </div>
                            <div>
                              <div className="text-gray-600 mb-1">Total Dibayar</div>
                              <div>Rp {booking.totalPaid.toLocaleString('id-ID')}</div>
                            </div>
                          </div>

                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm text-yellow-900">Pembayaran Berikutnya</div>
                                <div className="text-yellow-900">{new Date(booking.nextPayment).toLocaleDateString('id-ID')}</div>
                              </div>
                              <div className="text-yellow-900">Rp {booking.monthlyPrice.toLocaleString('id-ID')}</div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm">
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Chat Pemilik
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Download Kontrak
                            </Button>
                            <Button variant="outline" size="sm">
                              <FileText className="w-4 h-4 mr-2" />
                              Bayar Tagihan
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-gray-600 mb-2">Belum Ada Booking</h3>
                  <p className="text-gray-500 mb-6">
                    Mulai booking kos atau kontrakan impian Anda
                  </p>
                  <Button>Cari Kos</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Riwayat Pembayaran</CardTitle>
              </CardHeader>
              <CardContent>
                {mockPayments.length > 0 ? (
                  <div className="space-y-4">
                    {mockPayments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="mb-1">{payment.listing}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(payment.date).toLocaleDateString('id-ID')} • {payment.invoice}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="mb-1">Rp {payment.amount.toLocaleString('id-ID')}</div>
                          <Badge variant="default" className="bg-green-600">Lunas</Badge>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Belum ada riwayat pembayaran</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
