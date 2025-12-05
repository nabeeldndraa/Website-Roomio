import { Home, Search, PlusCircle, MessageSquare, User, Building2, Heart, Menu } from 'lucide-react';
import HomePage from './components/HomePage';
import SearchResults from './components/SearchResults';
import ListingDetail from './components/ListingDetail';
import CreateListing from './components/CreateListing';
import HostDashboard from './components/HostDashboard';
import UserDashboard from './components/UserDashboard';
import AuthPage from './components/AuthPage';
import ProfilePage from './components/ProfilePage';
import InboxPage from './components/InboxPage';
import { Button } from './components/ui/button';


/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {'user' | 'host' | 'both'} role
 * @property {string} [avatar]
 * @property {boolean} verified
 */

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('home');
  };

  const handleSearch = (params) => {
    setSearchParams(params);
    setCurrentPage('search');
  };

  const handleViewListing = (listingId) => {
    setSelectedListingId(listingId);
    setCurrentPage('listing');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onSearch={handleSearch} onViewListing={handleViewListing} />;
      case 'search':
        return <SearchResults searchParams={searchParams} onViewListing={handleViewListing} />;
      case 'listing':
        return <ListingDetail listingId={selectedListingId} currentUser={currentUser} onBack={() => setCurrentPage('search')} />;
      case 'create-listing':
        return <CreateListing currentUser={currentUser} onComplete={() => setCurrentPage('host-dashboard')} />;
      case 'host-dashboard':
        return <HostDashboard currentUser={currentUser} onViewListing={handleViewListing} onCreateListing={() => setCurrentPage('create-listing')} />;
      case 'user-dashboard':
        return <UserDashboard currentUser={currentUser} onViewListing={handleViewListing} />;
      case 'auth':
        return <AuthPage onLogin={handleLogin} />;
      case 'profile':
        return <ProfilePage currentUser={currentUser} onUpdateUser={setCurrentUser} />;
      case 'inbox':
        return <InboxPage currentUser={currentUser} onViewListing={handleViewListing} />;
      default:
        return <HomePage onSearch={handleSearch} onViewListing={handleViewListing} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <div className="flex items-center gap-2">
            <Building2 className="w-8 h-8 text-blue-600" />
            <span className="text-blue-600">Roomio</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <Button
            variant={currentPage === 'home' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setCurrentPage('home')}
          >
            <Home className="w-5 h-5 mr-3" />
            Beranda
          </Button>

          <Button
            variant={currentPage === 'search' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setCurrentPage('search')}
          >
            <Search className="w-5 h-5 mr-3" />
            Cari Kos
          </Button>

          {currentUser && (
            <>
              <Button
                variant={currentPage === 'inbox' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setCurrentPage('inbox')}
              >
                <MessageSquare className="w-5 h-5 mr-3" />
                Pesan
              </Button>

              <Button
                variant={currentPage === 'user-dashboard' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setCurrentPage('user-dashboard')}
              >
                <Heart className="w-5 h-5 mr-3" />
                Favorit & Booking
              </Button>
            </>
          )}

          {currentUser && (currentUser.role === 'host' || currentUser.role === 'both') && (
            <>
              <div className="pt-4 pb-2 px-3 text-gray-500 text-xs">PEMILIK</div>
              <Button
                variant={currentPage === 'host-dashboard' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setCurrentPage('host-dashboard')}
              >
                <Building2 className="w-5 h-5 mr-3" />
                Dashboard Host
              </Button>

              <Button
                variant={currentPage === 'create-listing' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setCurrentPage('create-listing')}
              >
                <PlusCircle className="w-5 h-5 mr-3" />
                Tambah Listing
              </Button>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-gray-200">
          {currentUser ? (
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setCurrentPage('profile')}
              >
                <User className="w-5 h-5 mr-3" />
                {currentUser.name}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleLogout}
              >
                Keluar
              </Button>
            </div>
          ) : (
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => setCurrentPage('auth')}
            >
              Masuk / Daftar
            </Button>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white">
            <div className="p-6">
              <div className="flex items-center gap-2">
                <Building2 className="w-8 h-8 text-blue-600" />
                <span className="text-blue-600">Roomio</span>
              </div>
            </div>

            <nav className="px-4 space-y-1">
              <Button
                variant={currentPage === 'home' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => { setCurrentPage('home'); setSidebarOpen(false); }}
              >
                <Home className="w-5 h-5 mr-3" />
                Beranda
              </Button>

              <Button
                variant={currentPage === 'search' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => { setCurrentPage('search'); setSidebarOpen(false); }}
              >
                <Search className="w-5 h-5 mr-3" />
                Cari Kos
              </Button>

              {currentUser && (
                <>
                  <Button
                    variant={currentPage === 'inbox' ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => { setCurrentPage('inbox'); setSidebarOpen(false); }}
                  >
                    <MessageSquare className="w-5 h-5 mr-3" />
                    Pesan
                  </Button>

                  <Button
                    variant={currentPage === 'user-dashboard' ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => { setCurrentPage('user-dashboard'); setSidebarOpen(false); }}
                  >
                    <Heart className="w-5 h-5 mr-3" />
                    Favorit & Booking
                  </Button>
                </>
              )}

              {currentUser && (currentUser.role === 'host' || currentUser.role === 'both') && (
                <>
                  <div className="pt-4 pb-2 px-3 text-gray-500 text-xs">PEMILIK</div>
                  <Button
                    variant={currentPage === 'host-dashboard' ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => { setCurrentPage('host-dashboard'); setSidebarOpen(false); }}
                  >
                    <Building2 className="w-5 h-5 mr-3" />
                    Dashboard Host
                  </Button>

                  <Button
                    variant={currentPage === 'create-listing' ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => { setCurrentPage('create-listing'); setSidebarOpen(false); }}
                  >
                    <PlusCircle className="w-5 h-5 mr-3" />
                    Tambah Listing
                  </Button>
                </>
              )}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
              {currentUser ? (
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => { setCurrentPage('profile'); setSidebarOpen(false); }}
                  >
                    <User className="w-5 h-5 mr-3" />
                    {currentUser.name}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleLogout}
                  >
                    Keluar
                  </Button>
                </div>
              ) : (
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => { setCurrentPage('auth'); setSidebarOpen(false); }}
                >
                  Masuk / Daftar
                </Button>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            <span className="text-blue-600">Roomio</span>
          </div>
          <div className="w-10" />
        </div>

        {renderPage()}
      </main>
    </div>
  );
}
