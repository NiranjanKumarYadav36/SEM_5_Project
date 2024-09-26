/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import axiosclient from "../../../Apiclient/axiosclient";

interface IdentifierData {
  username: string;
  identifications: number;
}

export const identifierdata = () => {
  const [data, setData] = useState<IdentifierData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosclient.get("/identifiers");
        setData(response.data.data || []);
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); // Trigger effect when page changes

  return { data, loading, error };
};