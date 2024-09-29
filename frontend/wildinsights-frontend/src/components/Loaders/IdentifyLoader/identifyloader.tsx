/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import axiosclient from "../../Apiclient/axiosclient";

interface IdentifyData {
  image: URL;
  common_name: string;
  scientific_name: string;
  username: string;
  no_identification_agreement: number;
  no_identification_disagreement: number;
  user_id: string;
}

export const useIdentifyLoader = (initialPage: number = 1) => {
  const [data, setData] = useState<IdentifyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage); // Allow initial page to be set externally
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await axiosclient.get(`species_identifications/?page=${pageNumber}&page_size=12`);
      const newData = response.data || []; // Adjust to match the actual structure of your API response

      // Append new data to existing data
      setData((prevData) => [...prevData, ...newData]); 
      
      // Check if there's a next page based on the API response
      setHasMore(response.data.next !== null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page); // Fetch data when the page changes
  }, [page]);

  // Function to load more data by incrementing the page number
  const loadMore = () => {
    if (hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };
  // Expose current page for potential use in the component
  return { data, loading, error, loadMore, hasMore, page, setPage };
};