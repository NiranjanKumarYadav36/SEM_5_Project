import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import useHandleLogout from '../Logout/logout'; 


const ProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);  // null means still checking
    const handleLogout = useHandleLogout();  

    useEffect(() => {
        const checkToken = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/verify-token', {
                    withCredentials: true,
                });

                // Check the status of the response from backend
                if (response.status === 200) {
                    setIsAuthenticated(true);  // Token is valid
                } else {
                    handleLogout();  // If token is invalid, log the user out
                }
            } catch (error) {
                console.error('Token validation failed', error);
                handleLogout();  // If token validation fails, log the user out
            }
        };

        checkToken();
    }, [handleLogout]);

    // While token check is still in progress
    if (isAuthenticated === null) {
        return <div>Loading...</div>;  // You can show a loading spinner here
    }

    // If not authenticated, redirect to login page
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // If authenticated, render the protected component
    return <Outlet />;
};

export default ProtectedRoute;


