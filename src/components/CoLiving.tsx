import React, { useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Page } from '../App';

interface CoLivingProps {
  onNavigate: (page: Page) => void;
}

const homestays = [
  {
    id: 'pema-house',
    name: 'Pema\'s Traditional Home',
    host: 'Pema Lhamo',
    location: 'Near Rumtek Monastery',
    price: '₹1,500/night',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1664745894358-9d69702ab86c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMHNpa2tpbSUyMGhvdXNlJTIwbW91bnRhaW4lMjB2aWV3fGVufDF8fHx8MTc1NzgyNjYzNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    amenities: ['Traditional meals', 'Mountain view', 'Cultural stories'],
    description: 'Experience authentic Sikkimese culture in a traditional home with panoramic mountain views.'
  },
  {
    id: 'tashi-retreat',
    name: 'Tashi Mountain Retreat',
    host: 'Tashi Norbu',
    location: 'Enchey Monastery vicinity',
    price: '₹2,200/night',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1754976645811-600672eb6a0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaW1hbGF5YW4lMjByZXRyZWF0JTIwbWVkaXRhdGlvbiUyMGhvdXNlfGVufDF8fHx8MTc1NzgyNjYzNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    amenities: ['Meditation room', 'Organic garden', 'Yoga sessions'],
    description: 'Peaceful retreat offering meditation practices and organic local cuisine.'
  }
];

const workshops = [
  {
    id: 'thangka-painting',
    name: 'Traditional Thangka Painting',
    instructor: 'Lama Norbu',
    duration: '3 days',
    price: '₹4,500',
    participants: '8 max',
    description: 'Learn the sacred art of Thangka painting with traditional techniques and spiritual significance.',
    image: '🎨'
  },
  {
    id: 'meditation-retreat',
    name: 'Mindfulness Meditation',
    instructor: 'Sister Dolma',
    duration: '5 days',
    price: '₹3,000',
    participants: '12 max',
    description: 'Immerse yourself in Buddhist meditation practices in a serene monastery setting.',
    image: '🧘‍♀️'
  },
  {
    id: 'cooking-class',
    name: 'Sikkimese Cooking',
    instructor: 'Ama Yangchen',
    duration: '1 day',
    price: '₹1,200',
    participants: '6 max',
    description: 'Master traditional Sikkimese recipes using local ingredients and ancient techniques.',
    image: '🍲'
  }
];

const guides = [
  {
    id: 'tenzin-guide',
    name: 'Tenzin Norbu',
    experience: '8 years',
    languages: ['English', 'Hindi', 'Nepali', 'Bhutia'],
    specialties: ['Monastery Tours', 'Buddhist Philosophy', 'Cultural Heritage'],
    price: '₹2,500/day',
    rating: 4.9,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1733902437716-6e1a5c737d37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aWJldGFuJTIwZ3VpZGUlMjBtYW4lMjBtb3VudGFpbnxlbnwxfHx8fDE3NTc4MjY2MzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Certified cultural guide with deep knowledge of Buddhist traditions and monastery history. Fluent storyteller who brings ancient wisdom to life.',
    availability: 'Available',
    phone: '+91-9832-567-890'
  },
  {
    id: 'dolma-guide',
    name: 'Dolma Sherpa',
    experience: '12 years',
    languages: ['English', 'Hindi', 'Sherpa', 'Tibetan'],
    specialties: ['Trekking', 'Mountain Monasteries', 'Adventure Tours'],
    price: '₹3,200/day',
    rating: 4.8,
    reviews: 203,
    image: 'https://images.unsplash.com/photo-1707071073783-b705c64b3a68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGVycGElMjB3b21hbiUyMGd1aWRlJTIwaGltYWxheWF8ZW58MXx8fHwxNzU3ODI2NjMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Expert mountain guide specializing in high-altitude monastery visits and spiritual trekking experiences.',
    availability: 'Available',
    phone: '+91-9876-543-210'
  },
  {
    id: 'pemba-guide',
    name: 'Pemba Tamang',
    experience: '6 years',
    languages: ['English', 'Hindi', 'Tamang', 'Gurung'],
    specialties: ['Photography Tours', 'Wildlife Monasteries', 'Eco-Tourism'],
    price: '₹2,800/day',
    rating: 4.7,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1655046998870-16157d94a790?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YW1hbmclMjBtYW4lMjBuZXBhbCUyMGd1aWRlfGVufDF8fHx8MTc1NzgyNjYzMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Nature enthusiast and photographer who combines monastery visits with stunning landscape photography opportunities.',
    availability: 'Busy until Dec 20',
    phone: '+91-9123-456-789'
  },
  {
    id: 'lobsang-guide',
    name: 'Lobsang Wangdu',
    experience: '15 years',
    languages: ['English', 'Hindi', 'Tibetan', 'Dzongkha'],
    specialties: ['Sacred Rituals', 'Meditation Guidance', 'Ancient Practices'],
    price: '₹4,000/day',
    rating: 5.0,
    reviews: 274,
    image: 'https://images.unsplash.com/photo-1506800157734-eaa588d4b012?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aWJldGFuJTIwbW9uayUyMGd1aWRlJTIwc3Bpcml0dWFsfGVufDF8fHx8MTc1NzgyNjYzMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Former monk turned guide with unparalleled knowledge of sacred rituals and meditation practices. Provides deeply spiritual experiences.',
    availability: 'Available',
    phone: '+91-9999-123-456'
  }
];

const gratitudeNotes = [
  {
    id: 1,
    author: 'Sarah from Australia',
    message: 'The peace I found at Rumtek Monastery has changed my life. Thank you for preserving this sacred space.',
    date: '2 days ago',
    replies: [
      {
        author: 'Lama Tenzin',
        message: 'May the seeds of peace you found here grow and flourish in your daily life. 🙏',
        isMonk: true
      }
    ]
  },
  {
    id: 2,
    author: 'Raj from Mumbai',
    message: 'The homestay with Pema\'s family was incredible. I learned so much about Sikkimese culture!',
    date: '1 week ago',
    replies: [
      {
        author: 'Pema Lhamo',
        message: 'You are always welcome in our home, dear friend! 🏠',
        isLocal: true
      }
    ]
  }
];

export function CoLiving({ onNavigate }: CoLivingProps) {
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState(gratitudeNotes);
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    duration: '',
    groupSize: '',
    specialRequests: ''
  });

  const postGratitudeNote = () => {
    if (newNote.trim()) {
      const note = {
        id: notes.length + 1,
        author: 'Anonymous Visitor',
        message: newNote,
        date: 'Just now',
        replies: []
      };
      setNotes([note, ...notes]);
      setNewNote('');
    }
  };

  const handleBookGuide = useCallback((guideId: string) => {
    setSelectedGuide(guideId);
  }, []);

  const submitBooking = useCallback(() => {
    if (!selectedGuide) return;
    
    const guide = guides.find(g => g.id === selectedGuide);
    if (!guide) return;
    
    // Show success message
    alert(`Booking request submitted! ${guide.name} will contact you within 24 hours.`);
    
    // Reset form
    setBookingForm({
      name: '',
      email: '',
      phone: '',
      date: '',
      duration: '',
      groupSize: '',
      specialRequests: ''
    });
    setSelectedGuide(null);
  }, [selectedGuide]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl mb-4">Community & Co-Living</h1>
        <p className="text-muted-foreground text-lg">
          Connect with locals, learn traditions, and create meaningful experiences
        </p>
      </div>

      <Tabs defaultValue="homestays" className="mb-8">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="homestays">Homestays</TabsTrigger>
          <TabsTrigger value="workshops">Workshops</TabsTrigger>
          <TabsTrigger value="guides">Local Guides</TabsTrigger>
          <TabsTrigger value="volunteer">Volunteer</TabsTrigger>
          <TabsTrigger value="community">Community Wall</TabsTrigger>
        </TabsList>

        <TabsContent value="homestays" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {homestays.map((homestay) => (
              <Card key={homestay.id} className="overflow-hidden">
                <div className="aspect-video relative bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-6xl mb-2">🏠</div>
                    <p className="text-lg font-medium">{homestay.name}</p>
                  </div>
                  <Badge className="absolute top-2 right-2 bg-white/90 text-gray-800">
                    ⭐ {homestay.rating}
                  </Badge>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl">{homestay.name}</h3>
                    <span className="text-lg font-semibold text-green-600">{homestay.price}</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    Hosted by {homestay.host}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    📍 {homestay.location}
                  </p>
                  
                  <p className="text-gray-600 mb-4">{homestay.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {homestay.amenities.map((amenity, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button className="w-full">
                    Book Homestay
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="workshops" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {workshops.map((workshop) => (
              <Card key={workshop.id}>
                <CardContent className="p-6">
                  <div className="text-4xl mb-4 text-center">{workshop.image}</div>
                  <h3 className="text-xl mb-2">{workshop.name}</h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    Instructor: {workshop.instructor}
                  </p>
                  <p className="text-sm text-muted-foreground mb-1">
                    Duration: {workshop.duration}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Max participants: {workshop.participants}
                  </p>
                  
                  <p className="text-gray-600 mb-4">{workshop.description}</p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-blue-600">{workshop.price}</span>
                    <Badge variant="secondary">Available</Badge>
                  </div>
                  
                  <Button className="w-full">
                    Join Workshop
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="guides" className="space-y-6">
          <div className="mb-6">
            <h2 className="text-2xl mb-2">Local Cultural Guides</h2>
            <p className="text-muted-foreground">
              Connect with experienced local guides for authentic monastery tours and cultural experiences
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {guides.map((guide) => (
              <Card key={guide.id} className="overflow-hidden">
                <div className="flex gap-4 p-6">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-2xl">
                      {guide.name.charAt(0)}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl">{guide.name}</h3>
                      <Badge 
                        variant={guide.availability === 'Available' ? 'default' : 'secondary'}
                        className={guide.availability === 'Available' ? 'bg-green-600' : ''}
                      >
                        {guide.availability}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-muted-foreground">
                        ⭐ {guide.rating} ({guide.reviews} reviews)
                      </span>
                      <span className="text-sm text-muted-foreground">
                        • {guide.experience} experience
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{guide.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-muted-foreground">Languages:</span>
                        {guide.languages.slice(0, 2).map((lang, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {lang}
                          </Badge>
                        ))}
                        {guide.languages.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{guide.languages.length - 2} more
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-muted-foreground">Specialties:</span>
                        {guide.specialties.slice(0, 2).map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-green-600">{guide.price}</span>
                      
                      <Button
                        onClick={() => {
                          if (guide.availability === 'Available') {
                            alert(`Contact ${guide.name} at ${guide.phone} to book your cultural tour!`);
                          }
                        }}
                        disabled={guide.availability !== 'Available'}
                        className="ml-2"
                      >
                        {guide.availability === 'Available' ? 'Contact Guide' : 'Not Available'}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>🎯 Why Book a Local Guide?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl mb-2">🏛️</div>
                  <h4 className="font-medium mb-2">Authentic Experiences</h4>
                  <p className="text-sm text-muted-foreground">
                    Access to restricted areas and insider knowledge of monastery traditions
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🗣️</div>
                  <h4 className="font-medium mb-2">Language Bridge</h4>
                  <p className="text-sm text-muted-foreground">
                    Communicate with monks and locals, understand ceremonies and rituals
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🌟</div>
                  <h4 className="font-medium mb-2">Personalized Tours</h4>
                  <p className="text-sm text-muted-foreground">
                    Customized itineraries based on your interests and spiritual goals
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volunteer" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>🧹 Monastery Maintenance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Help maintain the sacred spaces through cleaning and basic upkeep work.</p>
                <div className="space-y-2 text-sm mb-4">
                  <p>📅 Every weekend</p>
                  <p>⏰ 6:00 AM - 9:00 AM</p>
                  <p>👥 5-10 volunteers needed</p>
                </div>
                <Button className="w-full">Volunteer for Maintenance</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>🌱 Eco-Tourism Treks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Guide eco-conscious tourists on sustainable treks around monasteries.</p>
                <div className="space-y-2 text-sm mb-4">
                  <p>📅 Flexible schedule</p>
                  <p>⏰ Full day commitment</p>
                  <p>👥 2-3 guides per trek</p>
                </div>
                <Button className="w-full">Become Eco-Guide</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>📚 Teaching Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Help local children with English and basic computer skills.</p>
                <div className="space-y-2 text-sm mb-4">
                  <p>📅 Weekdays</p>
                  <p>⏰ 3:00 PM - 5:00 PM</p>
                  <p>👥 Native speakers preferred</p>
                </div>
                <Button className="w-full">Support Education</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>🎭 Cultural Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Help document oral histories, traditional songs, and cultural practices.</p>
                <div className="space-y-2 text-sm mb-4">
                  <p>📅 Project-based</p>
                  <p>⏰ Flexible hours</p>
                  <p>👥 Media skills appreciated</p>
                </div>
                <Button className="w-full">Document Culture</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="community" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>🙏 Gratitude & Blessing Wall</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                <Textarea
                  placeholder="Share your gratitude, experience, or reflection..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button onClick={postGratitudeNote} disabled={!newNote.trim()}>
                  Post Gratitude Note
                </Button>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg">Recent Notes</h4>
                {notes.map((note) => (
                  <div key={note.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{note.author}</p>
                        <p className="text-sm text-muted-foreground">{note.date}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700">{note.message}</p>
                    
                    {note.replies.length > 0 && (
                      <div className="ml-4 space-y-2">
                        {note.replies.map((reply, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{reply.author}</span>
                              {reply.isMonk && <Badge variant="outline" className="text-xs">Monk</Badge>}
                              {reply.isLocal && <Badge variant="secondary" className="text-xs">Local</Badge>}
                            </div>
                            <p className="text-sm">{reply.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}