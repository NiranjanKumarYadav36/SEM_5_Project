import { useQuery } from "@tanstack/react-query";
import axiosclient from "../../Apiclient/axiosclient";

// Fetch data using React Query in the loader
const exploreLoader = async () => {
  const [getResult, setGetResult] = useState(null);

  const fortmatResponse = (res) => {
    return JSON.stringify(res, null, 2);
  };

  const { error, initialdata } = useQuery("oservationsdata", async () => {
    return await axiosclient.get("/observations");
  }
    );
  if (error) {
    return error.message;
  }
  return initialdata.data.url;
};

export default exploreLoader;
