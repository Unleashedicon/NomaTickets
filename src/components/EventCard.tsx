import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Heart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from "sonner";
import { Trash2 } from 'lucide-react';

export interface TicketClass {
  id: string;
  name: string;
  price: number;
  quantity: number;
   currency?: string
}
export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
  coordinates?: [number, number]; // [longitude, latitude]
  imageUrl: string;
  category: string;
  price: number;
  isBookmarked?: boolean;
  isTrending?: boolean;
  ticketsLeft?: number;
  soldOut?: boolean;
  ticketClasses?: TicketClass[];
}
interface EventCardProps {
  event: Event;
  onDelete?: (eventId: string) => void;
  showDelete?: boolean;
}


const EventCard = ({ event, onDelete, showDelete }: EventCardProps) => {
  const [isBookmarked, setIsBookmarked] = useState(event.isBookmarked || false);
  const { data: session } = useSession();

const formatPrice = () => {
  const priorities = ['regular', 'vip', 'vvip'];

  if (event.ticketClasses && event.ticketClasses.length > 0) {
for (const tier of priorities) {
  const tc = event.ticketClasses.find(
    tc => tc.name.toLowerCase() === tier && tc.price >= 0
  );
  if (tc) {
    const currency = tc.currency ?? '$';
    return tc.price === 0 ? 'Free' : `${currency}${tc.price.toFixed(2)}`;
  }
    }

    // Fallback: use first available ticket class
    const fallback = event.ticketClasses[0];
    const currency = fallback.currency ?? '$';
    return fallback.price === 0 ? 'Free' : `${currency}${fallback.price.toFixed(2)}`;
  }

  // Final fallback to event-level price
  if (event.price === 0) return 'Free';
  if (event.price === undefined || event.price === null) return 'TBA';
  return `$${event.price.toFixed(2)}`;
};


 const getCategoryColor = (category?: string) => {
  switch (category?.toLowerCase()) {
    case 'music': return 'bg-purple-100 text-purple-800';
    case 'sports': return 'bg-green-100 text-green-800';
    case 'theatre': return 'bg-indigo-100 text-indigo-800';
    case 'comedy': return 'bg-yellow-100 text-yellow-800';
    case 'conference': return 'bg-blue-100 text-blue-800';
    case 'workshop': return 'bg-orange-100 text-orange-800';
    case 'festival': return 'bg-red-100 text-red-800';
    case 'food_drink': return 'bg-pink-100 text-pink-800';
    case 'networking': return 'bg-cyan-100 text-cyan-800';
    case 'charity': return 'bg-emerald-100 text-emerald-800';
    case 'family': return 'bg-lime-100 text-lime-800';
    case 'art': return 'bg-rose-100 text-rose-800';
    case 'technology': return 'bg-blue-100 text-blue-800';
    case 'party': return 'bg-pink-100 text-pink-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};


  const getUrgencyColor = (ticketsLeft?: number) => {
    if (!ticketsLeft || ticketsLeft > 10) return 'text-gray-600';
    if (ticketsLeft > 5) return 'text-orange-600';
    return 'text-red-600';
  };

  const toggleBookmark = async () => {
    if (!session?.user?.id) {
      toast.error('You need to be logged in to bookmark events.');
      return;
    }

    const userId = session.user.id;

    try {
      const res = await fetch('/api/events/bookmarked', {
        method: isBookmarked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, eventId: event.id }),
      });

      if (res.ok) {
        setIsBookmarked(!isBookmarked);
      } else {
        const data = await res.json();
        console.error('Bookmark error:', data.error || data.message);
      }
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  return (
    <Card className={`group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
      event.soldOut ? 'opacity-60 grayscale' : ''
    }`}>
      {/* Image Banner */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={event.imageUrl || 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=250&fit=crop'} 
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Trending Badge */}
        {event.isTrending && !event.soldOut && (
          <Badge className="absolute top-3 right-3 bg-[#1D4ED8] text-white">
            🔥 Trending
          </Badge>
        )}

        {/* Sold Out Overlay */}
        {event.soldOut && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="secondary" className="bg-gray-800 text-white text-lg px-4 py-2">
              SOLD OUT
            </Badge>
          </div>
        )}

        {/* Bookmark Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-3 left-3 bg-white/80 hover:bg-white text-gray-700 rounded-full"
        onClick={toggleBookmark}
      >
        <Heart className={`h-4 w-4 ${isBookmarked ? 'fill-red-500 text-red-500' : ''}`} />
      </Button>
      </div>

      <CardContent className="p-6">
        {/* Category Badge */}
        {event.category && (
          <Badge className={`mb-3 ${getCategoryColor(event.category)}`}>
            {event.category}
          </Badge>
        )}

        {/* Event Title */}
        <h3 className="font-bold text-lg text-[#111827] mb-2 line-clamp-2 group-hover:text-[#1D4ED8] transition-colors">
          {event.title}
        </h3>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{new Date(event.startDate).toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>
{showDelete && (
  <button
    onClick={(e) => {
      e.stopPropagation();

      toast.custom((t) => (
        <div className="bg-white shadow-lg rounded-md p-4 w-[300px]">
          <p className="text-sm font-medium text-gray-900 mb-2">
            Delete this event?
          </p>
          <p className="text-xs text-gray-500 mb-4">
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => toast.dismiss(t)}
              className="text-sm px-3 py-1 rounded hover:bg-gray-100 text-gray-700"
            >
              Cancel
            </button>
            <button
             onClick={async () => {
  try {
    const res = await fetch('/api/events/created', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ eventId: event.id }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to delete event');
    }

    toast.success('Event deleted successfully');
    toast.dismiss(t);

    if (onDelete) {
      onDelete(event.id); // 🔁 Update parent UI
    }
  } catch (err) {
    toast.error('Failed to delete event');
  }
}}

              className="text-sm px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </button>
          </div>
        </div>
      ));
    }}
    className="absolute top-3 right-3 text-red-500 hover:text-red-700 z-10 bg-white/90 rounded-full p-1"
    title="Delete"
  >
    <Trash2 size={18} />
  </button>
)}


        {/* Ticket Count Indicator */}
        {event.ticketsLeft !== undefined && event.ticketsLeft < 20 && !event.soldOut && (
          <p className={`text-sm font-medium mb-3 ${getUrgencyColor(event.ticketsLeft)}`}>
            {event.ticketsLeft === 0 ? 'Last chance!' : `Only ${event.ticketsLeft} left!`}
          </p>
        )}

 <div className="mt-auto pt-4 border-t border-gray-200 flex items-center justify-between">
    <div className="text-2xl font-bold text-[#111827]">
      {formatPrice()}
    </div>
    <Button 
      className={`px-6 ${
        event.soldOut 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-[#1D4ED8] hover:bg-blue-700'
      } text-white rounded-lg transition-all`}
      disabled={event.soldOut}
    >
      {event.soldOut ? 'Sold Out' : 'Book Now'}
    </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
