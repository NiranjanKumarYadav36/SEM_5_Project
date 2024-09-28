/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import axiosclient from "../../../Apiclient/axiosclient";

interface SpeciesData {
  count: number;
  common_name: string;
  image: URL;
  observations_count: number;
  scientific_name: string;
}

export const useSpeciesData = () => {
  const [data, setData] = useState<SpeciesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1); // Add page state for pagination
  const [hasMore, setHasMore] = useState(true); // Track if there's more data to load
  const itemsPerPage = 16; // Number of items per page (you can adjust this)

  // Fetch paginated data
  const fetchData = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await axiosclient.get(`/species-count?page=${pageNumber}&page_size=${itemsPerPage}`);
      const newSpecies = response.data.results || []; // Assuming 'results' contains the paginated data
      setData((prevData) => [...prevData, ...newSpecies]); // Append new data to existing data
      setHasMore(response.data.next !== null); // If 'next' is not null, there are more pages
    } catch (err) {
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]); // Fetch new data when 'page' changes

  // Function to load more data (next page)
  const loadPage = (pageNumber: number) => {
    setPage(pageNumber);
  };
  console.log(data)
  return { data, loading, error, loadPage, page , hasMore };
};