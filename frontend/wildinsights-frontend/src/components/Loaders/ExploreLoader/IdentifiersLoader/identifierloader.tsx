/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import axiosclient from "../../../Apiclient/axiosclient";

interface IdentifierData {
  username: string;
  identifications: number;
}

export const useIdentifierData = () => {
  const [data, setData] = useState<IdentifierData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch data with pagination support
  const fetchData = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await axiosclient.get(`/identifiers?page=${pageNumber}&page_size=10`);
      const newData = response.data.results || []; // 'results' contains the paginated data

      setData((prevData) => [...prevData, ...newData]); // Append new data to existing data
      setHasMore(response.data.next !== null); // If 'next' is not null, there are more pages
    } catch (err) {
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  // Function to load more data (increment the page number)
  const loadMore = () => {
    if (hasMore && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  return { data, loading, error, loadMore, hasMore };
};
