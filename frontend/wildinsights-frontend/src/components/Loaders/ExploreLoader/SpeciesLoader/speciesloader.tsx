/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import axiosclient from "../../../Apiclient/axiosclient";

interface SpeciesData {
  count: number;
  common_name: string;
  image: URL;
  observation_count: number;
  scientific_name : string
}

export const speciesdata = () => {
  const [data, setData] = useState<SpeciesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosclient.get("/species-count");
        setData(response.data.data || []); // Set to an empty array if data is null or undefined
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, loading, error };
};
