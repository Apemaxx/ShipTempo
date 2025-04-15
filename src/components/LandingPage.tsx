import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header/Navigation */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <img
            src="/amass_logo_new.svg"
            alt="AMASS Logo"
            className="h-10 w-auto"
          />
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/signin">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link to="/signup">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10">
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            Streamline Your Shipping Management
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            A comprehensive shipping management platform with an intuitive
            lifecycle control panel that guides you through the entire shipping
            process from quote to delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
            <Link to="/signin">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
        <div className="lg:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=800&q=80"
            alt="Shipping Management"
            className="rounded-lg shadow-xl w-full"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 bg-background">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Shipment Lifecycle Panel</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Visual timeline, status-specific action buttons, and document
                management in one place.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Dashboard with KPIs</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Active shipments, pending quotes, on-time delivery rates, and
                monthly revenue at a glance.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quote Management Module</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Creation forms, cost breakdowns, and one-click conversion to
                bookings.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Shipment Tracking Interface</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Milestone tracking, document repository, and interactive map
                view.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>CFS Availability Checker</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Location selection and date range filtering for container
                freight stations.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Real-time Communication</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Stay connected with partners and customers throughout the
                shipping process.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Ready to Transform Your Shipping Operations?
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of businesses that have streamlined their shipping
          processes with our platform.
        </p>
        <Link to="/signup">
          <Button size="lg">Get Started Today</Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-secondary/20 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <img
                src="/amass_logo_new.svg"
                alt="AMASS Logo"
                className="h-8 w-auto"
              />
              <p className="text-muted-foreground mt-2">
                © 2024 AMASS. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-8">
              <div>
                <h3 className="font-medium mb-2">Product</h3>
                <ul className="space-y-1">
                  <li>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Documentation
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Company</h3>
                <ul className="space-y-1">
                  <li>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Contact
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Careers
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Legal</h3>
                <ul className="space-y-1">
                  <li>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Terms
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Security
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
