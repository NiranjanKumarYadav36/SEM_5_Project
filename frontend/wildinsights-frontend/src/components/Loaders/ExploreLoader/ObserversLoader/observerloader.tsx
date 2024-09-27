/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import axiosclient from "../../../Apiclient/axiosclient";

interface ObserverData {
  username: string;
  count: number;
}

export const useObserverData = () => {
  const [data, setData] = useState<ObserverData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await axiosclient.get(`/total-observers?page=${pageNumber}&page_size=10`);
      const newData = response.data.results || []; // Use 'results' from the paginated response

      setData((prevData) => [...prevData, ...newData]); // Append new data to existing data
      setHasMore(response.data.next !== null); // Check if there's a next page
    } catch (err) {
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page); // Fetch data when the component mounts or when the page changes
  }, [page]);

  // Function to load more data by incrementing the page number
  const loadMore = () => {
    if (hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return { data, loading, error, loadMore, hasMore };
};
