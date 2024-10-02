import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosclient from "../../components/Apiclient/axiosclient";
import LoadingScreen from "../../components/LoadingScreen/Loading";

export const ObservationView = () => {
  const { species_id } = useParams<{ species_id: string }>();  // Assuming you're using `id` from the URL params
  const [speciesData, setSpeciesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSpeciesDetails = async () => {
      const speciesId = Number(species_id);
      try {
        const response = await axiosclient.get("/species_details", {
          params: { species_id:speciesId },  // Sending species_id as a query param
        });

        // Check the response data and handle appropriately
        if (response.status === 200) {
          setSpeciesData(response.data.data);  // Assuming the species data is in `data.data`
        } else {
          setError("Failed to fetch species details.");
        }
      } catch (err) {
        setError("Error fetching species details: " + err.message);
      } finally {
        setLoading(false);  // Stop loading after request completes
      }
    };

    fetchSpeciesDetails();
  }, []);  

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Species Details</h1>
      {speciesData ? (
        <div>
          <h2>{speciesData.name}</h2> {/* Render species details here */}
          <p>{JSON.stringify(speciesData, null, 2)}</p>
        </div>
      ) : (
        <div>No species details available.</div>
      )}
    </div>
  );
};

