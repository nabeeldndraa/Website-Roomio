import { useState } from 'react';
import { MessageSquare, Send, Search, MoreVertical, Image, Paperclip, Phone, Video, DollarSign, CheckCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface InboxPageProps {
  currentUser: any;
  onViewListing: (listingId: string) => void;
}

const mockConversations = [
  {
    id: '1',
    user: {
      name: 'Ibu Siti Rahayu',
      avatar: '',
      role: 'Pemilik Kos',
    },
    listing: {
      id: '1',
      title: 'Kos Nyaman Dekat Kampus UNEJ',
    },
    lastMessage: 'Baik, terima kasih. Kapan rencana mau lihat kamarnya?',
    timestamp: '10:30',
    unread: 2,
    online: true,
  },
  {
    id: '2',
    user: {
      name: 'Bapak Andi',
      avatar: '',
      role: 'Pemilik Kontrakan',
    },
    listing: {
      id: '2',
      title: 'Kontrakan Premium 2 Kamar',
    },
    lastMessage: 'Untuk deposit sama dengan 1 bulan sewa ya',
    timestamp: 'Kemarin',
    unread: 0,
    online: false,
  },
  {
    id: '3',
    user: {
      name: 'Dewi Putri',
      avatar: '',
      role: 'Pencari Kos',
    },
    listing: null,
    lastMessage: 'Oke siap, terima kasih infonya!',
    timestamp: '2 hari lalu',
    unread: 0,
    online: false,
  },
];

const mockMessages = [
  {
    id: '1',
    senderId: 'other',
    text: 'Halo, saya tertarik dengan kos ini. Apakah masih ada kamar kosong?',
    timestamp: '09:00',
    read: true,
  },
  {
    id: '2',
    senderId: 'me',
    text: 'Halo! Iya masih ada, saat ini tersedia 3 kamar. Apakah ada yang ingin ditanyakan?',
    timestamp: '09:15',
    read: true,
  },
  {
    id: '3',
    senderId: 'other',
    text: 'Kalau untuk fasilitas sudah termasuk listrik dan air ya?',
    timestamp: '09:20',
    read: true,
  },
  {
    id: '4',
    senderId: 'me',
    text: 'Harga sudah termasuk air, tapi untuk listrik pakai token pribadi ya',
    timestamp: '09:25',
    read: true,
  },
  {
    id: '5',
    senderId: 'other',
    text: 'Baik, terima kasih. Kapan rencana mau lihat kamarnya?',
    timestamp: '10:30',
    read: true,
  },
];

export default function InboxPage({ currentUser, onViewListing }: InboxPageProps) {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      alert(`Pesan terkirim: ${messageInput}`);
      setMessageInput('');
    }
  };

  const filteredConversations = mockConversations.filter((conv) =>
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <h1>Pesan</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Conversations List */}
        <aside className="w-full md:w-96 bg-white border-r border-gray-200 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Cari pesan..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
                  selectedConversation.id === conversation.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={conversation.user.avatar} />
                      <AvatarFallback>{conversation.user.name[0]}</AvatarFallback>
                    </Avatar>
                    {conversation.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={conversation.unread > 0 ? '' : ''}>{conversation.user.name}</span>
                      <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                    </div>
                    {conversation.listing && (
                      <div className="text-xs text-gray-500 mb-1">{conversation.listing.title}</div>
                    )}
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                      {conversation.unread > 0 && (
                        <Badge className="ml-2 bg-blue-600">{conversation.unread}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-50 hidden md:flex">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedConversation.user.avatar} />
                  <AvatarFallback>{selectedConversation.user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span>{selectedConversation.user.name}</span>
                    {selectedConversation.online && (
                      <span className="text-xs text-green-600">Online</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">{selectedConversation.user.role}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {selectedConversation.listing && (
              <Card className="mt-4">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="text-sm mb-1">{selectedConversation.listing.title}</div>
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-blue-600"
                        onClick={() => onViewListing(selectedConversation.listing!.id)}
                      >
                        Lihat Detail Listing
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {mockMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-md px-4 py-2 rounded-lg ${
                    message.senderId === 'me'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <div
                    className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                      message.senderId === 'me' ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    <span>{message.timestamp}</span>
                    {message.senderId === 'me' && (
                      <CheckCheck className={`w-3 h-3 ${message.read ? 'text-blue-200' : ''}`} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white border-t border-gray-200 p-3">
            <div className="flex gap-2 mb-3">
              <Button variant="outline" size="sm" className="flex-1">
                <DollarSign className="w-4 h-4 mr-2" />
                Tawarkan Harga
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <MessageSquare className="w-4 h-4 mr-2" />
                Template
              </Button>
            </div>
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-end gap-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Image className="w-5 h-5" />
              </Button>
              <div className="flex-1">
                <Input
                  placeholder="Ketik pesan..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
              </div>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleSendMessage}
              >
                <Send className="w-4 h-4 mr-2" />
                Kirim
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
