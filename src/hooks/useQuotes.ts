import { useState, useCallback } from "react";
import { getLTLQuotes, saveQuote, getUserQuotes } from "@/lib/api/quotes";
import {
  LTLQuoteRequest,
  LTLQuoteCarrierRate,
  LTLQuoteResponse,
} from "@/types/api";
import { useAuth } from "@/contexts/AuthContext";

interface UseQuotesOptions {
  limit?: number;
  saveHistory?: boolean;
}

export default function useQuotes(options: UseQuotesOptions = {}) {
  const { limit = 5, saveHistory = true } = options;
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [quotes, setQuotes] = useState<LTLQuoteCarrierRate[]>([]);
  const [savedQuoteId, setSavedQuoteId] = useState<string | null>(null);
  const { user } = useAuth();

  /**
   * Fetch LTL quotes with the provided payload
   */
  const fetchLTLQuotes = useCallback(
    async (payload: LTLQuoteRequest) => {
      setLoading(true);
      setError(null);
      setSavedQuoteId(null);

      try {
        // Get quotes with specified limit
        const quoteResults = await getLTLQuotes(payload, limit);
        setQuotes(quoteResults);

        // Save quote to history if enabled and user is logged in
        if (saveHistory && user && quoteResults.length > 0) {
          const quoteResponse: LTLQuoteResponse = {
            success: true,
            quotes: quoteResults,
            request_id: `req-${Date.now()}`,
          };

          const savedId = await saveQuote(quoteResponse, user.id.toString());
          setSavedQuoteId(savedId);
        }

        return quoteResults;
      } catch (err: any) {
        const errorMessage = err.message || "Failed to fetch quotes";
        setError(errorMessage);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [limit, saveHistory, user],
  );

  /**
   * Get quote history for the current user
   */
  const getQuoteHistory = useCallback(
    async (historyLimit: number = 10) => {
      if (!user) {
        setError("User must be logged in to view quote history");
        return [];
      }

      setLoading(true);
      setError(null);

      try {
        const history = await getUserQuotes(user.id.toString(), historyLimit);
        return history;
      } catch (err: any) {
        const errorMessage = err.message || "Failed to fetch quote history";
        setError(errorMessage);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [user],
  );

  return {
    quotes,
    loading,
    error,
    savedQuoteId,
    fetchLTLQuotes,
    getQuoteHistory,
    clearError: () => setError(null),
  };
}
