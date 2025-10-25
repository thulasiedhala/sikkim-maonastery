import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Page } from '../App';

interface LocalEconomyProps {
  onNavigate: (page: Page) => void;
}

const products = [
  {
    id: 'singing-bowl',
    name: 'Traditional Singing Bowl',
    artisan: 'Tenzin Metalworks',
    price: '₹3,500',
    category: 'spiritual',
    image: 'https://images.unsplash.com/photo-1579755219070-739e0c0ef539?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaW5naW5nJTIwYm93bCUyMG1lZGl0YXRpb24lMjBicm9uemV8ZW58MXx8fHwxNzU3ODI2NjIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Hand-forged bronze singing bowl used for meditation and healing. Each bowl is tuned to specific frequencies.',
    storyUrl: 'tenzin-bowl-story',
    inStock: true,
    rating: 4.9
  },
  {
    id: 'prayer-flags',
    name: 'Handwoven Prayer Flags',
    artisan: 'Dolma\'s Textile Studio',
    price: '₹850',
    category: 'spiritual',
    image: 'https://images.unsplash.com/photo-1756005913783-8339e559c406?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aWJldGFuJTIwcHJheWVyJTIwZmxhZ3MlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NTc4MjY2MjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Set of 25 colorful prayer flags with traditional mantras. Made from organic cotton using natural dyes.',
    storyUrl: 'dolma-flags-story',
    inStock: true,
    rating: 4.8
  },
  {
    id: 'yak-cheese',
    name: 'Organic Yak Cheese',
    artisan: 'Pemba\'s Dairy Farm',
    price: '₹1,200',
    category: 'food',
    image: 'https://images.unsplash.com/photo-1663566869071-6c926e373515?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5YWslMjBjaGVlc2UlMjBoaW1hbGF5YW4lMjBkYWlyeXxlbnwxfHx8fDE3NTc4MjY5MDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Traditional smoked yak cheese from high-altitude pastures. Rich in nutrients and unique flavor.',
    storyUrl: 'pemba-dairy-story',
    inStock: true,
    rating: 4.7
  },
  {
    id: 'thangka-print',
    name: 'Tara Thangka Print',
    artisan: 'Lama Norbu Arts',
    price: '₹2,800',
    category: 'art',
    image: 'https://images.unsplash.com/photo-1717935501156-67501bae8fe7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFuZ2thJTIwcGFpbnRpbmclMjBidWRkaGlzdCUyMGFydHxlbnwxfHx8fDE3NTc4MjY2MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'High-quality print of Green Tara thangka painting. Blessed by monastery monks.',
    storyUrl: 'norbu-thangka-story',
    inStock: false,
    rating: 5.0
  },
  {
    id: 'cardamom-tea',
    name: 'Wild Cardamom Tea',
    artisan: 'Himalayan Tea Collective',
    price: '₹680',
    category: 'food',
    image: 'https://images.unsplash.com/photo-1651959653830-5c8cb576e134?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJkYW1vbSUyMHRlYSUyMGhpbWFsYXlhbiUyMHNwaWNlc3xlbnwxfHx8fDE3NTc4MjY2MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Premium wild cardamom tea blend from organic Himalayan gardens. Hand-picked and naturally processed.',
    storyUrl: 'tea-collective-story',
    inStock: true,
    rating: 4.6
  },
  {
    id: 'mala-beads',
    name: 'Bodhi Seed Mala',
    artisan: 'Sacred Crafts Cooperative',
    price: '₹1,950',
    category: 'spiritual',
    image: 'https://images.unsplash.com/photo-1643940527389-95b7b1007d74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxhJTIwYmVhZHMlMjBib2RoaSUyMHNlZWR8ZW58MXx8fHwxNzU3ODI2NjI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: '108-bead mala made from authentic bodhi seeds. Perfect for meditation and mantra recitation.',
    storyUrl: 'mala-cooperative-story',
    inStock: true,
    rating: 4.9
  }
];

const artisanStories = {
  'tenzin-bowl-story': {
    name: 'Tenzin Norbu',
    title: 'Master Metalworker',
    story: 'I learned this craft from my grandfather, who made bowls for the great Rinpoches. Each bowl is tuned by hand, taking weeks to perfect the sound.',
    videoUrl: 'mock-video-url'
  }
};

export function LocalEconomy({ onNavigate }: LocalEconomyProps) {
  const [cart, setCart] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStory, setSelectedStory] = useState<string | null>(null);

  const categories = ['all', 'spiritual', 'art', 'food'];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const addToCart = (productId: string) => {
    if (!cart.includes(productId)) {
      setCart([...cart, productId]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(id => id !== productId));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl mb-4">Local Economy & Crafts</h1>
        <p className="text-muted-foreground text-lg">
          Support local artisans and take home authentic Sikkimese treasures
        </p>
      </div>

      <Tabs defaultValue="products" className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="artisans">Meet Artisans</TabsTrigger>
          <TabsTrigger value="impact">Community Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          {/* Category Filter */}
          <div className="flex gap-2 mb-6">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category === 'all' ? 'All Products' : category}
              </Button>
            ))}
          </div>

          {/* Shopping Cart Summary */}
          {cart.length > 0 && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{cart.length} item(s) in cart</span>
                  </div>
                  <Button size="sm">
                    🛒 View Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="secondary">Out of Stock</Badge>
                    </div>
                  )}
                  <Badge className="absolute top-2 right-2 bg-white/90 text-gray-800">
                    ⭐ {product.rating}
                  </Badge>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg">{product.name}</h3>
                    <span className="text-lg font-semibold text-green-600">{product.price}</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    By {product.artisan}
                  </p>
                  
                  <Badge variant="outline" className="mb-3 capitalize">
                    {product.category}
                  </Badge>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {product.description}
                  </p>
                  
                  <div className="space-y-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          📖 Story Behind It
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Artisan Story</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="bg-amber-50 p-4 rounded-lg">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                                👨‍🎨
                              </div>
                              <div>
                                <h4>Master Artisan</h4>
                                <p className="text-sm text-muted-foreground">{product.artisan}</p>
                              </div>
                            </div>
                            <p className="text-sm">
                              "Each piece I create carries the wisdom of my ancestors and the spirit of our mountains. 
                              This {product.name.toLowerCase()} is made with traditional techniques passed down through generations."
                            </p>
                          </div>
                          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-4xl mb-2">🎥</div>
                              <p>Artisan Video Story</p>
                              <p className="text-sm text-muted-foreground">Coming Soon</p>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      className="w-full"
                      disabled={!product.inStock}
                      onClick={() => addToCart(product.id)}
                    >
                      {!product.inStock ? 'Out of Stock' : 
                       cart.includes(product.id) ? '✓ Added to Cart' : 'Add to Cart'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="artisans" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">👨‍🎨</span>
                </div>
                <h3 className="text-lg mb-2">Tenzin Norbu</h3>
                <p className="text-sm text-muted-foreground mb-2">Master Metalworker</p>
                <p className="text-sm mb-4">Specializes in traditional singing bowls and ritual instruments</p>
                <Badge variant="outline">15 years experience</Badge>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">👩‍🎨</span>
                </div>
                <h3 className="text-lg mb-2">Dolma Sherpa</h3>
                <p className="text-sm text-muted-foreground mb-2">Textile Artist</p>
                <p className="text-sm mb-4">Expert in traditional weaving and prayer flag creation</p>
                <Badge variant="outline">25 years experience</Badge>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">👨‍🌾</span>
                </div>
                <h3 className="text-lg mb-2">Pemba Tamang</h3>
                <p className="text-sm text-muted-foreground mb-2">Organic Farmer</p>
                <p className="text-sm mb-4">Produces traditional yak products and mountain herbs</p>
                <Badge variant="outline">20 years experience</Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="impact" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>💝 Direct Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="mb-2">Zero Middlemen</h4>
                    <p className="text-sm text-muted-foreground">
                      100% of product sales go directly to local artisans and their families
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-2">Fair Pricing</h4>
                    <p className="text-sm text-muted-foreground">
                      Artisans set their own prices ensuring fair compensation for their work
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-2">Skill Preservation</h4>
                    <p className="text-sm text-muted-foreground">
                      Supporting traditional crafts helps preserve cultural heritage
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>📊 Community Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Artisan Families Supported</span>
                    <span className="font-semibold">47</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Monthly Income Increase</span>
                    <span className="font-semibold text-green-600">+68%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Traditional Skills Preserved</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Young Apprentices Trained</span>
                    <span className="font-semibold">23</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>🌱 Sustainability Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-2">♻️</div>
                  <h4 className="mb-2">Eco-Friendly Materials</h4>
                  <p className="text-sm text-muted-foreground">
                    All products use sustainable, locally-sourced materials
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">📦</div>
                  <h4 className="mb-2">Minimal Packaging</h4>
                  <p className="text-sm text-muted-foreground">
                    Biodegradable packaging made from local plant fibers
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🚚</div>
                  <h4 className="mb-2">Carbon Neutral Shipping</h4>
                  <p className="text-sm text-muted-foreground">
                    Local delivery network minimizes environmental impact
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}