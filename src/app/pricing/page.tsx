import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Crown } from 'lucide-react';

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that works best for you. Start for free and upgrade when you are ready to create amazing events.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {/* Free Plan */}
          <Card className="relative">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Star className="h-6 w-6 text-blue-500" />
                <CardTitle className="text-2xl">Free</CardTitle>
              </div>
              <div className="text-3xl font-bold">
                $0<span className="text-lg font-normal text-muted-foreground">/month</span>
              </div>
              <p className="text-muted-foreground">
                Perfect for discovering and attending events
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Browse all events</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Bookmark up to 10 events</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Event notifications</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Basic search filters</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Community support</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline">
                Get Started Free
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="relative border-primary">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground px-3 py-1">
                Most Popular
              </Badge>
            </div>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Crown className="h-6 w-6 text-yellow-500" />
                <CardTitle className="text-2xl">Premium</CardTitle>
              </div>
              <div className="text-3xl font-bold">
                $2<span className="text-lg font-normal text-muted-foreground">/month</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 font-semibold">First month FREE!</span>
              </div>
              <p className="text-muted-foreground">
                Everything in Free, plus event creation and premium features
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Everything in Free</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="font-semibold">Create unlimited events</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Unlimited bookmarks</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Early access to new events</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Exclusive discounts on events</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Advanced analytics for your events</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Priority customer support</span>
                </li>
              </ul>
              <Button className="w-full">
                Start Free Trial
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Annual Plan Option */}
        <Card className="max-w-2xl mx-auto mb-12 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Save Even More with Annual Billing</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-2xl font-bold">
              $10<span className="text-lg font-normal text-muted-foreground">/year</span>
              <Badge variant="secondary" className="ml-2">Save $14</Badge>
            </div>
            <p className="text-muted-foreground">
              Get all Premium features for less than $1 per month when you pay annually
            </p>
            <Button variant="outline">
              Choose Annual Plan
            </Button>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I cancel anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! You can cancel your subscription at any time. Your Premium features will remain active until the end of your current billing period.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We accept all major credit cards, M-Pesa, and other popular payment methods available in Kenya and East Africa.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is there a free trial?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! All new Premium subscribers get their first month absolutely free. No credit card required to start.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I upgrade or downgrade?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Absolutely! You can upgrade to Premium anytime or downgrade to Free at the end of your billing cycle.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
