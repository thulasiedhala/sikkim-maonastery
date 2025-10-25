import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Video, Calendar, Clock, Users, Eye, Edit, Trash2, Plus, Globe } from 'lucide-react';

interface Livestream {
  id: string;
  title: string;
  description: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: string;
  monastery: string;
  streamUrl: string;
  thumbnailUrl: string;
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  viewers: number;
  category: string;
  isRecorded: boolean;
  language: string;
}

export function LivestreamManager() {
  const [livestreams, setLivestreams] = useState<Livestream[]>([
    {
      id: '1',
      title: 'Morning Prayers Live',
      description: 'Join us for the daily morning prayer ceremony',
      scheduledDate: '2024-02-16',
      scheduledTime: '06:00',
      duration: '1 hour',
      monastery: 'Rumtek Monastery',
      streamUrl: 'https://youtube.com/watch?v=example1',
      thumbnailUrl: 'https://images.unsplash.com/photo-1544895813-e8b3edc5df7c?w=400',
      status: 'scheduled',
      viewers: 0,
      category: 'Daily Prayers',
      isRecorded: true,
      language: 'Tibetan'
    },
    {
      id: '2',
      title: 'Meditation Session',
      description: 'Guided meditation session for beginners',
      scheduledDate: '2024-02-17',
      scheduledTime: '18:00',
      duration: '45 minutes',
      monastery: 'Pemayangtse Monastery',
      streamUrl: 'https://youtube.com/watch?v=example2',
      thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      status: 'scheduled',
      viewers: 0,
      category: 'Meditation',
      isRecorded: true,
      language: 'English'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLivestream, setEditingLivestream] = useState<Livestream | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduledDate: '',
    scheduledTime: '',
    duration: '',
    monastery: '',
    streamUrl: '',
    thumbnailUrl: '',
    category: '',
    language: '',
    isRecorded: true
  });

  const monasteries = [
    'Rumtek Monastery',
    'Pemayangtse Monastery',
    'Tashiding Monastery',
    'Enchey Monastery',
    'Dubdi Monastery'
  ];

  const categories = [
    'Daily Prayers',
    'Meditation',
    'Teachings',
    'Festivals',
    'Special Ceremonies',
    'Cultural Events'
  ];

  const languages = [
    'Tibetan',
    'English',
    'Hindi',
    'Nepali',
    'Mixed'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLivestream) {
      setLivestreams(livestreams.map(stream => 
        stream.id === editingLivestream.id 
          ? { 
              ...stream, 
              ...formData,
              viewers: editingLivestream.viewers,
              status: editingLivestream.status
            }
          : stream
      ));
    } else {
      const newLivestream: Livestream = {
        id: Date.now().toString(),
        ...formData,
        status: 'scheduled' as const,
        viewers: 0
      };
      setLivestreams([...livestreams, newLivestream]);
    }
    setIsDialogOpen(false);
    setEditingLivestream(null);
    setFormData({
      title: '',
      description: '',
      scheduledDate: '',
      scheduledTime: '',
      duration: '',
      monastery: '',
      streamUrl: '',
      thumbnailUrl: '',
      category: '',
      language: '',
      isRecorded: true
    });
  };

  const handleEdit = (livestream: Livestream) => {
    setEditingLivestream(livestream);
    setFormData({
      title: livestream.title,
      description: livestream.description,
      scheduledDate: livestream.scheduledDate,
      scheduledTime: livestream.scheduledTime,
      duration: livestream.duration,
      monastery: livestream.monastery,
      streamUrl: livestream.streamUrl,
      thumbnailUrl: livestream.thumbnailUrl,
      category: livestream.category,
      language: livestream.language,
      isRecorded: livestream.isRecorded
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setLivestreams(livestreams.filter(stream => stream.id !== id));
  };

  const updateStatus = (id: string, newStatus: Livestream['status']) => {
    setLivestreams(livestreams.map(stream => 
      stream.id === id ? { ...stream, status: newStatus } : stream
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'live': return 'bg-red-100 text-red-800';
      case 'ended': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Daily Prayers': return 'bg-orange-100 text-orange-800';
      case 'Meditation': return 'bg-purple-100 text-purple-800';
      case 'Teachings': return 'bg-green-100 text-green-800';
      case 'Festivals': return 'bg-pink-100 text-pink-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Livestream Management</h2>
          <p className="text-gray-600">Manage monastery livestreams and recordings</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingLivestream(null);
              setFormData({
                title: '',
                description: '',
                scheduledDate: '',
                scheduledTime: '',
                duration: '',
                monastery: '',
                streamUrl: '',
                thumbnailUrl: '',
                category: '',
                language: '',
                isRecorded: true
              });
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Schedule Stream
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingLivestream ? 'Edit Livestream' : 'Schedule New Livestream'}
              </DialogTitle>
              <DialogDescription>
                {editingLivestream ? 'Update livestream details' : 'Schedule a new livestream event'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Stream Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter stream title"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="scheduledDate">Date</Label>
                  <Input
                    id="scheduledDate"
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="scheduledTime">Time</Label>
                  <Input
                    id="scheduledTime"
                    type="time"
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 1 hour"
                  required
                />
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
                <Label htmlFor="language">Language</Label>
                <select
                  id="language"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select language</option>
                  {languages.map(language => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="streamUrl">Stream URL</Label>
                <Input
                  id="streamUrl"
                  value={formData.streamUrl}
                  onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                  required
                />
              </div>
              <div>
                <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
                <Input
                  id="thumbnailUrl"
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  placeholder="https://..."
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Stream description"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isRecorded"
                  checked={formData.isRecorded}
                  onChange={(e) => setFormData({ ...formData, isRecorded: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="isRecorded">Record Stream</Label>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingLivestream ? 'Update' : 'Schedule'} Stream
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
        {livestreams.map((stream) => (
          <Card key={stream.id} className="overflow-hidden">
            <div className="aspect-video bg-gray-100 overflow-hidden relative">
              <img 
                src={stream.thumbnailUrl} 
                alt={stream.title}
                className="w-full h-full object-cover"
              />
              {stream.status === 'live' && (
                <Badge className="absolute top-2 left-2 bg-red-600 text-white">
                  ● LIVE
                </Badge>
              )}
            </div>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{stream.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {stream.monastery}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(stream.status)}>
                  {stream.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge className={getCategoryColor(stream.category)}>
                {stream.category}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                {new Date(stream.scheduledDate).toLocaleDateString()} at {stream.scheduledTime}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                {stream.duration}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Globe className="w-4 h-4" />
                {stream.language}
              </div>
              {stream.status === 'live' && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <Eye className="w-4 h-4" />
                  {stream.viewers} viewers
                </div>
              )}
              <p className="text-sm text-gray-700 line-clamp-2">
                {stream.description}
              </p>
              <div className="flex gap-2 pt-2">
                {stream.status === 'scheduled' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus(stream.id, 'live')}
                    className="flex-1 text-green-600 hover:bg-green-50"
                  >
                    Start Live
                  </Button>
                )}
                {stream.status === 'live' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus(stream.id, 'ended')}
                    className="flex-1 text-red-600 hover:bg-red-50"
                  >
                    End Stream
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(stream)}
                >
                  <Edit className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(stream.id)}
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