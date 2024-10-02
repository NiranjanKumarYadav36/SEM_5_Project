import { useState, useEffect } from "react";
import axiosclient from "../../Apiclient/axiosclient";

interface IdentifyData {
  id: number;
  image: string; // Changed from URL to string
  common_name: string;
  scientific_name: string;
  username: string;
  no_identification_agreement: number;
  no_identification_disagreement: number;
}

export const useIdentifyLoader = (
  initialPage: number = 1, 
  isReviewed: boolean = false
) => {
  const [data, setData] = useState<IdentifyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);

  const itemsPerPage = 12;

  const fetchData = async (pageNumber: number, isReviewed: boolean) => {
    setLoading(true);
    setError(null); // Reset error before making the API request
    try {
      const endpoint = isReviewed ? "reviewed" : "species_identifications/";
      const response = await axiosclient.get(`${endpoint}?page=${pageNumber}&page_size=${itemsPerPage}`);
      const newData = response.data.results || [];
      console.log(newData);
      
      // Replace old data with the new data (no appending)
      setData(newData); 
      setHasMore(response.data.next !== null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page, isReviewed); // Fetch data when the page or isReviewed changes
  }, [page, isReviewed]);

  // Function to load a specific page
  const loadPage = (pageNumber: number) => {
    setPage(pageNumber);
  };

  return { data, loading, error, loadPage, hasMore, page, setPage, itemsPerPage };
};
