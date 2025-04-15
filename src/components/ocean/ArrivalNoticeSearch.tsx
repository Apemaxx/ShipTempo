import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ArrivalNoticeSearchParams,
  fetchArrivalNotices,
} from "@/lib/api/ocean";
import { ArrivalNoticeData } from "./ArrivalNotice";

const formSchema = z
  .object({
    containerNumber: z.string().optional(),
    billOfLading: z.string().optional(),
    bookingNumber: z.string().optional(),
    referenceNumber: z.string().optional(),
    dateFrom: z.date().optional(),
    dateTo: z.date().optional(),
  })
  .refine(
    (data) => {
      // At least one search field must be filled
      return (
        !!data.containerNumber ||
        !!data.billOfLading ||
        !!data.bookingNumber ||
        !!data.referenceNumber ||
        !!data.dateFrom ||
        !!data.dateTo
      );
    },
    {
      message: "At least one search field is required",
      path: ["containerNumber"],
    },
  );

type FormValues = z.infer<typeof formSchema>;

interface ArrivalNoticeSearchProps {
  onResultsFound: (results: ArrivalNoticeData[]) => void;
}

const ArrivalNoticeSearch: React.FC<ArrivalNoticeSearchProps> = ({
  onResultsFound,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      containerNumber: "",
      billOfLading: "",
      bookingNumber: "",
      referenceNumber: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      // Convert dates to string format for API
      const searchParams: ArrivalNoticeSearchParams = {
        containerNumber: data.containerNumber || undefined,
        billOfLading: data.billOfLading || undefined,
        bookingNumber: data.bookingNumber || undefined,
        referenceNumber: data.referenceNumber || undefined,
        dateFrom: data.dateFrom
          ? format(data.dateFrom, "yyyy-MM-dd")
          : undefined,
        dateTo: data.dateTo ? format(data.dateTo, "yyyy-MM-dd") : undefined,
      };

      const results = await fetchArrivalNotices(searchParams);
      onResultsFound(results);
    } catch (error) {
      console.error("Error searching for arrival notices:", error);
      // In a real app, you would show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Arrival Notices</CardTitle>
        <CardDescription>
          Enter search criteria to find arrival notices from STGUSA
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="containerNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Container Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter container number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="billOfLading"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bill of Lading</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter B/L number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bookingNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Booking Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter booking number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="referenceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter reference number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dateFrom"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date From</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateTo"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date To</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ArrivalNoticeSearch;
