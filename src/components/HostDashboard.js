import { useState } from 'react';
import { Building2, Eye, MessageSquare, Calendar, TrendingUp, DollarSign, Users, Star, PlusCircle, Edit, Trash2, BarChart3 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ImageWithFallback } from './card/ImageWithFallback';

interface HostDashboardProps {
  currentUser: any;
  onViewListing: (listingId: string) => void;
  onCreateListing: () => void;
}

const mockListings = [
  {
    id: '1',
    title: 'Kos Nyaman Dekat Kampus UNEJ',
    type: 'Kos Putri',
    image: 'https://images.unsplash.com/photo-1616418928117-4e6d19be2df1?w=200',
    status: 'active',
    price: 850000,
    totalRooms: 12,
    occupiedRooms: 9,
    views: 245,
    bookings: 12,
    rating: 4.8,
  },
  {
    id: '2',
    title: 'Kontrakan Premium 2 Kamar',
    type: 'Kontrakan',
    image: 'https://images.unsplash.com/photo-1613575831056-0acd5da8f085?w=200',
    status: 'active',
    price: 2500000,
    totalRooms: 5,
    occupiedRooms: 4,
    views: 189,
    bookings: 8,
    rating: 4.9,
  },
];

const mockBookings = [
  {
    id: '1',
    tenant: 'Ayu Lestari',
    listing: 'Kos Nyaman Dekat Kampus UNEJ',
    moveInDate: '2025-11-01',
    status: 'pending',
    duration: 6,
    totalAmount: 850000,
  },
  {
    id: '2',
    tenant: 'Dewi Putri',
    listing: 'Kos Nyaman Dekat Kampus UNEJ',
    moveInDate: '2025-11-15',
    status: 'confirmed',
    duration: 12,
    totalAmount: 850000,
  },
  {
    id: '3',
    tenant: 'Rina Maharani',
    listing: 'Kontrakan Premium 2 Kamar',
    moveInDate: '2025-12-01',
    status: 'pending',
    duration: 12,
    totalAmount: 2500000,
  },
];

const mockPayments = [
  {
    id: '1',
    tenant: 'Ayu Lestari',
    listing: 'Kos Nyaman Dekat Kampus UNEJ',
    amount: 850000,
    dueDate: '2025-11-01',
    status: 'paid',
  },
  {
    id: '2',
    tenant: 'Dewi Putri',
    listing: 'Kos Nyaman Dekat Kampus UNEJ',
    amount: 850000,
    dueDate: '2025-11-01',
    status: 'pending',
  },
];

export default function HostDashboard({ currentUser, onViewListing, onCreateListing }: HostDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const totalRevenue = 7650000;
  const totalOccupancy = 13;
  const totalCapacity = 17;
  const occupancyRate = ((totalOccupancy / totalCapacity) * 100).toFixed(0);
  const pendingBookings = mockBookings.filter(b => b.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="mb-1">Dashboard Host</h1>
              <p className="text-gray-600">Kelola properti dan booking Anda</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={onCreateListing}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Tambah Listing Baru
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="listings">Listing Saya ({mockListings.length})</TabsTrigger>
            <TabsTrigger value="bookings">
              Booking 
              {pendingBookings > 0 && (
                <Badge variant="destructive" className="ml-2">{pendingBookings}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="payments">Pembayaran</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-gray-600">Total Pendapatan</div>
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-blue-600 mb-1">Rp {totalRevenue.toLocaleString('id-ID')}</div>
                  <div className="text-xs text-gray-500">Bulan ini</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-gray-600">Tingkat Hunian</div>
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="mb-1">{occupancyRate}%</div>
                  <div className="text-xs text-gray-500">{totalOccupancy}/{totalCapacity} kamar terisi</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-gray-600">Total Booking</div>
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="mb-1">{mockBookings.length}</div>
                  <div className="text-xs text-gray-500">{pendingBookings} menunggu konfirmasi</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-gray-600">Rating Rata-rata</div>
                    <Star className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="mb-1">4.85</div>
                  <div className="text-xs text-gray-500">Dari 36 ulasan</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Terbaru</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockBookings.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between">
                        <div>
                          <div>{booking.tenant}</div>
                          <div className="text-sm text-gray-500">{booking.listing}</div>
                        </div>
                        <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                          {booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performa Listing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockListings.map((listing) => (
                      <div key={listing.id}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">{listing.title}</span>
                          <span className="text-sm text-gray-500">{listing.views} views</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600"
                            style={{ width: `${(listing.occupiedRooms / listing.totalRooms) * 100}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {listing.occupiedRooms}/{listing.totalRooms} kamar terisi
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Listings Tab */}
          <TabsContent value="listings">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockListings.map((listing) => (
                <Card key={listing.id} className="overflow-hidden">
                  <div className="relative h-48">
                    <ImageWithFallback
                      src={listing.image}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-green-600">
                        {listing.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="mb-2">{listing.title}</h3>
                    <Badge variant="outline" className="mb-3">{listing.type}</Badge>

                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Harga</span>
                        <span className="text-blue-600">Rp {listing.price.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hunian</span>
                        <span>{listing.occupiedRooms}/{listing.totalRooms} kamar</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Views</span>
                        <span>{listing.views}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rating</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          <span>{listing.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => onViewListing(listing.id)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Lihat
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Daftar Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Penyewa</TableHead>
                      <TableHead>Listing</TableHead>
                      <TableHead>Tanggal Masuk</TableHead>
                      <TableHead>Durasi</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>{booking.tenant}</TableCell>
                        <TableCell>{booking.listing}</TableCell>
                        <TableCell>{new Date(booking.moveInDate).toLocaleDateString('id-ID')}</TableCell>
                        <TableCell>{booking.duration} bulan</TableCell>
                        <TableCell>Rp {booking.totalAmount.toLocaleString('id-ID')}</TableCell>
                        <TableCell>
                          <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                            {booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {booking.status === 'pending' && (
                              <>
                                <Button size="sm" variant="default">Terima</Button>
                                <Button size="sm" variant="outline">Tolak</Button>
                              </>
                            )}
                            {booking.status === 'confirmed' && (
                              <Button size="sm" variant="outline">
                                <MessageSquare className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Riwayat Pembayaran</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Penyewa</TableHead>
                      <TableHead>Listing</TableHead>
                      <TableHead>Jumlah</TableHead>
                      <TableHead>Jatuh Tempo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.tenant}</TableCell>
                        <TableCell>{payment.listing}</TableCell>
                        <TableCell>Rp {payment.amount.toLocaleString('id-ID')}</TableCell>
                        <TableCell>{new Date(payment.dueDate).toLocaleDateString('id-ID')}</TableCell>
                        <TableCell>
                          <Badge variant={payment.status === 'paid' ? 'default' : 'secondary'}>
                            {payment.status === 'paid' ? 'Lunas' : 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">Lihat Invoice</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pendapatan Bulanan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Grafik Pendapatan</p>
                      <p className="text-sm text-gray-500">Akan ditampilkan dengan Recharts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tingkat Hunian</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Grafik Hunian</p>
                      <p className="text-sm text-gray-500">Akan ditampilkan dengan Recharts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
