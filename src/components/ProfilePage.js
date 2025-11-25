import { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, CheckCircle2, Upload, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';

interface ProfilePageProps {
  currentUser: any;
  onUpdateUser: (user: any) => void;
}

export default function ProfilePage({ currentUser, onUpdateUser }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '081234567890',
    address: 'Jember, Jawa Timur',
    bio: 'Mahasiswa Universitas Jember, mencari kos yang nyaman dan dekat kampus.',
    occupation: 'Mahasiswa',
    university: 'Universitas Jember',
  });

  const handleSave = () => {
    onUpdateUser({
      ...currentUser,
      ...profileData,
    });
    setIsEditing(false);
    alert('Profil berhasil diperbarui!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <h1>Profil Saya</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="profile">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="verification">Verifikasi</TabsTrigger>
              <TabsTrigger value="preferences">Preferensi</TabsTrigger>
              <TabsTrigger value="security">Keamanan</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Informasi Profil</CardTitle>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>Edit Profil</Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Batal
                      </Button>
                      <Button onClick={handleSave}>Simpan</Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-6">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={currentUser?.avatar} />
                      <AvatarFallback className="text-2xl">
                        {currentUser?.name?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <div>
                        <Button variant="outline" size="sm">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Foto
                        </Button>
                        <p className="text-sm text-gray-500 mt-2">
                          JPG, PNG, max 2MB
                        </p>
                      </div>
                    )}
                    {!isEditing && (
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3>{currentUser?.name}</h3>
                          {currentUser?.verified && (
                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <p className="text-gray-500">
                          {currentUser?.role === 'host'
                            ? 'Pemilik Properti'
                            : currentUser?.role === 'both'
                            ? 'Pemilik & Pencari'
                            : 'Pencari Kos'}
                        </p>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Nama Lengkap</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          className="pl-10"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">No. Telepon</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="phone"
                          className="pl-10"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="occupation">Pekerjaan/Status</Label>
                      <Input
                        id="occupation"
                        value={profileData.occupation}
                        onChange={(e) => setProfileData({ ...profileData, occupation: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="university">Universitas/Perusahaan</Label>
                      <Input
                        id="university"
                        value={profileData.university}
                        onChange={(e) => setProfileData({ ...profileData, university: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="address">Alamat</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="address"
                          className="pl-10"
                          value={profileData.address}
                          onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        rows={3}
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Verification Tab */}
            <TabsContent value="verification">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Status Verifikasi</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <div>Verifikasi Email</div>
                          <div className="text-sm text-gray-500">{profileData.email}</div>
                        </div>
                      </div>
                      {currentUser?.verified ? (
                        <Badge className="bg-green-600">Terverifikasi</Badge>
                      ) : (
                        <Button size="sm">Verifikasi</Button>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div>
                          <div>Verifikasi Nomor Telepon</div>
                          <div className="text-sm text-gray-500">{profileData.phone}</div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Verifikasi</Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-gray-400" />
                        <div>
                          <div>Verifikasi Identitas (KTP)</div>
                          <div className="text-sm text-gray-500">Tingkatkan kepercayaan profil Anda</div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Upload KTP</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Manfaat Verifikasi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">Meningkatkan kepercayaan dari pemilik kos/penyewa</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">Mendapat badge "Verified" di profil Anda</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">Proses booking lebih cepat dan mudah</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">Akses ke fitur premium</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Preferensi Pencarian</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="budget">Budget (per bulan)</Label>
                    <div className="flex gap-3">
                      <Input id="budget-min" placeholder="Min" />
                      <Input id="budget-max" placeholder="Max" />
                    </div>
                  </div>

                  <div>
                    <Label>Tipe Properti</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <Button variant="outline">Kos Putra</Button>
                      <Button variant="outline">Kos Putri</Button>
                      <Button variant="outline">Kos Campur</Button>
                      <Button variant="outline">Kontrakan</Button>
                    </div>
                  </div>

                  <div>
                    <Label>Fasilitas Penting</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                      <Button variant="outline" size="sm">Wifi</Button>
                      <Button variant="outline" size="sm">AC</Button>
                      <Button variant="outline" size="sm">Parkir</Button>
                      <Button variant="outline" size="sm">Kamar Mandi Dalam</Button>
                      <Button variant="outline" size="sm">Dapur</Button>
                      <Button variant="outline" size="sm">Laundry</Button>
                    </div>
                  </div>

                  <Button>Simpan Preferensi</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Keamanan Akun</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="mb-4">Ubah Password</h4>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="current-password">Password Saat Ini</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div>
                        <Label htmlFor="new-password">Password Baru</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div>
                        <Label htmlFor="confirm-password">Konfirmasi Password Baru</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                      <Button>Update Password</Button>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="mb-2">Aktivitas Login</h4>
                    <p className="text-sm text-gray-500 mb-4">
                      Login terakhir: 28 Oktober 2025, 14:30 WIB
                    </p>
                    <Button variant="outline" size="sm">Lihat Semua Aktivitas</Button>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="mb-2 text-red-600">Hapus Akun</h4>
                    <p className="text-sm text-gray-500 mb-4">
                      Tindakan ini tidak dapat dibatalkan. Semua data Anda akan dihapus permanen.
                    </p>
                    <Button variant="destructive" size="sm">Hapus Akun</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
