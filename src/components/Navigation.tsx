import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from './ui/sheet';
import { Page } from '../App';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isAuthenticated: boolean;
  user: { name: string; email: string; role: 'user' | 'admin' } | null;
  onLogout: () => void;
}

export function Navigation({ currentPage, onNavigate, isAuthenticated, user, onLogout }: NavigationProps) {
  const [emergencyDialogOpen, setEmergencyDialogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navItems = [
    { id: 'home' as Page, label: 'Home', icon: '🏠' },
    { id: 'explore' as Page, label: 'Explore', icon: '🗺️' },
    { id: 'festivals' as Page, label: 'Festivals', icon: '🎋' },
    { id: 'community' as Page, label: 'Community', icon: '🏘️' },
    { id: 'vault' as Page, label: 'Preservation', icon: '📚' },
    { id: 'economy' as Page, label: 'Shop', icon: '🛍️' },
  ];

  const emergencyContacts = [
    { name: 'Police Emergency', number: '100', description: 'General emergency police helpline' },
    { name: 'Medical Emergency', number: '108', description: 'Ambulance and medical emergency' },
    { name: 'Tourist Helpline Sikkim', number: '+91-3592-202425', description: 'For tourist assistance and guidance' },
    { name: 'Monastery Emergency', number: '+91-3592-205566', description: 'For monastery-related emergencies' },
    { name: 'Fire Emergency', number: '101', description: 'Fire department emergency' },
  ];

  const handleMobileNavigate = (page: Page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const handleMobileLogout = () => {
    onLogout();
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 backdrop-blur border-b border-orange-300/30 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white text-sm">🏔️</span>
            </div>
            <span className="text-base sm:text-lg font-semibold text-white drop-shadow-sm">
              <span className="hidden sm:inline">Sikkim Monasteries</span>
              <span className="sm:hidden">Sikkim</span>
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "secondary" : "ghost"}
                onClick={() => onNavigate(item.id)}
                className={`relative text-white hover:bg-white/20 hover:text-white transition-colors ${
                  currentPage === item.id 
                    ? 'bg-white/25 text-white shadow-sm' 
                    : 'text-white/90 hover:text-white'
                }`}
              >
                <span className="hidden xl:inline">{item.label}</span>
                <span className="xl:hidden">{item.icon}</span>
              </Button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            {/* Emergency Contact Button */}
            <Dialog open={emergencyDialogOpen} onOpenChange={setEmergencyDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white border-red-500 hover:border-red-600 shadow-sm text-xs sm:text-sm px-2 sm:px-3"
                >
                  <span className="hidden sm:inline">🚨 Emergency</span>
                  <span className="sm:hidden">🚨</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md mx-4">
                <DialogHeader>
                  <DialogTitle className="text-red-600 flex items-center gap-2">
                    🚨 Emergency Contacts
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {emergencyContacts.map((contact, index) => (
                    <div key={index} className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">{contact.name}</h4>
                          <p className="text-xs text-gray-600 mt-1">{contact.description}</p>
                        </div>
                        <a 
                          href={`tel:${contact.number}`}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors text-center sm:ml-3 flex-shrink-0"
                        >
                          {contact.number}
                        </a>
                      </div>
                    </div>
                  ))}
                  <div className="text-xs text-gray-500 mt-4 p-2 bg-yellow-50 rounded border">
                    <strong>Note:</strong> In case of immediate danger, call the appropriate emergency number directly. 
                    These contacts are for assistance within Sikkim region.
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Desktop Auth */}
            {isAuthenticated && user ? (
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-sm text-white/90 truncate max-w-24">Welcome, {user.name}</span>
                {user.role === 'admin' && (
                  <Button 
                    variant={currentPage === 'admin' ? "secondary" : "outline"}
                    onClick={() => onNavigate('admin')}
                    size="sm"
                    className={`${
                      currentPage === 'admin' 
                        ? 'bg-white/25 text-white hover:bg-white/30' 
                        : 'border-white/30 text-white hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    Admin
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={onLogout}
                  size="sm"
                  className="border-white/30 text-white hover:bg-white/20 hover:text-white"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button 
                variant={currentPage === 'auth' ? "secondary" : "outline"}
                onClick={() => onNavigate('auth')}
                size="sm"
                className={`hidden md:block ${
                  currentPage === 'auth' 
                    ? 'bg-white/25 text-white hover:bg-white/30' 
                    : 'border-white/30 text-white hover:bg-white/20 hover:text-white'
                }`}
              >
                Login
              </Button>
            )}
            
            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="lg:hidden text-white hover:bg-white/20 p-2"
                >
                  <span className="text-lg">☰</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px] bg-gradient-to-b from-amber-50 to-orange-50">
                <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-2 mb-8 mt-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white text-sm">🏔️</span>
                    </div>
                    <span className="text-lg font-semibold text-gray-800">Sikkim Monasteries</span>
                  </div>

                  {/* Mobile Navigation Items */}
                  <div className="space-y-2 flex-1">
                    {navItems.map((item) => (
                      <SheetClose key={item.id} asChild>
                        <Button
                          variant={currentPage === item.id ? "default" : "ghost"}
                          onClick={() => handleMobileNavigate(item.id)}
                          className={`w-full justify-start text-left h-12 ${
                            currentPage === item.id 
                              ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-sm' 
                              : 'text-gray-700 hover:bg-orange-100'
                          }`}
                        >
                          <span className="mr-3 text-lg">{item.icon}</span>
                          {item.label}
                        </Button>
                      </SheetClose>
                    ))}
                  </div>

                  {/* Mobile Auth Section */}
                  <div className="border-t pt-4 space-y-3">
                    {isAuthenticated && user ? (
                      <>
                        <div className="px-3 py-2 bg-orange-100 rounded-lg">
                          <p className="text-sm text-gray-600">Welcome,</p>
                          <p className="font-medium text-gray-800 truncate">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        
                        {user.role === 'admin' && (
                          <SheetClose asChild>
                            <Button 
                              variant={currentPage === 'admin' ? "default" : "outline"}
                              onClick={() => handleMobileNavigate('admin')}
                              className="w-full justify-start"
                            >
                              <span className="mr-3">⚙️</span>
                              Admin Dashboard
                            </Button>
                          </SheetClose>
                        )}
                        
                        <Button 
                          variant="outline" 
                          onClick={handleMobileLogout}
                          className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <span className="mr-3">🚪</span>
                          Logout
                        </Button>
                      </>
                    ) : (
                      <SheetClose asChild>
                        <Button 
                          variant={currentPage === 'auth' ? "default" : "outline"}
                          onClick={() => handleMobileNavigate('auth')}
                          className="w-full justify-start"
                        >
                          <span className="mr-3">👤</span>
                          Login / Sign Up
                        </Button>
                      </SheetClose>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}