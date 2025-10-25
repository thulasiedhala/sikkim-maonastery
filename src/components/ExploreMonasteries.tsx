import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Page } from '../App';

interface ExploreMonasteriesProps {
  onNavigate: (page: Page, monasteryId?: string) => void;
}

const monasteries = [
  {
    id: 'rumtek',
    name: 'Rumtek Monastery',
    location: 'Gangtok, East Sikkim',
    description: 'The largest monastery in Sikkim, known as the Dharma Chakra Centre',
    image: 'https://images.unsplash.com/photo-1733111248500-fe2ff4d3ccff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydW10ZWslMjBtb25hc3RlcnklMjBzaWtraW0lMjBleHRlcmlvcnxlbnwxfHx8fDE3NTc4MjY2Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    tradition: 'Kagyu',
    established: '1966',
    coordinates: { lat: 27.3389, lng: 88.5753 }
  },
  {
    id: 'enchey',
    name: 'Enchey Monastery',
    location: 'Gangtok, East Sikkim',
    description: 'One of the most important monasteries in Sikkim with a 200-year history',
    image: 'https://images.unsplash.com/photo-1717738979582-aa23dd492fbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmNoZXklMjBtb25hc3RlcnklMjBnYW5ndG9rJTIwYnVpbGRpbmdzfGVufDF8fHx8MTc1NzgyNjYzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    tradition: 'Nyingma',
    established: '1840',
    coordinates: { lat: 27.3353, lng: 88.6140 }
  },
  {
    id: 'tashiding',
    name: 'Tashiding Monastery',
    location: 'West Sikkim',
    description: 'Sacred monastery built on a heart-shaped hill between holy rivers',
    image: 'https://images.unsplash.com/photo-1665730365086-244792392a21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YXNoaWRpbmclMjBtb25hc3RlcnklMjB3ZXN0JTIwc2lra2ltfGVufDF8fHx8MTc1NzgyNjYzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    tradition: 'Nyingma',
    established: '1641',
    coordinates: { lat: 27.3433, lng: 88.2367 }
  }
];

export function ExploreMonasteries({ onNavigate }: ExploreMonasteriesProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMonasteries = monasteries.filter(monastery =>
    monastery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    monastery.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    monastery.tradition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl mb-3 sm:mb-4">Explore Sacred Monasteries</h1>
        <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
          Discover the spiritual heritage of Sikkim through its ancient monasteries
        </p>
      </div>

      {/* Search and View Controls */}
      <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="flex-1">
          <Input
            placeholder="Search monasteries by name, location, or tradition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 sm:h-11"
          />
        </div>
        <div className="flex gap-2 sm:gap-3">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            onClick={() => setViewMode('grid')}
            size="sm"
            className="flex-1 sm:flex-none"
          >
            <span className="mr-1 sm:mr-2">📋</span>
            <span className="hidden sm:inline">Grid View</span>
            <span className="sm:hidden">Grid</span>
          </Button>
          <Button
            variant={viewMode === 'map' ? 'default' : 'outline'}
            onClick={() => setViewMode('map')}
            size="sm"
            className="flex-1 sm:flex-none"
          >
            <span className="mr-1 sm:mr-2">🗺️</span>
            <span className="hidden sm:inline">Map View</span>
            <span className="sm:hidden">Map</span>
          </Button>
        </div>
      </div>

      {viewMode === 'map' ? (
        /* Map View */
        <div className="bg-gray-100 rounded-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 min-h-[300px] sm:min-h-[400px] flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">🗺️</div>
            <p className="text-lg sm:text-xl mb-2">Interactive Map Coming Soon</p>
            <p className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-6">
              Google Maps integration with monastery locations and quick info
            </p>
            <div className="space-y-2 sm:space-y-3">
              {filteredMonasteries.map((monastery) => (
                <div key={monastery.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-3 sm:p-4 rounded-lg gap-2 sm:gap-0">
                  <div className="flex-1">
                    <span className="font-medium text-sm sm:text-base block">{monastery.name}</span>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      📍 {monastery.coordinates.lat}, {monastery.coordinates.lng}
                    </span>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => onNavigate('monastery', monastery.id)}
                    className="w-full sm:w-auto mt-2 sm:mt-0"
                  >
                    Visit
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredMonasteries.map((monastery) => (
            <Card key={monastery.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="aspect-video relative">
                <ImageWithFallback
                  src={monastery.image}
                  alt={monastery.name}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-2 right-2 bg-white/90 text-gray-800 text-xs">
                  {monastery.tradition}
                </Badge>
              </div>
              
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl mb-2">{monastery.name}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">📍 {monastery.location}</p>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">🏛️ Est. {monastery.established}</p>
                <p className="text-gray-600 mb-4 text-sm sm:text-base line-clamp-2">{monastery.description}</p>
                
                <Button 
                  className="w-full h-10" 
                  onClick={() => onNavigate('monastery', monastery.id)}
                >
                  Explore Monastery
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredMonasteries.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">🔍</div>
          <p className="text-lg sm:text-xl mb-2">No monasteries found</p>
          <p className="text-muted-foreground text-sm sm:text-base">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
}