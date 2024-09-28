/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import axiosclient from "../../Apiclient/axiosclient";

interface ObservationData {
  category: string;
  common_name: string;
  image: URL;
  latitude: number;
  longitude: number;
  username: string;
}

export const useObservationData = () => {
  const [data, setData] = useState<ObservationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosclient.get("/explore");
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
