"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from "react";
import "flowbite";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation'
import EventsList from '@/components/EventsList';
import { Event } from '@/components/EventCard';
import EventDetailsModal from '@/components/EventModal';

export default function AuthTabs() {
  const [tab, setTab] = useState("login");
  const { data: session, status } = useSession();
    const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  const [bookmarkedEvents, setBookmarkedEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [role, setRole] = useState<string | null>(null); // New role state

const router = useRouter();
   const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  async function fetchCreatedEvents(userId: string) {
    const res = await fetch(`/api/events/created?userId=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch created events');
    return res.json();
  }

  async function fetchBookmarkedEvents(userId: string) {
    const res = await fetch(`/api/events/bookmarked?userId=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch bookmarked events');
    return res.json();
  }

  // New function to fetch role from API
  async function fetchUserRole(userId: string) {
    const res = await fetch(`/api/user/role?userId=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch user role');
    const data = await res.json();
    return data.role;
  }

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) {
      // Not logged in or no user ID - reset role and skip
      setRole(null);
      return;
    }

    // Fetch user role from API and set it
    fetchUserRole(session.user.id)
      .then(fetchedRole => {
        setRole(fetchedRole);

        // Fetch events based on role
        if (fetchedRole === "CREATOR") {
          fetchCreatedEvents(session.user.id).then(setCreatedEvents);
        }
        fetchBookmarkedEvents(session.user.id).then(setBookmarkedEvents);
      })
      .catch(err => {
        console.error(err);
        setRole(null);
      });
  }, [status, session?.user?.id]);


  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const payload = {
      firstName: form.get("firstName")?.toString() || "",
      lastName: form.get("lastName")?.toString() || "",
      email: form.get("email")?.toString() || "",
      password: form.get("password")?.toString() || "",
      confirmPassword: form.get("confirmPassword")?.toString() || "",
      role: form.get("role")?.toString() || "VIEWER",
    };

    if (payload.password !== payload.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const res = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (res.ok) {
      alert("Signup successful!");
  router.push("/");
    } else {
      alert(data.error || "Signup failed");
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const email = form.get("email")?.toString() || "";
    const password = form.get("password")?.toString() || "";

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      alert(res.error);
    } else {
      alert("Login successful");
        router.push("/");
    }
  };
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading profile...</p>
      </div>
    );
  }
  if (session) {
    return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Welcome Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              Welcome back, {session.user?.name ?? session.user?.email}! 👋
            </CardTitle>
            <p className="text-muted-foreground">
              {role === 'CREATOR'
                ? 'Manage your events and see what you’ve bookmarked.'
                : 'Explore your bookmarked events and discover new ones.'}
            </p>
          </CardHeader>
        </Card>

        {/* Events Tabs */}
        <Tabs defaultValue="bookmarked" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            {role === 'CREATOR' && (
              <TabsTrigger value="created">Created Events</TabsTrigger>
            )}
            <TabsTrigger value="bookmarked">Bookmarked Events</TabsTrigger>
          </TabsList>

          {role === 'CREATOR' && (
            <TabsContent value="created" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Created Events</CardTitle>
                  <p className="text-muted-foreground">
                    Events you have created and are hosting.
                  </p>
                </CardHeader>
                <CardContent>
                  <EventsList
events={createdEvents}
                    emptyStateTitle="No events created yet"
                    emptyStateDescription="Start creating amazing events for your community!"
                    emptyStateEmoji="🎯"
                            onEventClick={handleEventClick}

                  />
                  
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="bookmarked" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Bookmarked Events</CardTitle>
                <p className="text-muted-foreground">
                  Events you are interested in attending.
                </p>
              </CardHeader>
              <CardContent>
                <EventsList
events={bookmarkedEvents}
                  emptyStateTitle="No bookmarked events yet"
                  emptyStateDescription="Discover events you love and bookmark them for later!"
                  emptyStateEmoji="📚"
                          onEventClick={handleEventClick}

                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        {selectedEvent && (
          <EventDetailsModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
        {/* Sign Out */}
        <div className="mt-10 text-center">
          <button
            onClick={() => signOut()}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-muted">
      <Tabs value={tab} onValueChange={setTab} className="w-[400px] bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>

        {/* Login Tab */}
        <TabsContent value="login">
          <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
            <form className="space-y-6" onSubmit={handleLogin}>
              <h5 className="text-xl font-medium text-gray-900 dark:text-white">Sign in to our platform</h5>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@company.com" required />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
              </div>
              <div className="flex items-start">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />
                  </div>
                  <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
                </div>
                <a href="#" className="ms-auto text-sm text-blue-700 hover:underline dark:text-blue-500">Forgot Password?</a>
              </div>
              <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login to your account</button>
            <button
              type="button"
              onClick={() => signIn("google")}
              className="w-full bg-white text-black border border-gray-400 p-2 rounded mt-2"
            >
              Continue with Google
            </button>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                Not registered?{" "}
                <button
                  type="button"
                  onClick={() => setTab("signup")}
                  className="text-blue-700 hover:underline dark:text-blue-500"
                >
                  Create account
                </button>
                
              </div>
            </form>
          </div>
        </TabsContent>

        {/* Signup Tab */}
        <TabsContent value="signup">
          <form onSubmit={handleSignup}>
  <div className="grid gap-6 mb-6 md:grid-cols-2">
    <div>
      <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        First name
      </label>
      <input
        type="text"
        id="first_name"
        name="firstName"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
          focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
          dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
          dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="John"
        required
      />
    </div>
    <div>
      <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Last name
      </label>
      <input
        type="text"
        id="last_name"
        name="lastName"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
          focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
          dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
          dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Doe"
        required
      />
    </div>
  </div>

  <div className="mb-6">
    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      Email address
    </label>
    <input
      type="email"
      id="email"
      name="email"
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
        focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
        dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
        dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder="john.doe@company.com"
      required
    />
  </div>

  <div className="mb-6">
    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      Password
    </label>
    <input
      type="password"
      id="password"
      name="password"
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
        focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
        dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
        dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder="•••••••••"
      required
    />
  </div>

  <div className="mb-6">
    <label htmlFor="confirm_password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      Confirm password
    </label>
    <input
      type="password"
      id="confirm_password"
      name="confirmPassword"
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
        focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
        dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
        dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder="•••••••••"
      required
    />
  </div>

  <div className="space-y-2 mb-6">
    <label className="text-sm font-medium text-gray-900 dark:text-white">User Role</label>

    <div className="flex items-center mb-4">
      <input
        id="role-viewer"
        type="radio"
        value="VIEWER"
        name="role"
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500
                   dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2
                   dark:bg-gray-700 dark:border-gray-600"
        defaultChecked
      />
      <label
        htmlFor="role-viewer"
        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
      >
        <span className="font-semibold">Viewer</span> – Discover and RSVP to events effortlessly.
      </label>
    </div>

    <div className="flex items-center">
      <input
        id="role-creator"
        type="radio"
        value="CREATOR"
        name="role"
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500
                   dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2
                   dark:bg-gray-700 dark:border-gray-600"
      />
      <label
        htmlFor="role-creator"
        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
      >
        <span className="font-semibold">Creator</span> – Share your own events with the community and manage tickets.
      </label>
    </div>
  </div>

  <button
    type="submit"
    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none
      focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5
      text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
  >
    Submit
  </button>
</form>

        </TabsContent>
      </Tabs>
    </div>
  );
}


