import { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, Upload, MapPin, Image, Video, Home, DollarSign, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';

interface CreateListingProps {
  currentUser: any;
  onComplete: () => void;
}

const steps = [
  { id: 1, name: 'Informasi Dasar', icon: Home },
  { id: 2, name: 'Foto & Video', icon: Image },
  { id: 3, name: 'Detail Properti', icon: FileText },
  { id: 4, name: 'Harga & Ketentuan', icon: DollarSign },
];

export default function CreateListing({ currentUser, onComplete }: CreateListingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    title: '',
    type: '',
    address: '',
    location: { lat: 0, lng: 0 },
    description: '',

    // Step 2: Media
    photos: [] as string[],
    videoUrl: '',
    has360: false,

    // Step 3: Property Details
    totalRooms: '',
    availableRooms: '',
    roomSize: '',
    roomFacilities: [] as string[],
    buildingFacilities: [] as string[],
    rules: [] as string[],

    // Step 4: Pricing
    monthlyPrice: '',
    yearlyPrice: '',
    deposit: '',
    minimumStay: '1',
    discounts: false,
  });

  const facilityOptions = {
    room: ['Kasur', 'Lemari', 'Meja Belajar', 'Kursi', 'AC', 'Kipas Angin', 'Kamar Mandi Dalam', 'Kamar Mandi Luar', 'Jendela', 'Balkon'],
    building: ['Wifi', 'Parkir Motor', 'Parkir Mobil', 'Laundry', 'Dapur Bersama', 'Ruang Tamu', 'CCTV', 'Keamanan 24 Jam', 'Jemuran', 'Dispenser'],
  };

  const ruleOptions = [
    'Jam malam pukul 22.00 WIB',
    'Tidak boleh membawa tamu menginap',
    'Tidak boleh memelihara hewan',
    'Dilarang merokok di dalam kamar',
    'Boleh membawa motor',
    'Boleh membawa mobil',
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit form
      alert('Listing berhasil dibuat! (Mock submission)');
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const toggleArrayItem = (field: string, item: string) => {
    const currentArray = formData[field as keyof typeof formData] as string[];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    updateFormData(field, newArray);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Mock photo upload
    const mockPhotos = [
      'https://images.unsplash.com/photo-1616418928117-4e6d19be2df1?w=400',
      'https://images.unsplash.com/photo-1564273795917-fe399b763988?w=400',
    ];
    updateFormData('photos', [...formData.photos, ...mockPhotos]);
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2">Buat Listing Baru</h1>
          <p className="text-gray-600">Lengkapi informasi properti Anda untuk menarik lebih banyak penyewa</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                        isCompleted
                          ? 'bg-green-600 text-white'
                          : isCurrent
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                    </div>
                    <span className={`text-xs text-center hidden md:block ${isCurrent ? '' : 'text-gray-500'}`}>
                      {step.name}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`h-0.5 flex-1 ${isCompleted ? 'bg-green-600' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <>
                <div>
                  <Label htmlFor="title">Judul Listing *</Label>
                  <Input
                    id="title"
                    placeholder="contoh: Kos Nyaman Dekat Kampus UNEJ"
                    value={formData.title}
                    onChange={(e) => updateFormData('title', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="type">Tipe Properti *</Label>
                  <Select value={formData.type} onValueChange={(value) => updateFormData('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kos-putra">Kos Putra</SelectItem>
                      <SelectItem value="kos-putri">Kos Putri</SelectItem>
                      <SelectItem value="kos-campur">Kos Campur</SelectItem>
                      <SelectItem value="kontrakan">Kontrakan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="address">Alamat Lengkap *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="address"
                      placeholder="Jl. Kalimantan No. 45, Tegalboto, Jember"
                      className="pl-10"
                      value={formData.address}
                      onChange={(e) => updateFormData('address', e.target.value)}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Alamat akan digunakan untuk menampilkan lokasi di peta
                  </p>
                </div>

                <div>
                  <Label htmlFor="description">Deskripsi Properti *</Label>
                  <Textarea
                    id="description"
                    rows={5}
                    placeholder="Deskripsikan properti Anda dengan detail: lokasi, fasilitas, lingkungan sekitar, dll."
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.description.length}/500 karakter
                  </p>
                </div>
              </>
            )}

            {/* Step 2: Photos & Videos */}
            {currentStep === 2 && (
              <>
                <div>
                  <Label>Foto Properti * (Minimal 4 foto)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      id="photo-upload"
                      onChange={handlePhotoUpload}
                    />
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Klik untuk upload atau drag and drop</p>
                      <p className="text-sm text-gray-500">PNG, JPG hingga 10MB</p>
                    </label>
                  </div>

                  {formData.photos.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {formData.photos.map((photo, idx) => (
                        <div key={idx} className="relative aspect-square">
                          <img
                            src={photo}
                            alt={`Photo ${idx + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 w-6 h-6"
                            onClick={() => {
                              const newPhotos = formData.photos.filter((_, i) => i !== idx);
                              updateFormData('photos', newPhotos);
                            }}
                          >
                            ×
                          </Button>
                          {idx === 0 && (
                            <Badge className="absolute bottom-2 left-2">Cover</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-sm text-gray-500 mt-2">
                    Tips: Upload foto yang berkualitas bagus dengan pencahayaan yang baik. Foto pertama akan menjadi foto cover.
                  </p>
                </div>

                <div>
                  <Label htmlFor="videoUrl">Video Room Tour (Opsional)</Label>
                  <div className="flex gap-2">
                    <Video className="w-5 h-5 text-gray-400 mt-2" />
                    <div className="flex-1">
                      <Input
                        id="videoUrl"
                        placeholder="https://youtube.com/watch?v=..."
                        value={formData.videoUrl}
                        onChange={(e) => updateFormData('videoUrl', e.target.value)}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Masukkan link YouTube atau Vimeo
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has360"
                    checked={formData.has360}
                    onCheckedChange={(checked) => updateFormData('has360', checked)}
                  />
                  <Label htmlFor="has360" className="cursor-pointer">
                    Saya memiliki foto 360° (akan ditambahkan setelah verifikasi)
                  </Label>
                </div>
              </>
            )}

            {/* Step 3: Property Details */}
            {currentStep === 3 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="totalRooms">Total Kamar *</Label>
                    <Input
                      id="totalRooms"
                      type="number"
                      min="1"
                      value={formData.totalRooms}
                      onChange={(e) => updateFormData('totalRooms', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="availableRooms">Kamar Tersedia *</Label>
                    <Input
                      id="availableRooms"
                      type="number"
                      min="0"
                      value={formData.availableRooms}
                      onChange={(e) => updateFormData('availableRooms', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="roomSize">Ukuran Kamar *</Label>
                    <Input
                      id="roomSize"
                      placeholder="contoh: 3x4 m"
                      value={formData.roomSize}
                      onChange={(e) => updateFormData('roomSize', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Fasilitas Kamar *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {facilityOptions.room.map((facility) => (
                      <div key={facility} className="flex items-center space-x-2">
                        <Checkbox
                          id={`room-${facility}`}
                          checked={formData.roomFacilities.includes(facility)}
                          onCheckedChange={() => toggleArrayItem('roomFacilities', facility)}
                        />
                        <Label htmlFor={`room-${facility}`} className="cursor-pointer">
                          {facility}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Fasilitas Bersama *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {facilityOptions.building.map((facility) => (
                      <div key={facility} className="flex items-center space-x-2">
                        <Checkbox
                          id={`building-${facility}`}
                          checked={formData.buildingFacilities.includes(facility)}
                          onCheckedChange={() => toggleArrayItem('buildingFacilities', facility)}
                        />
                        <Label htmlFor={`building-${facility}`} className="cursor-pointer">
                          {facility}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Peraturan Kos *</Label>
                  <div className="space-y-2">
                    {ruleOptions.map((rule) => (
                      <div key={rule} className="flex items-center space-x-2">
                        <Checkbox
                          id={`rule-${rule}`}
                          checked={formData.rules.includes(rule)}
                          onCheckedChange={() => toggleArrayItem('rules', rule)}
                        />
                        <Label htmlFor={`rule-${rule}`} className="cursor-pointer">
                          {rule}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Step 4: Pricing */}
            {currentStep === 4 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="monthlyPrice">Harga per Bulan *</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">Rp</span>
                      <Input
                        id="monthlyPrice"
                        type="number"
                        className="pl-12"
                        placeholder="850000"
                        value={formData.monthlyPrice}
                        onChange={(e) => updateFormData('monthlyPrice', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="yearlyPrice">Harga per Tahun (Opsional)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">Rp</span>
                      <Input
                        id="yearlyPrice"
                        type="number"
                        className="pl-12"
                        placeholder="9000000"
                        value={formData.yearlyPrice}
                        onChange={(e) => updateFormData('yearlyPrice', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="deposit">Deposit / Uang Jaminan *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">Rp</span>
                    <Input
                      id="deposit"
                      type="number"
                      className="pl-12"
                      placeholder="850000"
                      value={formData.deposit}
                      onChange={(e) => updateFormData('deposit', e.target.value)}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Biasanya setara dengan 1 bulan sewa
                  </p>
                </div>

                <div>
                  <Label htmlFor="minimumStay">Minimal Kontrak *</Label>
                  <Select value={formData.minimumStay} onValueChange={(value) => updateFormData('minimumStay', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Bulan</SelectItem>
                      <SelectItem value="3">3 Bulan</SelectItem>
                      <SelectItem value="6">6 Bulan</SelectItem>
                      <SelectItem value="12">12 Bulan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="discounts"
                    checked={formData.discounts}
                    onCheckedChange={(checked) => updateFormData('discounts', checked)}
                  />
                  <Label htmlFor="discounts" className="cursor-pointer">
                    Berikan diskon untuk sewa jangka panjang
                  </Label>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-blue-900 mb-2">Preview Harga</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Harga per Bulan:</span>
                      <span>Rp {parseInt(formData.monthlyPrice || '0').toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Deposit:</span>
                      <span>Rp {parseInt(formData.deposit || '0').toLocaleString('id-ID')}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between">
                      <span>Total Biaya Awal (Bulan 1):</span>
                      <span className="text-blue-600">
                        Rp {(parseInt(formData.monthlyPrice || '0') + parseInt(formData.deposit || '0')).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <Button
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {currentStep === steps.length ? 'Publikasikan' : 'Lanjut'}
            {currentStep < steps.length && <ChevronRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
