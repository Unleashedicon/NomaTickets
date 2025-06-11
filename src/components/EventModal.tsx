'use client';

import { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  useMediaQuery,
  Box,
  Stack,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Calendar, MapPin, Tag, User } from 'lucide-react';
import { Event } from '@/components/EventCard'; // Adjust if needed
import DOMPurify from 'dompurify';

interface EventDetailsModalProps {
  event: Event | null;
  onClose: () => void;
}

const EventDetailsModal = ({ event, onClose }: EventDetailsModalProps) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (event) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [event, onClose]);

  if (!event) return null;

  return (
    <Dialog
      open={!!event}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: 6,
          p: 1,
          backgroundColor: theme.palette.background.paper,
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h5" fontWeight="bold">
          {event.title}
        </Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Stack spacing={2}>
          {/* Description */}
      <Typography
        variant="body1"
        color="text.secondary"
        component="div" // allow div wrapper to render HTML properly
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(event.description) }}
      />

          {/* Date */}
          <Box display="flex" alignItems="center" gap={1}>
            <Calendar size={18} />
            <Typography variant="body2">
              {new Date(event.startDate).toLocaleString()}
              {event.endDate && ` – ${new Date(event.endDate).toLocaleString()}`}
            </Typography>
          </Box>

          {/* Location */}
          <Box display="flex" alignItems="center" gap={1}>
            <MapPin size={18} />
            <Typography variant="body2">{event.location}</Typography>
          </Box>

          {/* Category */}
          <Box display="flex" alignItems="center" gap={1}>
            <Tag size={18} />
            <Typography variant="body2">{event.category}</Typography>
          </Box>

          {/* Event ID */}
          <Box display="flex" alignItems="center" gap={1}>
            <User size={18} />
            <Typography variant="body2">Event ID: {event.id}</Typography>
          </Box>

          {/* Image */}
          {event.imageUrl && (
            <Box
              component="img"
              src={event.imageUrl}
              alt={event.title}
              sx={{
                width: '100%',
                maxHeight: 300,
                borderRadius: 2,
                objectFit: 'cover',
                mt: 2,
              }}
            />
          )}
          {/* Ticket Classes */}
{event.ticketClasses && event.ticketClasses.length > 0 && (
  <Box mt={2}>
    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
      Ticket Classes
    </Typography>
    <Stack spacing={1}>
      {event.ticketClasses.map((tc) => (
        <Box key={tc.id} p={1} borderRadius={2} bgcolor="#f5f5f5">
          <Typography variant="body2">
            <strong>{tc.name}</strong>: ${tc.price.toFixed(2)} ({tc.quantity} available)
          </Typography>
        </Box>
      ))}
    </Stack>
  </Box>
)}

        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="contained" color="primary" sx={{ borderRadius: 2 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventDetailsModal;
