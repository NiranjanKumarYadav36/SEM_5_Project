/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import axiosclient from "../../../Apiclient/axiosclient";

interface PeopleData{
    username: string
    identifications: number
    observations_count: number
    last_active: string
}

export const peopleloader =() =>{
    const [data, setData] = useState<PeopleData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axiosclient.get("/community/people");
          setData(response.data.observations || []); // Set to an empty array if data is null or undefined
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