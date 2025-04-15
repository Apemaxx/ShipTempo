import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface QuoteResultsProps {
  quotes?: any[];
  onBookShipment?: (quoteId: string, carrierId: string) => void;
  isLoading?: boolean;
}

const QuoteResults: React.FC<QuoteResultsProps> = () => {
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-lg font-medium">Quote Results</p>
          <p className="mt-2 text-sm text-muted-foreground">
            The quote results component will be rebuilt.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteResults;
