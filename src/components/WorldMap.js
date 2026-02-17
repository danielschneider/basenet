import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import './WorldMap.css';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

function WorldMap({ globalTraffic }) {
  const [regionStates, setRegionStates] = useState({
    EU: { congestion: 0.5 },
    US: { congestion: 0.6 },
    ASIA: { congestion: 0.7 }
  });

  // Simulate region-specific congestion based on global traffic
  useEffect(() => {
    const euCongestion = (globalTraffic / 2000) * Math.random() * 0.3 + 0.3;
    const usCongestion = (globalTraffic / 1800) * Math.random() * 0.3 + 0.3;
    const asiaCongestion = (globalTraffic / 2200) * Math.random() * 0.3 + 0.3;

    setRegionStates({
      EU: { congestion: Math.min(euCongestion, 1.5) },
      US: { congestion: Math.min(usCongestion, 1.5) },
      ASIA: { congestion: Math.min(asiaCongestion, 1.5) }
    });
  }, [globalTraffic]);

  const getRegionColor = (congestion) => {
    if (congestion < 0.7) return '#00ff88'; // Green - healthy
    if (congestion < 1.0) return '#ffff00'; // Yellow - warning
    return '#ff4444'; // Red - critical
  };

  const getRegionOpacity = (congestion) => {
    return 0.5 + congestion * 0.5;
  };

  return (
    <div className="world-map-container">
      <ComposableMap projection="geoMercator">
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              let regionState = { congestion: 0.5 };
              
              // Assign regions
              if (geo.properties.name) {
                const name = geo.properties.name.toLowerCase();
                if (
                  ['germany', 'france', 'netherlands', 'united kingdom', 'italy', 'spain'].some(
                    c => name.includes(c)
                  )
                ) {
                  regionState = regionStates.EU;
                } else if (
                  ['united states', 'canada', 'mexico'].some(c => name.includes(c))
                ) {
                  regionState = regionStates.US;
                } else if (
                  ['china', 'japan', 'south korea', 'india', 'singapore', 'australia'].some(
                    c => name.includes(c)
                  )
                ) {
                  regionState = regionStates.ASIA;
                }
              }

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: {
                      fill: getRegionColor(regionState.congestion),
                      stroke: '#1a3a52',
                      strokeWidth: 0.75,
                      outline: 'none',
                      opacity: getRegionOpacity(regionState.congestion),
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    },
                    hover: {
                      fill: '#00ff88',
                      stroke: '#00ff88',
                      strokeWidth: 1.5,
                      outline: 'none',
                      opacity: 1,
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    },
                    pressed: {
                      fill: '#00ff88',
                      stroke: '#00ff88',
                      strokeWidth: 1.5,
                      outline: 'none',
                      opacity: 1
                    }
                  }}
                  title={`${geo.properties.name} - Congestion: ${(regionState.congestion * 100).toFixed(1)}%`}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      <svg
        className="network-arcs"
        viewBox="0 0 960 600"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        {/* EU to US arc */}
        <path
          d="M 350 300 Q 600 150 850 280"
          stroke={getRegionColor(
            (regionStates.EU.congestion + regionStates.US.congestion) / 2
          )}
          strokeWidth={Math.max(1, (regionStates.EU.congestion + regionStates.US.congestion) / 4)}
          fill="none"
          opacity="0.6"
          className="pulse"
        />

        {/* EU to ASIA arc */}
        <path
          d="M 450 280 Q 700 100 850 200"
          stroke={getRegionColor(
            (regionStates.EU.congestion + regionStates.ASIA.congestion) / 2
          )}
          strokeWidth={Math.max(1, (regionStates.EU.congestion + regionStates.ASIA.congestion) / 4)}
          fill="none"
          opacity="0.6"
          className="pulse"
          style={{ animationDelay: '0.5s' }}
        />

        {/* US to ASIA arc */}
        <path
          d="M 750 300 Q 850 200 850 180"
          stroke={getRegionColor(
            (regionStates.US.congestion + regionStates.ASIA.congestion) / 2
          )}
          strokeWidth={Math.max(1, (regionStates.US.congestion + regionStates.ASIA.congestion) / 4)}
          fill="none"
          opacity="0.6"
          className="pulse"
          style={{ animationDelay: '1s' }}
        />
      </svg>
    </div>
  );
}

export default WorldMap;
