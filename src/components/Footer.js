import { Building2, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { Separator } from './ui/separator';

export default function Footer() {
  const footerSections = [
    {
      title: 'Tentang Roomio',
      links: [
        { name: 'Tentang Kami', href: '#' },
        { name: 'Karir', href: '#' },
        { name: 'Blog', href: '#' },
      ],
    },
    {
      title: 'Dukungan',
      links: [
        { name: 'Pusat Bantuan', href: '#' },
        { name: 'Hubungi Kami', href: '#' },
        { name: 'FAQ', href: '#' },
      ],
    },
    {
      title: 'Pemilik',
      links: [
        { name: 'Pasang Listing', href: '#' },
        { name: 'Panduan Pemilik', href: '#' },
        { name: 'Verifikasi Properti', href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Syarat & Ketentuan', href: '#' },
        { name: 'Kebijakan Privasi', href: '#' },
        { name: 'Kebijakan Cookie', href: '#' },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-8 h-8 text-blue-500" />
              <span className="text-white text-xl">Roomio</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Platform kos & kontrakan terpercaya di Jember
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-white mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="bg-gray-800 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>© 2025 Roomio. All rights reserved. Made with ❤️ in Jember</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privasi</a>
            <a href="#" className="hover:text-white transition-colors">Syarat</a>
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
