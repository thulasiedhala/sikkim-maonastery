import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { ShoppingBag, Edit, Trash2, Plus, Package, DollarSign } from 'lucide-react';

interface ShopItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  monastery: string;
  stock: number;
  imageUrl: string;
  status: 'active' | 'inactive';
}

export function ShopManager() {
  const [items, setItems] = useState<ShopItem[]>([
    {
      id: '1',
      name: 'Tibetan Prayer Beads',
      price: 25,
      description: 'Traditional 108-bead mala for meditation and prayer',
      category: 'Religious Items',
      monastery: 'Rumtek Monastery',
      stock: 15,
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      status: 'active'
    },
    {
      id: '2',
      name: 'Handwoven Khada',
      price: 12,
      description: 'Traditional ceremonial scarf used in Tibetan culture',
      category: 'Textiles',
      monastery: 'Pemayangtse Monastery',
      stock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0b022f2c888?w=400',
      status: 'active'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShopItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    monastery: '',
    stock: '',
    imageUrl: ''
  });

  const categories = [
    'Religious Items',
    'Textiles',
    'Handicrafts',
    'Books',
    'Incense',
    'Artwork',
    'Jewelry'
  ];

  const monasteries = [
    'Rumtek Monastery',
    'Pemayangtse Monastery',
    'Tashiding Monastery',
    'Enchey Monastery',
    'Dubdi Monastery'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setItems(items.map(item => 
        item.id === editingItem.id 
          ? { 
              ...item, 
              ...formData, 
              price: parseFloat(formData.price), 
              stock: parseInt(formData.stock),
              status: editingItem.status
            }
          : item
      ));
    } else {
      const newItem: ShopItem = {
        id: Date.now().toString(),
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        status: 'active' as const
      };
      setItems([...items, newItem]);
    }
    setIsDialogOpen(false);
    setEditingItem(null);
    setFormData({
      name: '',
      price: '',
      description: '',
      category: '',
      monastery: '',
      stock: '',
      imageUrl: ''
    });
  };

  const handleEdit = (item: ShopItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      description: item.description,
      category: item.category,
      monastery: item.monastery,
      stock: item.stock.toString(),
      imageUrl: item.imageUrl
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const toggleStatus = (id: string) => {
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' }
        : item
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Shop Management</h2>
          <p className="text-gray-600">Manage monastery store items and inventory</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingItem(null);
              setFormData({
                name: '',
                price: '',
                description: '',
                category: '',
                monastery: '',
                stock: '',
                imageUrl: ''
              });
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </DialogTitle>
              <DialogDescription>
                {editingItem ? 'Update item details' : 'Add a new item to the monastery store'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter item name"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="0"
                    required
                  />
                </div>
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
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
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
                  placeholder="Item description"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingItem ? 'Update' : 'Create'} Item
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
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="aspect-video bg-gray-100 overflow-hidden">
              <img 
                src={item.imageUrl} 
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {item.category} • {item.monastery}
                  </CardDescription>
                </div>
                <Badge 
                  className={item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                >
                  {item.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  ${item.price}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Package className="w-4 h-4" />
                  Stock: {item.stock}
                </div>
              </div>
              <p className="text-sm text-gray-700 line-clamp-2">
                {item.description}
              </p>
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(item)}
                  className="flex-1"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleStatus(item.id)}
                  className={item.status === 'active' ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}
                >
                  {item.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(item.id)}
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