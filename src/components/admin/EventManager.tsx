import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Calendar, Clock, MapPin, Users, Edit, Trash2, Plus, Bell } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  monastery: string;
  category: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  isPublic: boolean;
  expectedAttendees: number;
  contactInfo: string;
}

export function EventManager() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Morning Prayer Ceremony',
      date: '2024-02-15',
      time: '06:00',
      description: 'Daily morning prayers and chanting session',
      monastery: 'Rumtek Monastery',
      category: 'Religious Ceremony',
      status: 'upcoming',
      isPublic: true,
      expectedAttendees: 50,
      contactInfo: 'contact@rumtek.org'
    },
    {
      id: '2',
      title: 'Cultural Heritage Talk',
      date: '2024-02-18',
      time: '15:00',
      description: 'Educational session about Sikkimese Buddhist culture',
      monastery: 'Pemayangtse Monastery',
      category: 'Educational',
      status: 'upcoming',
      isPublic: true,
      expectedAttendees: 30,
      contactInfo: 'info@pemayangtse.org'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    description: '',
    monastery: '',
    category: '',
    expectedAttendees: '',
    contactInfo: '',
    isPublic: true
  });

  const monasteries = [
    'Rumtek Monastery',
    'Pemayangtse Monastery',
    'Tashiding Monastery',
    'Enchey Monastery',
    'Dubdi Monastery'
  ];

  const categories = [
    'Religious Ceremony',
    'Educational',
    'Cultural',
    'Community Service',
    'Meditation Session',
    'Special Occasion'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      setEvents(events.map(event => 
        event.id === editingEvent.id 
          ? { 
              ...event, 
              ...formData, 
              expectedAttendees: parseInt(formData.expectedAttendees),
              status: editingEvent.status
            }
          : event
      ));
    } else {
      const newEvent: Event = {
        id: Date.now().toString(),
        ...formData,
        expectedAttendees: parseInt(formData.expectedAttendees),
        status: 'upcoming' as const
      };
      setEvents([...events, newEvent]);
    }
    setIsDialogOpen(false);
    setEditingEvent(null);
    setFormData({
      title: '',
      date: '',
      time: '',
      description: '',
      monastery: '',
      category: '',
      expectedAttendees: '',
      contactInfo: '',
      isPublic: true
    });
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      description: event.description,
      monastery: event.monastery,
      category: event.category,
      expectedAttendees: event.expectedAttendees.toString(),
      contactInfo: event.contactInfo,
      isPublic: event.isPublic
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Religious Ceremony': return 'bg-orange-100 text-orange-800';
      case 'Educational': return 'bg-purple-100 text-purple-800';
      case 'Cultural': return 'bg-pink-100 text-pink-800';
      case 'Community Service': return 'bg-green-100 text-green-800';
      case 'Meditation Session': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Event Management</h2>
          <p className="text-gray-600">Manage upcoming monastery events and activities</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingEvent(null);
              setFormData({
                title: '',
                date: '',
                time: '',
                description: '',
                monastery: '',
                category: '',
                expectedAttendees: '',
                contactInfo: '',
                isPublic: true
              });
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </DialogTitle>
              <DialogDescription>
                {editingEvent ? 'Update event details' : 'Create a new monastery event'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter event title"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="monastery">Monastery</Label>
                <select
                  id="monastery"
                  value={formData.monastery}
                  onChange={(e) => setFormData({ ...formData, monastery: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select monastery</option>
                  {monasteries.map(monastery => (
                    <option key={monastery} value={monastery}>
                      {monastery}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="expectedAttendees">Expected Attendees</Label>
                <Input
                  id="expectedAttendees"
                  type="number"
                  value={formData.expectedAttendees}
                  onChange={(e) => setFormData({ ...formData, expectedAttendees: e.target.value })}
                  placeholder="50"
                  required
                />
              </div>
              <div>
                <Label htmlFor="contactInfo">Contact Information</Label>
                <Input
                  id="contactInfo"
                  value={formData.contactInfo}
                  onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                  placeholder="contact@monastery.org"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Event description"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="isPublic">Public Event</Label>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingEvent ? 'Update' : 'Create'} Event
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {event.monastery}
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge className={getStatusColor(event.status)}>
                    {event.status}
                  </Badge>
                  {event.isPublic && (
                    <Badge variant="outline" className="text-xs">
                      Public
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge className={getCategoryColor(event.category)}>
                {event.category}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                {new Date(event.date).toLocaleDateString()} at {event.time}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                Expected: {event.expectedAttendees} attendees
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Bell className="w-4 h-4" />
                {event.contactInfo}
              </div>
              <p className="text-sm text-gray-700 line-clamp-2">
                {event.description}
              </p>
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(event)}
                  className="flex-1"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(event.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}