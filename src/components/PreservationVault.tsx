import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Page } from '../App';

interface PreservationVaultProps {
  onNavigate: (page: Page) => void;
}

const digitalArtifacts = [
  {
    id: 'lotus-sutra',
    title: 'Lotus Sutra Manuscript',
    type: 'manuscript',
    monastery: 'Rumtek Monastery',
    period: '18th Century',
    language: 'Sanskrit',
    description: 'Ancient palm leaf manuscript containing teachings of the Lotus Sutra, written in gold ink.',
    image: '📜',
    hasAudio: true,
    hasAR: true
  },
  {
    id: 'manjushri-thangka',
    title: 'Manjushri Thangka',
    type: 'thangka',
    monastery: 'Enchey Monastery',
    period: '17th Century',
    language: 'Visual',
    description: 'Exquisite painted scroll depicting Manjushri, the bodhisattva of wisdom.',
    image: '🎨',
    hasAudio: false,
    hasAR: true
  },
  {
    id: 'morning-chants',
    title: 'Morning Prayer Chants',
    type: 'audio',
    monastery: 'Tashiding Monastery',
    period: 'Traditional',
    language: 'Tibetan',
    description: 'Sacred morning prayers chanted by monks, preserving ancient melodic traditions.',
    image: '🎵',
    hasAudio: true,
    hasAR: false
  },
  {
    id: 'guru-padmasambhava',
    title: 'Life of Guru Padmasambhava',
    type: 'oral-history',
    monastery: 'Multiple',
    period: '8th Century origin',
    language: 'Tibetan/English',
    description: 'Oral traditions about the great master who brought Buddhism to Tibet.',
    image: '🗣️',
    hasAudio: true,
    hasAR: false
  },
  {
    id: 'ritual-instruments',
    title: 'Sacred Ritual Instruments',
    type: 'artifact',
    monastery: 'Rumtek Monastery',
    period: '19th Century',
    language: 'Visual',
    description: 'Collection of traditional instruments used in Buddhist ceremonies.',
    image: '🎺',
    hasAudio: true,
    hasAR: true
  },
  {
    id: 'architecture-study',
    title: 'Monastery Architecture Documentation',
    type: 'document',
    monastery: 'All Monasteries',
    period: '2020-2024',
    language: 'English',
    description: 'Detailed architectural analysis and preservation plans for Sikkim monasteries.',
    image: '🏛️',
    hasAudio: false,
    hasAR: true
  }
];

export function PreservationVault({ onNavigate }: PreservationVaultProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterMonastery, setFilterMonastery] = useState('all');
  const [selectedArtifact, setSelectedArtifact] = useState<string | null>(null);

  const types = ['all', 'manuscript', 'thangka', 'audio', 'oral-history', 'artifact', 'document'];
  const monasteries = ['all', 'Rumtek Monastery', 'Enchey Monastery', 'Tashiding Monastery', 'Multiple'];

  const filteredArtifacts = digitalArtifacts.filter(artifact => {
    const matchesSearch = artifact.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artifact.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || artifact.type === filterType;
    const matchesMonastery = filterMonastery === 'all' || artifact.monastery === filterMonastery;
    return matchesSearch && matchesType && matchesMonastery;
  });

  const selectedArtifactData = selectedArtifact ? 
    digitalArtifacts.find(a => a.id === selectedArtifact) : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl mb-4">Digital Preservation Vault</h1>
        <p className="text-muted-foreground text-lg">
          Preserving Sikkim's sacred heritage for future generations through digital archives
        </p>
      </div>

      {selectedArtifactData ? (
        /* Artifact Detail View */
        <div className="space-y-6">
          <Button 
            variant="outline" 
            onClick={() => setSelectedArtifact(null)}
            className="mb-4"
          >
            ← Back to Archive
          </Button>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="text-6xl">{selectedArtifactData.image}</div>
                <div>
                  <CardTitle className="text-2xl">{selectedArtifactData.title}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge>{selectedArtifactData.type}</Badge>
                    <Badge variant="outline">{selectedArtifactData.period}</Badge>
                    <Badge variant="secondary">{selectedArtifactData.language}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="mb-2">Description</h4>
                    <p className="text-gray-600">{selectedArtifactData.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="mb-2">Monastery</h4>
                    <p>{selectedArtifactData.monastery}</p>
                  </div>
                  
                  <div>
                    <h4 className="mb-2">Historical Period</h4>
                    <p>{selectedArtifactData.period}</p>
                  </div>
                  
                  <div>
                    <h4 className="mb-2">Language</h4>
                    <p>{selectedArtifactData.language}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-100 aspect-square rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-8xl mb-4">{selectedArtifactData.image}</div>
                      <p className="text-sm text-muted-foreground">High-resolution digital preservation</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {selectedArtifactData.hasAudio && (
                      <Button variant="outline" className="flex-1">
                        🎧 Listen
                      </Button>
                    )}
                    {selectedArtifactData.hasAR && (
                      <Button variant="outline" className="flex-1">
                        📱 AR View
                      </Button>
                    )}
                    <Button variant="outline" className="flex-1">
                      📚 Learn More
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {selectedArtifactData.hasAR && (
            <Card>
              <CardHeader>
                <CardTitle>🔮 Augmented Reality Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg text-center">
                  <div className="text-6xl mb-4">📱</div>
                  <p className="text-xl mb-2">AR Feature Coming Soon</p>
                  <p className="text-muted-foreground mb-4">
                    Point your phone at monastery images to see historical overlays and interactive information
                  </p>
                  <Button>Enable AR Mode</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        /* Archive Browse View */
        <Tabs defaultValue="browse" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse">Browse Archive</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="contribute">Contribute</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <Input
                      placeholder="Search artifacts, manuscripts, audio..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map(type => (
                        <SelectItem key={type} value={type}>
                          {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterMonastery} onValueChange={setFilterMonastery}>
                    <SelectTrigger>
                      <SelectValue placeholder="Monastery" />
                    </SelectTrigger>
                    <SelectContent>
                      {monasteries.map(monastery => (
                        <SelectItem key={monastery} value={monastery}>
                          {monastery === 'all' ? 'All Monasteries' : monastery}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Artifact Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArtifacts.map((artifact) => (
                <Card 
                  key={artifact.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedArtifact(artifact.id)}
                >
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4 text-center">{artifact.image}</div>
                    <h3 className="text-lg mb-2 line-clamp-2">{artifact.title}</h3>
                    <div className="flex gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">{artifact.type}</Badge>
                      <Badge variant="secondary" className="text-xs">{artifact.period}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{artifact.monastery}</p>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">{artifact.description}</p>
                    
                    <div className="flex gap-1">
                      {artifact.hasAudio && <span className="text-xs">🎧</span>}
                      {artifact.hasAR && <span className="text-xs">📱</span>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredArtifacts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-xl mb-2">No artifacts found</p>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="collections" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>📜 Sacred Manuscripts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">Ancient texts and scriptures preserved in digital format</p>
                  <div className="text-2xl mb-2">12 items</div>
                  <Button variant="outline" className="w-full">View Collection</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>🎨 Thangka Paintings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">Traditional scroll paintings depicting Buddhist deities and teachings</p>
                  <div className="text-2xl mb-2">8 items</div>
                  <Button variant="outline" className="w-full">View Collection</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>🎵 Sacred Audio</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">Chants, prayers, and oral traditions recorded by monks</p>
                  <div className="text-2xl mb-2">15 items</div>
                  <Button variant="outline" className="w-full">View Collection</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>🗣️ Oral Histories</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">Stories and traditions passed down through generations</p>
                  <div className="text-2xl mb-2">6 items</div>
                  <Button variant="outline" className="w-full">View Collection</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contribute" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>🤝 Help Preserve Cultural Heritage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <p className="mb-4">
                      Join our mission to digitally preserve Sikkim's Buddhist heritage. 
                      Your contributions help ensure these sacred traditions survive for future generations.
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4>📷 Digital Documentation</h4>
                      <p className="text-sm text-muted-foreground">
                        Help photograph and scan manuscripts, artifacts, and artworks
                      </p>
                      <Button variant="outline" className="w-full">Join Documentation Team</Button>
                    </div>
                    
                    <div className="space-y-4">
                      <h4>🗣️ Oral History Collection</h4>
                      <p className="text-sm text-muted-foreground">
                        Record elder monks and locals sharing traditional stories
                      </p>
                      <Button variant="outline" className="w-full">Record Stories</Button>
                    </div>
                    
                    <div className="space-y-4">
                      <h4>📝 Translation Work</h4>
                      <p className="text-sm text-muted-foreground">
                        Help translate texts from Tibetan to English or local languages
                      </p>
                      <Button variant="outline" className="w-full">Become Translator</Button>
                    </div>
                    
                    <div className="space-y-4">
                      <h4>💰 Fund Preservation</h4>
                      <p className="text-sm text-muted-foreground">
                        Support the ongoing work of digital preservation
                      </p>
                      <Button variant="outline" className="w-full">Make Donation</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}