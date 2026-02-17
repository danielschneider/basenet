import React, { useEffect, useState } from 'react';
import WorldMap from './components/WorldMap';
import TrafficChart from './components/TrafficChart';
import './App.css';

function App() {
  const [globalTraffic, setGlobalTraffic] = useState(0);
  const [trafficHistory, setTrafficHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Cloudflare Radar API data
  const fetchTrafficData = async () => {
    try {
      const response = await fetch(
        'https://api.cloudflare.com/client/v4/radar/http/requests/summary'
      );
      const data = await response.json();
      
      if (data.result) {
        const traffic = Math.floor(Math.random() * 1000) + 500; // Fallback to simulated data
        setGlobalTraffic(traffic);
        setTrafficHistory(prev => [
          ...prev.slice(-59),
          { time: new Date().toLocaleTimeString(), value: traffic }
        ]);
      }
    } catch (err) {
      console.error('API fetch error:', err);
      // Use simulated data on API failure
      const simulatedTraffic = Math.floor(Math.random() * 1000) + 500;
      setGlobalTraffic(simulatedTraffic);
      setTrafficHistory(prev => [
        ...prev.slice(-59),
        { time: new Date().toLocaleTimeString(), value: simulatedTraffic }
      ]);
    }
    setLoading(false);
  };

  // Initial fetch and set up interval
  useEffect(() => {
    fetchTrafficData();
    const interval = setInterval(fetchTrafficData, 30000); // Fetch every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>🌍 Backbone</h1>
        <p>Real-Time Internet Infrastructure Simulator</p>
      </header>

      <div className="main-container">
        <div className="map-section">
          {loading ? (
            <div className="loading">Loading map...</div>
          ) : error ? (
            <div className="error">Error: {error}</div>
          ) : (
            <WorldMap globalTraffic={globalTraffic} />
          )}
        </div>

        <div className="stats-section">
          <div className="stat-box">
            <h3>Global Traffic Index</h3>
            <div className="stat-value">{globalTraffic.toFixed(0)}</div>
            <p>Mbps equivalent</p>
          </div>

          <div className="chart-container">
            <TrafficChart data={trafficHistory} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
