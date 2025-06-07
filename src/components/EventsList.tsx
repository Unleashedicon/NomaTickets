// components/EventsList.tsx
import React from 'react';
import { Event } from '@/components/EventCard';
import EventCard from './EventCard';
import EmptyState from './EmptyState';

interface EventsListProps {
  events: Event[];
  emptyStateTitle: string;
  emptyStateDescription: string;
  emptyStateEmoji?: string;
  onEventClick: (event: Event) => void; // 👈 NEW
}

const EventsList = ({
  events,
  emptyStateTitle,
  emptyStateDescription,
  emptyStateEmoji,
  onEventClick,
}: EventsListProps) => {
  if (events.length === 0) {
    return (
      <EmptyState
        title={emptyStateTitle}
        description={emptyStateDescription}
        emoji={emptyStateEmoji}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <div key={event.id} onClick={() => onEventClick(event)} className="cursor-pointer">
          <EventCard event={event} />
        </div>
      ))}
    </div>
  );
};

export default EventsList;
