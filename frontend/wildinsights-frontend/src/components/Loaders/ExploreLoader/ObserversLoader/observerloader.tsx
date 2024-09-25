/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import axiosclient from "../../../Apiclient/axiosclient";

interface ObserverData {
  username: string;
  count: number;
}

export const observerdata = () => {
  const [observers, setObservers] = useState<ObserverData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async (pageNumber: number) => {
    try {
      const response = await axiosclient.get(`/observers?page=${pageNumber}&limit=10`);
      const newObservers = response.data.data || [];
      
      setObservers(prev => [...prev, ...newObservers]);
      setHasMore(newObservers.length > 0); // Check if more data is available
    } catch (err) {
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const loadMore = () => {
    if (hasMore) {
      setPage(prev => prev + 1); // Increment page to load more data
    }
  };

  return { observers, loading, error, loadMore };
};
