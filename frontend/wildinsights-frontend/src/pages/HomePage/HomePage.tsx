import React from "react";
import { useLoaderData } from "react-router-dom";

export const fetchEmptyJSON = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1'); // Empty or dummy JSON URL
    if (!response.ok) {
      throw new Error('Failed to load data');
    }
    return response.json();
};
  
function HomePage(){
    const profile_data = useLoaderData()
    return(
        <div>
            <h1>Homepage</h1>
        </div>
    )
}

export default HomePage
