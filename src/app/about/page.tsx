import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Heart, Users, Calendar } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            About NomaTickets
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your gateway to discovering amazing events across Kenya and East Africa
          </p>
        </div>

        {/* Mission Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-500" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              At NomaTickets, we believe that great events bring communities together and create lasting memories. 
              Our platform is designed to make discovering, booking, and creating events simple, seamless, and accessible 
              for everyone across Kenya and East Africa.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Whether you are looking for cultural festivals, business conferences, music concerts, or community gatherings, 
              NomaTickets is your trusted companion in exploring the vibrant event landscape of our region.
            </p>
          </CardContent>
        </Card>

        {/* What We Offer */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                Discover Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Browse a curated selection of events happening across Kenya and East Africa, 
                from local community gatherings to major cultural celebrations.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Bookmark & Track
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Save events you are interested in and never miss out on experiences that matter to you. 
                Get notified about updates and upcoming events.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                Create & Host
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Organize your own events with our easy-to-use tools. Reach your target audience 
                and make your event a success with our platform.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Get in Touch</CardTitle>
            <p className="text-muted-foreground">
              We would love to hear from you! Whether you have questions, need support, or want to share feedback, 
              our team is here to help.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-semibold">Email Support</p>
                    <a href="mailto:support@nomatickets.com" className="text-primary hover:underline">
                      support@nomatickets.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-semibold">Phone Support</p>
                    <a href="tel:+254700000000" className="text-primary hover:underline">
                      +254 700 000 000
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-muted-foreground">Nairobi, Kenya</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Follow us on social media for updates and event highlights:
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm">
                    Twitter
                  </Button>
                  <Button variant="outline" size="sm">
                    Instagram
                  </Button>
                  <Button variant="outline" size="sm">
                    Facebook
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
