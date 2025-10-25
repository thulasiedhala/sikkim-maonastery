import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Users, Clock, Calendar, MapPin, Edit, Trash2, Plus, User } from 'lucide-react';

interface Workshop {
  id: string;
  title: string;
  instructor: string;
  date: string;
  time: string;
  duration: string;
  description: string;
  monastery: string;
  maxParticipants: number;
  currentParticipants: number;
  price: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  requirements: string;
}

export function WorkshopManager() {
  const [workshops, setWorkshops] = useState<Workshop[]>([
    {
      id: '1',
      title: 'Meditation Fundamentals',
      instructor: 'Lama Tenzin',
      date: '2024-02-20',
      time: '10:00',
      duration: '2 hours',
      description: 'Learn the basics of Buddhist meditation practices',
      monastery: 'Rumtek Monastery',
      maxParticipants: 20,
      currentParticipants: 12,
      price: 30,
      status: 'upcoming',
      requirements: 'None - suitable for beginners'
    },
    {
      id: '2',
      title: 'Traditional Thangka Painting',
      instructor: 'Artist Pemba',
      date: '2024-02-25',
      time: '14:00',
      duration: '4 hours',
      description: 'Introduction to the sacred art of Thangka painting',
      monastery: 'Pemayangtse Monastery',
      maxParticipants: 10,
      currentParticipants: 8,
      price: 75,
      status: 'upcoming',
      requirements: 'Basic drawing skills recommended'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    instructor: '',
    date: '',
    time: '',
    duration: '',
    description: '',
    monastery: '',
    maxParticipants: '',
    price: '',
    requirements: ''
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
    if (editingWorkshop) {
      setWorkshops(workshops.map(w => 
        w.id === editingWorkshop.id 
          ? { 
              ...w, 
              ...formData, 
              maxParticipants: parseInt(formData.maxParticipants), 
              price: parseFloat(formData.price),
              currentParticipants: editingWorkshop.currentParticipants
            }
          : w
      ));
    } else {
      const newWorkshop: Workshop = {
        id: Date.now().toString(),
        ...formData,
        maxParticipants: parseInt(formData.maxParticipants),
        price: parseFloat(formData.price),
        currentParticipants: 0,
        status: 'upcoming' as const
      };
      setWorkshops([...workshops, newWorkshop]);
    }
    setIsDialogOpen(false);
    setEditingWorkshop(null);
    setFormData({
      title: '',
      instructor: '',
      date: '',
      time: '',
      duration: '',
      description: '',
      monastery: '',
      maxParticipants: '',
      price: '',
      requirements: ''
    });
  };

  const handleEdit = (workshop: Workshop) => {
    setEditingWorkshop(workshop);
    setFormData({
      title: workshop.title,
      instructor: workshop.instructor,
      date: workshop.date,
      time: workshop.time,
      duration: workshop.duration,
      description: workshop.description,
      monastery: workshop.monastery,
      maxParticipants: workshop.maxParticipants.toString(),
      price: workshop.price.toString(),
      requirements: workshop.requirements
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setWorkshops(workshops.filter(w => w.id !== id));
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Workshop Management</h2>
          <p className="text-gray-600">Manage monastery workshops and classes</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingWorkshop(null);
              setFormData({
                title: '',
                instructor: '',
                date: '',
                time: '',
                duration: '',
                description: '',
                monastery: '',
                maxParticipants: '',
                price: '',
                requirements: ''
              });
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Workshop
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingWorkshop ? 'Edit Workshop' : 'Add New Workshop'}
              </DialogTitle>
              <DialogDescription>
                {editingWorkshop ? 'Update workshop details' : 'Create a new workshop session'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Workshop Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter workshop title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="instructor">Instructor</Label>
                <Input
                  id="instructor"
                  value={formData.instructor}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  placeholder="Instructor name"
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 2 hours"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
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
                <Label htmlFor="maxParticipants">Max Participants</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                  placeholder="20"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Workshop description"
                  required
                />
              </div>
              <div>
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  placeholder="Prerequisites or requirements"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingWorkshop ? 'Update' : 'Create'} Workshop
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
        {workshops.map((workshop) => (
          <Card key={workshop.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{workshop.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {workshop.monastery}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(workshop.status)}>
                  {workshop.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                {workshop.instructor}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                {new Date(workshop.date).toLocaleDateString()} at {workshop.time}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                {workshop.duration}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                {workshop.currentParticipants}/{workshop.maxParticipants} participants
              </div>
              <div className="text-sm font-medium text-green-600">
                ${workshop.price}
              </div>
              <p className="text-sm text-gray-700 line-clamp-2">
                {workshop.description}
              </p>
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(workshop)}
                  className="flex-1"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(workshop.id)}
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