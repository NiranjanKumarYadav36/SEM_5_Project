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
  
  const itemsPerPage = 25;

  // Fetch data for a specific page
  const fetchData = async (pageNumber: number) => {
    setLoading(true);
    setError(null); // Reset error before making the API request
    try {
      const response = await axiosclient.get(`/identifiers?page=${pageNumber}&page_size=${itemsPerPage}`);
      const newData = response.data.results || []; // Assuming 'results' contains the paginated data

      setData(newData); // Replace existing data with new data
      setHasMore(response.data.next !== null); // Check if there are more pages
    } catch (err) {
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page); // Fetch data whenever the page number changes
  }, [page]);

  // Function to load a specific page
  const loadPage = (pageNumber: number) => {
    setPage(pageNumber);
  };

  return { data, loading, error, loadPage, hasMore, page, itemsPerPage };
}
