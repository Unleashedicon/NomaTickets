"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import LocationMap from "@/components/locationpicker";
import LocationAutocomplete from "@/components/locationautocomplete";
import currencyCodes from "currency-codes";
import { DateTimeRangePicker } from "@/components/datetimerangepicker"
import { readAndCompressImage } from 'browser-image-resizer';
import { toast } from 'sonner';
import "flowbite";
import { DateRange } from "@/components/ui/calendar"

const imageResizeConfig = {
  quality: 0.8,
  maxWidth: 1200,
  maxHeight: 1200,
  autoRotate: true,
  debug: false,
};
// Note: The Flowbite JavaScript for tooltips and dropdowns is not automatically
// integrated by simply including the HTML. For full interactivity of the
// rich text editor toolbar or complex dropdowns, you would typically need
// to initialize Flowbite's JS after component mount, or use a React-specific
// rich text editor library. This example provides the UI structure and state
// management for the content, but the toolbar buttons are non-functional
// without further JS integration or a dedicated library.

export default function EventCreatorForm() {
  const [eventTitle, setEventTitle] = useState<string>('');
  const [eventDescription, setEventDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventImagePreview, setEventImagePreview] = useState<string | null>(null);
  const [ticketClasses, setTicketClasses] = useState<{ id: number; name: string; price: string; quantity: string; currency: string}[]>([]);
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'info' | 'danger' | 'success' | 'warning' | 'dark'>('info');
  const [eventLocation, setEventLocation] = useState("");
  const [coordinates, setCoordinates] = useState<[number, number]>([-1.2921, 36.8219]); // Default: Nairobi
  const [category, setCategory] = React.useState("")
const [eventImageCloudinaryUrl, setEventImageCloudinaryUrl] = useState<string | null>(null);
const [date, setDate] = useState<DateRange | undefined>()
const [startTime, setStartTime] = useState("09:00")
const [endTime, setEndTime] = useState("17:00")
  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const nextTicketId = useRef(0); // To generate unique IDs for ticket rows

  // Function to show alerts
  const showAlert = (message: string, type: typeof alertType) => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage(null);
    }, 5000); // Hide alert after 5 seconds
  };

  // Add initial empty ticket class row
  useEffect(() => {
    if (ticketClasses.length === 0) {
      addTicketClass();
    }
  }, []);


 const handleImageFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  setAlertMessage(null);
  const file = event.target.files?.[0];

  if (!file) {
    setEventImagePreview(null);
    return;
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    showAlert('Please upload an image file (SVG, PNG, JPG, or GIF).', 'danger');
    setEventImagePreview(null);
    if (imageFileInputRef.current) imageFileInputRef.current.value = '';
    return;
  }

  try {
    // Resize image (if you're using something like browser-image-compression)
    const resizedBlob = await readAndCompressImage(file, imageResizeConfig);
    const resizedFile = new File([resizedBlob], file.name, { type: file.type });

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setEventImagePreview(reader.result as string);
    };
    reader.readAsDataURL(resizedFile);

    // Upload to Cloudinary (unsigned)
    const formData = new FormData();
    formData.append('file', resizedFile);
    formData.append('upload_preset', 'nomatickets'); // your unsigned preset name
    formData.append('folder', 'samples/ecommerce');  // folder set in the preset

    const res = await fetch('https://api.cloudinary.com/v1_1/dqvxxikdb/image/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (data.secure_url) {
      console.log('✅ Uploaded to Cloudinary:', data.secure_url);
      setEventImageCloudinaryUrl(data.secure_url); // <-- use this URL in your API later
    } else {
      throw new Error(data.error?.message || 'Cloudinary upload failed');
    }

  } catch (error) {
    console.error('Image processing/upload failed:', error);
    showAlert('Failed to process or upload image. Please try another one.', 'danger');
    setEventImagePreview(null);
  }
};


  // Handle adding a new ticket class row
  const addTicketClass = () => {
setTicketClasses([...ticketClasses, { id: nextTicketId.current++, name: '', price: '', quantity: '', currency: '' }]);
  };

  // Handle changes in ticket class input fields
const handleTicketClassChange = (
  id: number,
  field: 'name' | 'price' | 'quantity' | 'currency',
  value: string
) => {
  setTicketClasses(ticketClasses.map(ticket =>
    ticket.id === id ? { ...ticket, [field]: value } : ticket
  ));
};


  // Handle removing a ticket class row
  const removeTicketClass = (id: number) => {
    setTicketClasses(ticketClasses.filter(ticket => ticket.id !== id));
  };

  // Handle form submission
const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
setIsSubmitting(true);
  // 1. Basic validation
  if (!eventTitle || !eventDescription || !eventLocation) {
    showAlert("Please fill in all required event details.", "danger");
    return;
  }

  const hasEmptyTicketFields = ticketClasses.some(
    (ticket) =>
      !ticket.name ||
      !ticket.price ||
      !ticket.quantity ||
      !ticket.currency ||
      !currencyCodes.code(ticket.currency)
  );

  if (ticketClasses.length === 0 || hasEmptyTicketFields) {
    showAlert(
      "Please add at least one ticket class and ensure all ticket fields are filled and currencies are valid.",
      "danger"
    );
    return;
  }
if (!coordinates || coordinates.length !== 2) {
  showAlert("Please select a valid event location.", "danger");
  return;
}
if (!date?.from || !startTime) {
  alert("Please select a start date and time");
  return;
}


const startDateTimeISO =
  date?.from && startTime
    ? new Date(
        date.from.getFullYear(),
        date.from.getMonth(),
        date.from.getDate(),
        Number(startTime.split(":")[0]),
        Number(startTime.split(":")[1])
      ).toISOString()
    : null;

const endDateTimeISO =
  date?.to && endTime
    ? new Date(
        date.to.getFullYear(),
        date.to.getMonth(),
        date.to.getDate(),
        Number(endTime.split(":")[0]),
        Number(endTime.split(":")[1])
      ).toISOString()
    : null;


  // 3. Optional: Upload image separately and get `imageUrl`
  // For now, assume eventImageUrl is already set (from cloud upload)
  // 3. Use uploaded Cloudinary image URL
const imageUrl = eventImageCloudinaryUrl;

if (!imageUrl) {
  showAlert("Please upload an event image.", "danger");
  return;
}
 // Replace with your logic

  // 4. Prepare data
  const payload = {
    title: eventTitle,
    description: eventDescription,
    location: eventLocation,
      latitude: coordinates[0],   // 👈 latitude
  longitude: coordinates[1],
    imageUrl: imageUrl,
    category: category,
    startDate: startDateTimeISO,
    endDate: endDateTimeISO,
    ticketClasses: ticketClasses.map((t) => ({
      name: t.name,
      price: t.price,
      quantity: t.quantity,
    })),
  };

  try {
    const res = await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      showAlert(`Error: ${err.error}`, "danger");
      return;
    }

    setEventTitle('');
    setEventDescription('');
    setEventLocation('');
    setCoordinates([-1.2921, 36.8219]);
    setCategory('');
    setTicketClasses([]);
setDate(undefined);
    setStartTime('');
    setEndTime('');
    setEventImageCloudinaryUrl('');
    setEventImagePreview(null);
    if (imageFileInputRef.current) imageFileInputRef.current.value = '';
toast.success("Event created!", {
  description: "It will appear on the homepage once approved.",
});
  } catch (error) {
    console.error("Event creation error:", error);
    showAlert("Something went wrong while creating the event.", "danger");
  } finally {
    setIsSubmitting(false); // end loading
  }
};

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (eventLocation.length > 3) {
        fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(eventLocation)}&limit=1`)
          .then((res) => res.json())
          .then((data) => {
            if (data.features?.length > 0) {
              const [lon, lat] = data.features[0].geometry.coordinates;
              setCoordinates([lat, lon]);
            }
          });
      }
    }, 600); // debounce input

    return () => clearTimeout(delayDebounce);
  }, [eventLocation]);
  
  return (
<div className="min-h-screen bg-white flex justify-center items-start p-0 pb-28">
  <div className="w-full max-w-2xl bg-gray-100 p-6 rounded-xl shadow-lg space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Event Creator</h1>

        {alertMessage && (
          <div className={`flex items-center p-4 text-sm rounded-lg ${
            alertType === 'info' ? 'text-blue-800 border-blue-300 bg-blue-50 dark:text-blue-400 dark:border-blue-800' :
            alertType === 'danger' ? 'text-red-800 border-red-300 bg-red-50 dark:text-red-400 dark:border-red-800' :
            alertType === 'success' ? 'text-green-800 border-green-300 bg-green-50 dark:text-green-400 dark:border-green-800' :
            alertType === 'warning' ? 'text-yellow-800 border-yellow-300 bg-yellow-50 dark:text-yellow-300 dark:border-yellow-800' :
            'text-gray-800 border-gray-300 bg-gray-50 dark:text-gray-300 dark:border-gray-600'
          }`} role="alert">
            <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
            </svg>
            <span className="sr-only">Alert</span>
            <div>
              <span className="font-medium">{alertType.charAt(0).toUpperCase() + alertType.slice(1)} alert!</span> {alertMessage}
            </div>
            <button
              onClick={() => setAlertMessage(null)}
              className="ms-auto -mx-1.5 -my-1.5 bg-transparent text-gray-500 rounded-lg focus:ring-2 focus:ring-gray-400 p-1.5 hover:bg-gray-200 inline-flex items-center justify-center h-8 w-8 dark:text-gray-400 dark:hover:bg-gray-600"
              aria-label="Close"
            >
              <span className="sr-only">Close</span>
              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Title */}
          <div className="space-y-2">
            <Label htmlFor="event-title">Event Title</Label>
            <Input
              id="event-title"
              type="text"
              placeholder="Event Title"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              required
            />
          </div>

          {/* Event Description (Adapted Flowbite Rich Text Editor UI) */}
          <div className="space-y-2">
            <Label htmlFor="event-description">Event Description</Label>
            <div className="w-full border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
              <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-600">
                <div className="flex flex-wrap items-center">
                  <div className="flex items-center space-x-1 rtl:space-x-reverse flex-wrap">
                    {/* Toolbar Buttons (UI only, no functionality without a rich text editor library) */}
                    <button type="button" className="p-1.5 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                      <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5h4.5a3.5 3.5 0 1 1 0 7H8m0-7v7m0-7H6m2 7h6.5a3.5 3.5 0 1 1 0 7H8m0-7v7m0 0H6"/>
                      </svg>
                      <span className="sr-only">Bold</span>
                    </button>
                    <button type="button" className="p-1.5 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                      <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m8.874 19 6.143-14M6 19h6.33m-.66-14H18"/>
                      </svg>
                      <span className="sr-only">Italic</span>
                    </button>
                    <button type="button" className="p-1.5 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                      <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M6 19h12M8 5v9a4 4 0 0 0 8 0V5M6 5h4m4 0h4"/>
                      </svg>
                      <span className="sr-only">Underline</span>
                    </button>
                    <button type="button" className="p-1.5 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                      <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 6.2V5h12v1.2M7 19h6m.2-14-1.677 6.523M9.6 19l1.029-4M5 5l6.523 6.523M19 19l-7.477-7.477"/>
                      </svg>
                      <span className="sr-only">Strike</span>
                    </button>
                    <button type="button" className="p-1.5 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                      <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.9999 21h-4v-.5c1.0989-1.0329 3.75-2.5 3.75-3.5v-1.0001c0-.5523-.4477-.9999-1-.9999h-1.75c-.5523 0-1 .4477-1 1M3.99986 6l9.26894 11.5765M13.1219 6 3.85303 17.5765"/>
                      </svg>
                      <span className="sr-only">Subscript</span>
                    </button>
                    <button type="button" className="p-1.5 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                      <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21.0002 11h-4l-.0001-.5C18.099 9.46711 20.7502 8 20.7502 7V5.99989c0-.55228-.4478-.99989-1-.99989h-1.75c-.5523 0-1 .44772-1 1M5.37837 7.98274 14.6473 19.5593m-.5251-11.25583L4.85547 19.8773"/>
                      </svg>
                      <span className="sr-only">Superscript</span>
                    </button>
                    <button type="button" className="p-1.5 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                      <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M9 19.2H5.5c-.3 0-.5-.2-.5-.5V16c0-.2.2-.4.5-.4h13c.3 0 .5.2.5.4v2.7c0 .3-.2.5-.5.5H18m-6-1 1.4 1.8h.2l1.4-1.7m-7-5.4L12 4c0-.1 0-.1 0 0l4 8.8m-6-2.7h4m-7 2.7h2.5m5 0H17"/>
                      </svg>
                      <span className="sr-only">Highlight</span>
                    </button>
                    <button type="button" className="p-1.5 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                      <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m8 8-4 4 4 4m8 0 4-4-4-4m-2-3-4 14"/>
                      </svg>
                      <span className="sr-only">Code</span>
                    </button>
                    {/* Text size, color, font family dropdowns are complex.
                        For a full implementation, consider a rich text editor library.
                        Here, they are just buttons for UI purposes. */}
                    <button type="button" className="p-1.5 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                      <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6.2V5h11v1.2M8 5v14m-3 0h6m2-6.8V11h8v1.2M17 11v8m-1.5 0h3"/>
                      </svg>
                      <span className="sr-only">Text size</span>
                    </button>
                    <button type="button" className="p-1.5 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                      <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="25" height="24" fill="none" viewBox="0 0 25 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m6.532 15.982 1.573-4m-1.573 4h-1.1m1.1 0h1.65m-.077-4 2.725-6.93a.11.11 0 0 1 .204 0l2.725 6.93m-5.654 0H8.1m.006 0h5.654m0 0 .617 1.569m5.11 4.453c0 1.102-.854 1.996-1.908 1.996-1.053 0-1.907-.894-1.907-1.996 0-1.103 1.907-4.128 1.907-4.128s1.909 3.025 1.909 4.128Z"/>
                      </svg>
                      <span className="sr-only">Text color</span>
                    </button>
                    <button type="button" className="p-1.5 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                      <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m10.6 19 4.298-10.93a.11.11 0 0 1 .204 0L19.4 19m-8.8 0H9.5m1.1 0h1.65m7.15 0h-1.65m1.65 0h1.1m-7.7-3.985h4.4M3.021 16l1.567-3.985m0 0L7.32 5.07a.11.11 0 0 1 .205 0l2.503 6.945h-5.44Z"/>
                      </svg>
                      <span className="sr-only">Font family</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="px-4 py-2 bg-white rounded-b-lg dark:bg-gray-800">
                <label htmlFor="event-description" className="sr-only">Write description</label>
                <textarea
                  id="event-description"
                  className="block w-full px-0 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400 resize-none"
                  rows={6} // Adjust rows as needed
                  placeholder="Write your event description..."
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  required
                ></textarea>
              </div>
            </div>
          </div>

<div className="space-y-2">
  <Label htmlFor="event-image-upload">Event Image</Label>
  <div className="flex flex-col gap-2">
    {/* File input */}
    <input
      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 p-2.5"
      aria-describedby="file_input_help"
      id="event-image-upload"
      type="file"
      accept="image/svg+xml,image/png,image/jpeg,image/gif"
      onChange={handleImageFileChange}
      ref={imageFileInputRef}
    />
    <p className="text-sm text-gray-500 dark:text-gray-300" id="file_input_help">
      SVG, PNG, JPG or GIF. Recommended: at least 1600x900px for high quality display.
    </p>

    {/* Image preview (shown below input) */}
    {eventImagePreview && (
      <div className="w-full max-h-96 border border-gray-300 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={eventImagePreview}
          alt="Event Preview"
          className="object-cover w-full"
        />
      </div>
    )}
  </div>
</div>

      <div>
        <label className="block mb-1 font-medium">Event Date & Time</label>
    <DateTimeRangePicker
      date={date}
      setDate={setDate}
      startTime={startTime}
      setStartTime={setStartTime}
      endTime={endTime}
      setEndTime={setEndTime}
    />      </div>
            <div>
        <label
          htmlFor="event-category"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Select event category
        </label>
        <select
          id="event-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                     focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                     dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                     dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        >
    <option value="" disabled>
      Select category that best describes your event
    </option>
    <option value="music">Music</option>
    <option value="sports">Sports</option>
    <option value="theatre">Theatre</option>
    <option value="comedy">Comedy</option>
    <option value="conference">Conference</option>
    <option value="workshop">Workshop</option>
    <option value="festival">Festival</option>
    <option value="food_drink">Food & Drink</option>
    <option value="networking">Networking</option>
    <option value="charity">Charity</option>
    <option value="family">Family</option>
    <option value="art">Art</option>
    <option value="technology">Technology</option>
        </select>
      </div>

          {/* Event Location */}
 <div className="space-y-2">
      <Label htmlFor="event-location">Event Location</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <LocationAutocomplete
      onSelect={(location) => {
        setEventLocation(`${location.name}, ${location.city}, ${location.country}`);
        setCoordinates([location.coordinates[1], location.coordinates[0]]); // [lat, lng]
      }}
    />
    <div className="w-full h-40 overflow-hidden rounded-lg border border-gray-300">

        <LocationMap lat={coordinates[0]} lng={coordinates[1]} label={eventLocation || "Selected location"} />
      </div>
      </div>
    </div>
          {/* Ticket Classes */}
    <div className="space-y-2">
  <Label>Ticket Classes</Label>

  <div className="overflow-x-auto">
    <div className="min-w-full space-y-2">
      {/* Table header */}
      <div className="hidden md:grid grid-cols-5 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 px-4 py-2 rounded-t-md">
        <div>Name</div>
        <div>Currency</div>
        <div>Price</div>
        <div>Quantity</div>
        <div></div>
      </div>

      {/* Ticket rows */}
      {ticketClasses.map((ticket) => (
        <div
          key={ticket.id}
          className="grid grid-cols-1 md:grid-cols-5 gap-2 items-start bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-4 py-3"
        >
          <div>
            <Label className="md:hidden">Name</Label>
            <Input
              type="text"
              placeholder="Standard"
              value={ticket.name}
              onChange={(e) => handleTicketClassChange(ticket.id, "name", e.target.value)}
              required
            />
          </div>

          <div>
            <Label className="md:hidden">Currency</Label>
            <Input
              type="text"
              placeholder="USD"
              value={ticket.currency}
              onChange={(e) =>
                handleTicketClassChange(ticket.id, "currency", e.target.value.toUpperCase())
              }
              className={`${
                ticket.currency && !currencyCodes.code(ticket.currency)
                  ? "border-red-500"
                  : ""
              }`}
              maxLength={3}
              required
            />
            {ticket.currency && !currencyCodes.code(ticket.currency) && (
              <p className="text-xs text-red-500 mt-1">Invalid currency code</p>
            )}
          </div>

          <div>
            <Label className="md:hidden">Price</Label>
            <Input
              type="number"
              placeholder="0.00"
              value={ticket.price}
              onChange={(e) => handleTicketClassChange(ticket.id, "price", e.target.value)}
              step="0.01"
              min="0"
              required
            />
          </div>

          <div>
            <Label className="md:hidden">Quantity</Label>
            <Input
              type="number"
              placeholder="100"
              value={ticket.quantity}
              onChange={(e) => handleTicketClassChange(ticket.id, "quantity", e.target.value)}
              min="1"
              required
            />
          </div>

          <div className="flex md:justify-end items-center pt-1">
            {ticketClasses.length > 1 && (
              <Button
                type="button"
                onClick={() => removeTicketClass(ticket.id)}
                variant="ghost"
                size="sm"
                className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20"
              >
                Remove
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>


            </div>
            <Button type="button" onClick={addTicketClass} variant="outline" className="mt-2 w-full sm:w-auto">
              + Add Ticket Class
            </Button>
          </div>

          {/* Visibility */}
          <div className="space-y-2">
            <Label>Visibility</Label>
            <RadioGroup
              defaultValue="public"
              name="visibility"
              className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"
              value={visibility}
              onValueChange={(value: 'public' | 'private') => setVisibility(value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="visibility-public" />
                <Label htmlFor="visibility-public">Public</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="visibility-private" />
                <Label htmlFor="visibility-private">Private</Label>
              </div>
            </RadioGroup>
          </div>

<button
  type="submit"
  disabled={isSubmitting}
  className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center ${
    isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'
  }`}
>
  {isSubmitting ? (
    <>
      <svg
        aria-hidden="true"
        role="status"
        className="inline w-4 h-4 me-3 text-white animate-spin fill-white"
        viewBox="0 0 100 101"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 
             100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 
             50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 
             50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 
             91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 
             72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 
             9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 
             97.0079 33.5539C95.2932 28.8227 92.871 24.3692 
             89.8167 20.348C85.8452 15.1192 80.8826 10.7238 
             75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 
             56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 
             41.7345 1.27873C39.2613 1.69328 37.813 4.19778 
             38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 
             44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 
             55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 
             70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 
             82.5849 25.841C84.9175 28.9121 86.7997 32.2913 
             88.1811 35.8758C89.083 38.2158 91.5421 39.6781 
             93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      Creating...
    </>
  ) : (
    "Create Event"
  )}
</button>



        </form>
      </div>
    </div>
  );
}
