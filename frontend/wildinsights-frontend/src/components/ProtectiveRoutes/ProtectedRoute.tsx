import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axiosclient from '../Apiclient/axiosclient';
import useHandleLogout from '../Logout/logout'; 
import LoadingScreen from '../LoadingScreen/Loading';


const ProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);  // null means still checking
    const handleLogout = useHandleLogout();  

    useEffect(() => {
        const checkToken = async () => {
            try {
                const response = await axiosclient.get('/verify-token');
                // Check the status of the response from backend
                if (response.status === 200) {
                    setIsAuthenticated(true);  // Token is valid
                } else {
                    handleLogout();  // If token is invalid, log the user out
                }
            } catch {
                handleLogout();  // If token validation fails, log the user out
            }
        };

        checkToken();
    }, [handleLogout]);

    // While token check is still in progress
    if (isAuthenticated === null) {
        return <LoadingScreen />; 
    }

    // If not authenticated, redirect to login page
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // If authenticated, render the protected component
    return <Outlet />;
};

export default ProtectedRoute;


