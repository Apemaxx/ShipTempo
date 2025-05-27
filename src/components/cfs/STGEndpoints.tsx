import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  API_BASE_URL,
  AUTH_CODE,
  CONTAINERS_CODE,
  ZIPCODE_API_BASE_URL,
} from "@/config";

export default function STGEndpoints() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">STG API Endpoints</h1>

      <Tabs defaultValue="auth">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="containers">Containers</TabsTrigger>
          <TabsTrigger value="zipcode">Zipcode</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
        </TabsList>

        <TabsContent value="auth">
          <Card>
            <CardHeader>
              <CardTitle>Authentication API</CardTitle>
              <CardDescription>
                Base URL: {API_BASE_URL}
                {AUTH_CODE}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="p-2 bg-gray-50 rounded">
                  <span className="font-mono text-sm bg-blue-100 px-2 py-1 rounded mr-2">
                    POST
                  </span>
                  <span className="font-semibold">/auth/login</span> - User
                  login
                </li>
                <li className="p-2 bg-gray-50 rounded">
                  <span className="font-mono text-sm bg-blue-100 px-2 py-1 rounded mr-2">
                    POST
                  </span>
                  <span className="font-semibold">/auth/refresh</span> - Refresh
                  authentication token
                </li>
                <li className="p-2 bg-gray-50 rounded">
                  <span className="font-mono text-sm bg-blue-100 px-2 py-1 rounded mr-2">
                    POST
                  </span>
                  <span className="font-semibold">/auth/register</span> -
                  Register new user
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="containers">
          <Card>
            <CardHeader>
              <CardTitle>Containers API</CardTitle>
              <CardDescription>
                Base URL: {API_BASE_URL}
                {CONTAINERS_CODE}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="p-2 bg-gray-50 rounded">
                  <span className="font-mono text-sm bg-green-100 px-2 py-1 rounded mr-2">
                    GET
                  </span>
                  <span className="font-semibold">/containers</span> - List all
                  containers
                </li>
                <li className="p-2 bg-gray-50 rounded">
                  <span className="font-mono text-sm bg-green-100 px-2 py-1 rounded mr-2">
                    GET
                  </span>
                  <span className="font-semibold">/containers/:id</span> - Get
                  container details
                </li>
                <li className="p-2 bg-gray-50 rounded">
                  <span className="font-mono text-sm bg-blue-100 px-2 py-1 rounded mr-2">
                    POST
                  </span>
                  <span className="font-semibold">/containers</span> - Create
                  new container
                </li>
                <li className="p-2 bg-gray-50 rounded">
                  <span className="font-mono text-sm bg-yellow-100 px-2 py-1 rounded mr-2">
                    PUT
                  </span>
                  <span className="font-semibold">/containers/:id</span> -
                  Update container
                </li>
                <li className="p-2 bg-gray-50 rounded">
                  <span className="font-mono text-sm bg-red-100 px-2 py-1 rounded mr-2">
                    DELETE
                  </span>
                  <span className="font-semibold">/containers/:id</span> -
                  Delete container
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="zipcode">
          <Card>
            <CardHeader>
              <CardTitle>Zipcode API</CardTitle>
              <CardDescription>
                Base URL: {API_BASE_URL}
                {ZIPCODE_API_BASE_URL}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="p-2 bg-gray-50 rounded">
                  <span className="font-mono text-sm bg-green-100 px-2 py-1 rounded mr-2">
                    GET
                  </span>
                  <span className="font-semibold">/zipcode/lookup/:code</span> -
                  Lookup zipcode information
                </li>
                <li className="p-2 bg-gray-50 rounded">
                  <span className="font-mono text-sm bg-green-100 px-2 py-1 rounded mr-2">
                    GET
                  </span>
                  <span className="font-semibold">/zipcode/validate/:code</span>{" "}
                  - Validate zipcode
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipments">
          <Card>
            <CardHeader>
              <CardTitle>Shipments API</CardTitle>
              <CardDescription>
                Base URL: {API_BASE_URL}
                {AUTH_CODE}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="p-2 bg-gray-50 rounded">
                  <span className="font-mono text-sm bg-green-100 px-2 py-1 rounded mr-2">
                    GET
                  </span>
                  <span className="font-semibold">/shipments</span> - List all
                  shipments
                </li>
                <li className="p-2 bg-gray-50 rounded">
                  <span className="font-mono text-sm bg-green-100 px-2 py-1 rounded mr-2">
                    GET
                  </span>
                  <span className="font-semibold">/shipments/:id</span> - Get
                  shipment details
                </li>
                <li className="p-2 bg-gray-50 rounded">
                  <span className="font-mono text-sm bg-blue-100 px-2 py-1 rounded mr-2">
                    POST
                  </span>
                  <span className="font-semibold">/shipments</span> - Create new
                  shipment
                </li>
                <li className="p-2 bg-gray-50 rounded">
                  <span className="font-mono text-sm bg-yellow-100 px-2 py-1 rounded mr-2">
                    PUT
                  </span>
                  <span className="font-semibold">/shipments/:id</span> - Update
                  shipment
                </li>
                <li className="p-2 bg-gray-50 rounded">
                  <span className="font-mono text-sm bg-red-100 px-2 py-1 rounded mr-2">
                    DELETE
                  </span>
                  <span className="font-semibold">/shipments/:id</span> - Delete
                  shipment
                </li>
                <li className="p-2 bg-gray-50 rounded">
                  <span className="font-mono text-sm bg-blue-100 px-2 py-1 rounded mr-2">
                    POST
                  </span>
                  <span className="font-semibold">
                    /shipments/:id/documents
                  </span>{" "}
                  - Upload shipment document
                </li>
                <li className="p-2 bg-gray-50 rounded">
                  <span className="font-mono text-sm bg-green-100 px-2 py-1 rounded mr-2">
                    GET
                  </span>
                  <span className="font-semibold">/shipments/:id/tracking</span>{" "}
                  - Get shipment tracking info
                </li>
                <li className="p-2 bg-gray-50 rounded">
                  <span className="font-mono text-sm bg-blue-100 px-2 py-1 rounded mr-2">
                    POST
                  </span>
                  <span className="font-semibold">/shipments/:id/events</span> -
                  Log shipment event
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quotes">
          <Card>
            <CardHeader>
              <CardTitle>Quotes API</CardTitle>
              <CardDescription>
                Base URL: {API_BASE_URL}
                {AUTH_CODE}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="p-2 bg-gray-50 rounded">
                  <span className="font-mono text-sm bg-green-100 px-2 py-1 rounded mr-2">
                    GET
                  </span>
                  <span className="font-semibold">/quotes</span> - List all
                  quotes
                </li>
                <li className="p-2 bg-gray-50 rounded">
                  <span className="font-mono text-sm bg-green-100 px-2 py-1 rounded mr-2">
                    GET
                  </span>
                  <span className="font-semibold">/quotes/:id</span> - Get quote
                  details
                </li>
                <li className="p-2 bg-gray-50 rounded">
                  <span className="font-mono text-sm bg-blue-100 px-2 py-1 rounded mr-2">
                    POST
                  </span>
                  <span className="font-semibold">/quotes</span> - Create new
                  quote
                </li>
                <li className="p-2 bg-gray-50 rounded">
                  <span className="font-mono text-sm bg-yellow-100 px-2 py-1 rounded mr-2">
                    PUT
                  </span>
                  <span className="font-semibold">/quotes/:id</span> - Update
                  quote
                </li>
                <li className="p-2 bg-gray-50 rounded">
                  <span className="font-mono text-sm bg-red-100 px-2 py-1 rounded mr-2">
                    DELETE
                  </span>
                  <span className="font-semibold">/quotes/:id</span> - Delete
                  quote
                </li>
                <li className="p-2 bg-gray-50 rounded">
                  <span className="font-mono text-sm bg-blue-100 px-2 py-1 rounded mr-2">
                    POST
                  </span>
                  <span className="font-semibold">/quotes/:id/convert</span> -
                  Convert quote to shipment
                </li>
                <li className="p-2 bg-gray-50 rounded">
                  <span className="font-mono text-sm bg-blue-100 px-2 py-1 rounded mr-2">
                    POST
                  </span>
                  <span className="font-semibold">/quotes/ltl</span> - Get LTL
                  quotes
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
