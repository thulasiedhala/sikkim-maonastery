import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Calendar, MapPin, Users, Edit, Trash2, Plus } from 'lucide-react';

interface Festival {
  id: string;
  name: string;
  date: string;
  description: string;
  location: string;
  monastery: string;
  status: 'upcoming' | 'live' | 'completed';
  participants: number;
  livestreamUrl?: string;
}

export function FestivalManager() {
  const [festivals, setFestivals] = useState<Festival[]>([
    {
      id: '1',
      name: 'Losar Festival',
      date: '2024-02-10',
      description: 'Tibetan New Year celebration with traditional prayers and ceremonies',
      location: 'Rumtek Monastery',
      monastery: 'Rumtek Monastery',
      status: 'upcoming',
      participants: 245,
      livestreamUrl: 'https://youtube.com/watch?v=example'
    },
    {
      id: '2',
      name: 'Buddha Jayanti',
      date: '2024-05-23',
      description: 'Celebration of Buddha\'s birthday with special prayers',
      location: 'Pemayangtse Monastery',
      monastery: 'Pemayangtse Monastery',
      status: 'completed',
      participants: 180
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFestival, setEditingFestival] = useState<Festival | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    description: '',
    location: '',
    monastery: '',
    livestreamUrl: ''
  });

  const monasteries = [
    'Rumtek Monastery',
    'Pemayangtse Monastery',
    'Tashiding Monastery',
    'Enchey Monastery',
    'Dubdi Monastery'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFestival) {
      setFestivals(festivals.map(f => 
        f.id === editingFestival.id 
          ? { ...f, ...formData, participants: editingFestival.participants }
          : f
      ));
    } else {
      const newFestival: Festival = {
        id: Date.now().toString(),
        ...formData,
        status: 'upcoming' as const,
        participants: 0
      };
      setFestivals([...festivals, newFestival]);
    }
    setIsDialogOpen(false);
    setEditingFestival(null);
    setFormData({
      name: '',
      date: '',
      description: '',
      location: '',
      monastery: '',
      livestreamUrl: ''
    });
  };

  const handleEdit = (festival: Festival) => {
    setEditingFestival(festival);
    setFormData({
      name: festival.name,
      date: festival.date,
      description: festival.description,
      location: festival.location,
      monastery: festival.monastery,
      livestreamUrl: festival.livestreamUrl || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setFestivals(festivals.filter(f => f.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'live': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Festival Management</h2>
          <p className="text-gray-600">Manage monastery festivals and celebrations</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingFestival(null);
              setFormData({
                name: '',
                date: '',
                description: '',
                location: '',
                monastery: '',
                livestreamUrl: ''
              });
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Festival
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingFestival ? 'Edit Festival' : 'Add New Festival'}
              </DialogTitle>
              <DialogDescription>
                {editingFestival ? 'Update festival details' : 'Create a new festival event'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Festival Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter festival name"
                  required
                />
              </div>
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
                <Label htmlFor="monastery">Monastery</Label>
                <select
                  id="monastery"
                  value={formData.monastery}
                  onChange={(e) => setFormData({ ...formData, monastery: e.target.value, location: e.target.value })}
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Festival description"
                  required
                />
              </div>
              <div>
                <Label htmlFor="livestreamUrl">Livestream URL (Optional)</Label>
                <Input
                  id="livestreamUrl"
                  value={formData.livestreamUrl}
                  onChange={(e) => setFormData({ ...formData, livestreamUrl: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingFestival ? 'Update' : 'Create'} Festival
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
        {festivals.map((festival) => (
          <Card key={festival.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{festival.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {festival.monastery}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(festival.status)}>
                  {festival.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                {new Date(festival.date).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                {festival.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                {festival.participants} participants
              </div>
              <p className="text-sm text-gray-700 line-clamp-2">
                {festival.description}
              </p>
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(festival)}
                  className="flex-1"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(festival.id)}
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