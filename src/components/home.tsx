'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import EventCard from '@/components/EventCard';
import { Event } from '@/components/EventCard';
import LocationAutocomplete from '@/components/locationautocomplete';

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Rock Festival 2024',
    description: 'The biggest rock festival of the year featuring top artists.',
    startDate: '2024-08-15',
    endDate: '2024-08-17',
    location: 'Madison Square Garden, New York',
    imageUrl: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=250&fit=crop',
    price: 75,
    category: 'music',
    isBookmarked: false,
    isTrending: true,
    ticketsLeft: 12,
    soldOut: false,
  },
  {
    id: '2',
    title: 'NextGen Tech Conference',
    description: 'Discover the latest trends and tools in technology.',
    startDate: '2024-09-22',
    endDate: '2024-09-24',
    location: 'Moscone Center, San Francisco',
    imageUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=250&fit=crop',
    price: 0,
    category: 'technology',
    isBookmarked: true,
    isTrending: false,
    ticketsLeft: 150,
    soldOut: false,
  },
  {
    id: '3',
    title: 'National Basketball Finals',
    description: 'Witness the ultimate championship battle on the court.',
    startDate: '2024-07-30',
    endDate: '2024-07-30',
    location: 'Crypto.com Arena, Los Angeles',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=250&fit=crop',
    price: 120,
    category: 'sports',
    isBookmarked: false,
    isTrending: true,
    ticketsLeft: 0,
    soldOut: true,
  },
  {
    id: '4',
    title: 'Sunset Beach Bash',
    description: 'Chill vibes, live DJs, and food trucks on the beach.',
    startDate: '2024-08-05',
    endDate: '2024-08-05',
    location: 'Malibu Beach, California',
    imageUrl: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=400&h=250&fit=crop',
    price: 35,
    category: 'festival',
    isBookmarked: false,
    isTrending: false,
    ticketsLeft: 5,
    soldOut: false,
  },
];

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  const eventGridRef = useRef<HTMLDivElement>(null);

  const formatDateISO = (dateStr: string) => {
    return dateStr ? new Date(dateStr).toISOString() : '';
  };

  const fetchFilteredEvents = async (): Promise<Event[]> => {
    try {
      const params = new URLSearchParams();

      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedDate) {
        params.append('fromDate', formatDateISO(selectedDate));
        params.append('toDate', formatDateISO(selectedDate));
      }
      if (selectedLocation) params.append('search', selectedLocation);

      const res = await fetch(`/api/events?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch events');

      return await res.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const mergeEvents = (api: Event[], mock: Event[]): Event[] => {
    const uniqueMock = mock.filter(
      (mockEvent) => !api.some((apiEvent) => apiEvent.id === mockEvent.id)
    );
    return [...api, ...uniqueMock];
  };

  const applyFilters = async () => {
    const apiEvents = await fetchFilteredEvents();

    const filteredMockEvents = mockEvents.filter((event) => {
      const matchesCategory = !selectedCategory || event.category === selectedCategory;
      const matchesDate = !selectedDate || event.startDate === selectedDate;
      const matchesLocation =
        !selectedLocation ||
        event.location.toLowerCase().includes(selectedLocation.toLowerCase());
      return matchesCategory && matchesDate && matchesLocation;
    });

    const combined = mergeEvents(apiEvents, filteredMockEvents);

    setFilteredEvents(combined);
    setIsFilterApplied(true);
    eventGridRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedDate('');
    setSelectedLocation('');
    setFilteredEvents([...mockEvents]);
    setIsFilterApplied(false);
  };

  useEffect(() => {
    // Initial load: combine API + mock events
    (async () => {
      const apiEvents = await fetchFilteredEvents();
      const combined = mergeEvents(apiEvents, mockEvents);
      setFilteredEvents(combined);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center bg-gradient-to-r from-black/50 to-black/30">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1500673922987-e212871fec22?w=1920&h=1080&fit=crop')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Discover Events. Book Instantly.
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Find amazing events near you and book your tickets in seconds
          </p>
          <Button 
            size="lg" 
            onClick={() => eventGridRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-[#1D4ED8] hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-xl transition-all hover:scale-105"
          >
            Explore Events
          </Button>
        </div>
      </section>

      {/* Filters Section */}
 <section className="sticky top-16 z-0 bg-white dark:bg-black border-b dark:border-gray-800 shadow-sm py-4">
  <div className="container mx-auto px-4">
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      
      {/* Category */}
      <div className="w-full max-w-sm">
        <Label htmlFor="event-category">Category</Label>
        <select
          id="event-category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                     focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                     dark:bg-gray-900 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white
                     dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="" disabled>
            Select category that best describes your event
          </option>
          {[
            'music', 'sports', 'theatre', 'comedy', 'conference', 'workshop',
            'festival', 'food_drink', 'networking', 'charity', 'family', 'art', 'technology'
          ].map(cat => (
            <option key={cat} value={cat}>
              {cat[0].toUpperCase() + cat.slice(1).replace('_', ' & ')}
            </option>
          ))}
        </select>
      </div>

      {/* Date */}
      <div className="w-full max-w-sm">
        <Label htmlFor="event-date">Date</Label>
        <input
          id="event-date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5
                     dark:bg-gray-900 dark:border-gray-700 dark:text-white"
        />
      </div>

      {/* Location */}
      <div className="w-full max-w-sm space-y-1">
        <Label>Location</Label>
        <LocationAutocomplete
          onSelect={(loc) => {
            const readable = `${loc.name}, ${loc.city ?? ''}, ${loc.country ?? ''}`.trim();
            setSelectedLocation(readable);
          }}
        />
      </div>

      {/* Button */}
      <div className="w-full max-w-sm">
        <Button
          onClick={isFilterApplied ? clearFilters : applyFilters}
          className="bg-[#1D4ED8] text-white hover:bg-blue-700 w-full"
        >
          {isFilterApplied ? 'Clear Filters' : 'Apply Filters'}
        </Button>
      </div>
    </div>
  </div>
</section>
      {/* Events Grid */}
      <section ref={eventGridRef} className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#111827] mb-8">Featured Events</h2>
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No events match your filters.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
