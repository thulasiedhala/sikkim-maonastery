import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { motion } from 'motion/react';
import { Page } from '../App';

interface FestivalsEventsProps {
  onNavigate: (page: Page) => void;
}

const festivals = [
  {
    id: 'losar',
    name: 'Losar (Tibetan New Year)',
    date: '2024-02-10',
    monastery: 'Rumtek Monastery',
    description: 'The most important festival in Tibetan Buddhism, celebrating the new year with prayers, dances, and rituals.',
    status: 'upcoming',
    hasLivestream: true,
    image: '🎊'
  },
  {
    id: 'saga-dawa',
    name: 'Saga Dawa',
    date: '2024-05-23',
    monastery: 'Tashiding Monastery',
    description: 'Sacred month commemorating Buddha\'s birth, enlightenment, and parinirvana.',
    status: 'upcoming',
    hasLivestream: true,
    image: '🌸'
  },
  {
    id: 'pang-lhabsol',
    name: 'Pang Lhabsol',
    date: '2024-08-15',
    monastery: 'Enchey Monastery',
    description: 'Unique to Sikkim, celebrating the guardian deity of Mount Kanchenjunga.',
    status: 'past',
    hasLivestream: false,
    image: '🏔️'
  }
];

export function FestivalsEvents({ onNavigate }: FestivalsEventsProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [digitalLampLit, setDigitalLampLit] = useState(false);
  const [reminders, setReminders] = useState<string[]>([]);

  const lightDigitalLamp = () => {
    setDigitalLampLit(true);
    setTimeout(() => setDigitalLampLit(false), 3000);
  };

  const setReminder = (festivalId: string) => {
    if (!reminders.includes(festivalId)) {
      setReminders([...reminders, festivalId]);
    }
  };

  const upcomingFestivals = festivals.filter(f => f.status === 'upcoming');
  const pastFestivals = festivals.filter(f => f.status === 'past');

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl mb-3 sm:mb-4">Sacred Festivals & Events</h1>
        <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
          Experience the spiritual celebrations of Sikkim's monasteries
        </p>
      </div>

      <Tabs defaultValue="calendar" className="mb-6 sm:mb-8">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
          <TabsTrigger value="calendar" className="text-xs sm:text-sm px-2 py-2">
            <span className="hidden sm:inline">Calendar</span>
            <span className="sm:hidden">📅</span>
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="text-xs sm:text-sm px-2 py-2">
            <span className="hidden sm:inline">Upcoming</span>
            <span className="sm:hidden">📆</span>
          </TabsTrigger>
          <TabsTrigger value="livestream" className="text-xs sm:text-sm px-2 py-2">
            <span className="hidden sm:inline">Live Streams</span>
            <span className="sm:hidden">📺</span>
          </TabsTrigger>
          <TabsTrigger value="participate" className="text-xs sm:text-sm px-2 py-2">
            <span className="hidden sm:inline">Participate</span>
            <span className="sm:hidden">🪔</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Festival Calendar</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border mx-auto"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Festival Details</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                {selectedDate && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {selectedDate.toDateString()}
                    </p>
                    <div className="text-center py-6 sm:py-8">
                      <div className="text-3xl sm:text-4xl mb-2">📅</div>
                      <p className="text-sm sm:text-base">No festivals on this date</p>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Check upcoming festivals in other tabs
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4 sm:space-y-6">
          <div className="space-y-3 sm:space-y-4">
            {upcomingFestivals.map((festival) => (
              <Card key={festival.id} className="overflow-hidden">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
                    <div className="flex items-start gap-3 sm:gap-4 flex-1">
                      <div className="text-2xl sm:text-3xl lg:text-4xl flex-shrink-0">{festival.image}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-medium">{festival.name}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">{festival.monastery}</p>
                        <p className="text-xs sm:text-sm text-primary font-medium">{new Date(festival.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap sm:flex-col sm:items-end">
                      {festival.hasLivestream && (
                        <Badge variant="secondary" className="text-xs">🔴 Live Stream</Badge>
                      )}
                      <Badge variant="outline" className="text-xs">Upcoming</Badge>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">{festival.description}</p>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      onClick={() => setReminder(festival.id)}
                      variant={reminders.includes(festival.id) ? "default" : "outline"}
                      size="sm"
                      className="flex-1 sm:flex-none text-xs sm:text-sm"
                    >
                      {reminders.includes(festival.id) ? '✓ Reminder Set' : '🔔 Set Reminder'}
                    </Button>
                    {festival.hasLivestream && (
                      <Button size="sm" variant="secondary" className="flex-1 sm:flex-none text-xs sm:text-sm">
                        📺 Watch Live
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="livestream" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Live Festival Streams</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="space-y-4 sm:space-y-6">
                <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                  <div className="text-center text-white px-4">
                    <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">📺</div>
                    <p className="text-base sm:text-lg lg:text-xl mb-2">No Live Streams Currently</p>
                    <p className="text-gray-400 text-sm sm:text-base">Next stream: Losar Festival - Feb 10, 2024</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {upcomingFestivals.filter(f => f.hasLivestream).map((festival) => (
                    <Card key={festival.id}>
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center gap-2 sm:gap-3 mb-2">
                          <div className="text-xl sm:text-2xl">{festival.image}</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm sm:text-base font-medium truncate">{festival.name}</h4>
                            <p className="text-xs text-muted-foreground truncate">{festival.monastery}</p>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm mb-3">{new Date(festival.date).toLocaleDateString()}</p>
                        <Button size="sm" className="w-full text-xs sm:text-sm">
                          Set Stream Reminder
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="participate" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Virtual Participation</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="text-center space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-lg sm:text-xl mb-3 sm:mb-4">Light a Digital Butter Lamp</h3>
                  <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base px-2">
                    Participate in the sacred tradition by lighting a virtual butter lamp. 
                    Your intention joins thousands of others in creating positive energy.
                  </p>
                  
                  <motion.div
                    className="inline-block relative cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={lightDigitalLamp}
                  >
                    <div className="text-6xl sm:text-7xl lg:text-8xl mb-3 sm:mb-4">
                      {digitalLampLit ? '🔥' : '🪔'}
                    </div>
                    {digitalLampLit && (
                      <motion.div
                        className="absolute -top-2 sm:-top-4 left-1/2 transform -translate-x-1/2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <div className="bg-orange-100 text-orange-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                          ✨ Lamp lit with loving intention
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                  
                  <div>
                    <Button 
                      onClick={lightDigitalLamp}
                      disabled={digitalLampLit}
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      {digitalLampLit ? 'Lamp is Glowing...' : 'Light Butter Lamp'}
                    </Button>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 sm:p-6 rounded-lg">
                  <h4 className="mb-2 sm:mb-3 text-sm sm:text-base">🙏 Set Your Intention</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                    As you light the digital lamp, set a positive intention for yourself, 
                    your loved ones, and all sentient beings.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                    <div className="bg-white p-2 rounded">Peace</div>
                    <div className="bg-white p-2 rounded">Compassion</div>
                    <div className="bg-white p-2 rounded">Wisdom</div>
                    <div className="bg-white p-2 rounded">Healing</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}