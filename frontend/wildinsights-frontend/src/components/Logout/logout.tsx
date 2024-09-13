import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

const useHandleLogout = () => {
    const navigate = useNavigate();  // Moved useNavigate outside the function

    const handleLogout = useCallback(async () => {
        try {
            await axios.post('http://localhost:8000/api/logout', {}, {
                headers: { 'Content-Type': 'application/json' },  // Correct placement of headers
                withCredentials: true  // withCredentials is correct here
            });
            navigate("/Login");
        } catch (error) {
            console.error(error);
        }
    }, [navigate]);  // useCallback memoizes the function and depends on `navigate`

    return handleLogout;
};

export default useHandleLogout;