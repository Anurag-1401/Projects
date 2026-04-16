import React, { useState,useEffect, useMemo } from 'react';
import { useData } from '@/hooks/DataContext'
import { HostelManagement } from './HostelManagement';
import { RoomManagement } from './RoomManagement';
import { Tabs, TabsList, TabsTrigger,TabsContent } from '../ui/tabs';

export const RoomnHostelManagement: React.FC = () => {
  const {loading} = useData();

  const [tab, setTab] = useState("rooms");


if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
};

  return (
    <div className="space-y-6">
      <Tabs value={tab} onValueChange={setTab}  className="space-y-12">
          <TabsList className="grid grid-cols-2 w-full bg-gray-100 p-1 rounded-lg">        
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="hostels">Hostels</TabsTrigger>
          </TabsList>
          

    <TabsContent value='rooms' className='space-y-6'>
      <RoomManagement />
  </TabsContent>

  <TabsContent value='hostels' className='space-y-6'>
      <HostelManagement />
  </TabsContent>

  </Tabs>
    </div>
  );
};