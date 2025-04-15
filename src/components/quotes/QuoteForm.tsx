import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const QuoteForm = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Create New Quote</h1>
      <Card>
        <CardHeader>
          <CardTitle>Quote Form</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The quote form will be rebuilt here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuoteForm;
