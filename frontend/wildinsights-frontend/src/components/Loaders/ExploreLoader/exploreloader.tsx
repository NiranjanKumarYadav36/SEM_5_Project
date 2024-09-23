/* eslint-disable @typescript-eslint/no-unused-vars */
import axiosclient from "../../Apiclient/axiosclient";

const exploreLoader = async () => {
  try {
    const response = await axiosclient.get("/explore");
    return response.data; 
  } catch (error: unknown) {
    if (Error instanceof Error) {
      // Generic error handling for non-Axios errors
      throw new Error(Error.message || "An unknown error occurred");
    } else {
      // Fallback for truly unknown error structures
      throw new Error("An unknown error occurred");
    }
  }
};

export default exploreLoader;
