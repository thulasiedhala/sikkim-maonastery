import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { FestivalManager } from './admin/FestivalManager';
import { ShopManager } from './admin/ShopManager';
import { WorkshopManager } from './admin/WorkshopManager';
import { EventManager } from './admin/EventManager';
import { LivestreamManager } from './admin/LivestreamManager';
import { Badge } from './ui/badge';
import { Calendar, ShoppingBag, Users, Video, Star, ArrowLeft } from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (page: any) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total Festivals', value: 12, icon: Calendar, color: 'bg-orange-500' },
    { label: 'Shop Items', value: 48, icon: ShoppingBag, color: 'bg-green-500' },
    { label: 'Workshops', value: 15, icon: Users, color: 'bg-blue-500' },
    { label: 'Live Events', value: 8, icon: Video, color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => onNavigate('home')}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage monastery content and activities</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-saffron-100 text-saffron-800">
            Administrator
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white shadow-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="festivals">Festivals</TabsTrigger>
            <TabsTrigger value="shop">Shop</TabsTrigger>
            <TabsTrigger value="workshops">Workshops</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="livestreams">Livestreams</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates across all modules</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="font-medium">Losar Festival Updated</p>
                      <p className="text-sm text-gray-600">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <ShoppingBag className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium">New Prayer Beads Added</p>
                      <p className="text-sm text-gray-600">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Users className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Meditation Workshop Scheduled</p>
                      <p className="text-sm text-gray-600">6 hours ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={() => setActiveTab('festivals')} 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Add New Festival
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('shop')} 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Add Shop Item
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('workshops')} 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Create Workshop
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('livestreams')} 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Schedule Livestream
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="festivals">
            <FestivalManager />
          </TabsContent>

          <TabsContent value="shop">
            <ShopManager />
          </TabsContent>

          <TabsContent value="workshops">
            <WorkshopManager />
          </TabsContent>

          <TabsContent value="events">
            <EventManager />
          </TabsContent>

          <TabsContent value="livestreams">
            <LivestreamManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}