import React, { useState, useEffect } from 'react';

// This component can be added to your login page to check API connection
const ApiHealthCheck = () => {
  const [apiStatus, setApiStatus] = useState('checking');
  const [responseTime, setResponseTime] = useState(null);
  
  useEffect(() => {
    const checkApiHealth = async () => {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://medicine-inventory-management-backend.onrender.com';
      const startTime = Date.now();
      
      try {
        // Use a simple endpoint like health check or options request
        const response = await fetch(`${apiUrl}/api/health`, { 
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
          // Short timeout for health check
          signal: AbortSignal.timeout(5000)
        });
        
        const endTime = Date.now();
        setResponseTime(endTime - startTime);
        
        if (response.ok) {
          setApiStatus('online');
        } else {
          setApiStatus('error');
        }
      } catch (error) {
        console.error('API health check failed:', error);
        setApiStatus('offline');
      }
    };
    
    checkApiHealth();
  }, []);
  
  // Render status indicator
  const getStatusBadge = () => {
    switch (apiStatus) {
      case 'online':
        return (
          <div className="flex items-center text-sm">
            <span className="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
            <span className="text-green-600">
              API Online {responseTime && `(${responseTime}ms)`}
            </span>
          </div>
        );
      case 'offline':
        return (
          <div className="flex items-center text-sm">
            <span className="w-2 h-2 mr-1 bg-red-500 rounded-full"></span>
            <span className="text-red-600">
              API Offline - Server may be down
            </span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center text-sm">
            <span className="w-2 h-2 mr-1 bg-yellow-500 rounded-full"></span>
            <span className="text-yellow-600">
              API Error {responseTime && `(${responseTime}ms)`}
            </span>
          </div>
        );
      default:
        return (
          <div className="flex items-center text-sm">
            <span className="w-2 h-2 mr-1 bg-gray-300 rounded-full animate-pulse"></span>
            <span className="text-gray-600">
              Checking API status...
            </span>
          </div>
        );
    }
  };
  
  return (
    <div className="text-center mt-2">
      {getStatusBadge()}
    </div>
  );
};

export default ApiHealthCheck;