import React, { useState, useEffect, useRef } from 'react';
import './WorldMap.css';

function WorldMap({ globalTraffic }) {
  const [regionStates, setRegionStates] = useState({
    US: { congestion: 0.4, x: 150, y: 350 },
    EU: { congestion: 0.5, x: 400, y: 300 },
    Russia: { congestion: 0.3, x: 500, y: 200 },
    India: { congestion: 0.6, x: 550, y: 400 },
    Australia: { congestion: 0.35, x: 700, y: 450 },
    'South Africa': { congestion: 0.25, x: 450, y: 500 }
  });
  const [particles, setParticles] = useState([]);
  const particleIdRef = useRef(0);
  const regionNames = Object.keys(regionStates);

  // Update congestion and generate traffic flow
  useEffect(() => {
    setRegionStates(prev => {
      const newStates = { ...prev };
      
      regionNames.forEach(region => {
        const baseVariance = 0.2 + Math.random() * 0.4;
        const newCongestion = (globalTraffic / 2000) * baseVariance;
        newStates[region] = {
          ...prev[region],
          congestion: Math.min(Math.max(newCongestion, 0.1), 1.5)
        };
      });

      return newStates;
    });

    // Generate particles for traffic flow
    if (Math.random() > 0.3) {
      const connections = [
        ['US', 'EU'],
        ['EU', 'Russia'],
        ['EU', 'India'],
        ['India', 'Australia'],
        ['Australia', 'South Africa'],
        ['US', 'India'],
        ['Russia', 'Australia'],
        ['South Africa', 'EU']
      ];

      connections.forEach(([from, to]) => {
        if (Math.random() < (regionStates[from].congestion + regionStates[to].congestion) / 4) {
          const fromRegion = regionStates[from];
          const toRegion = regionStates[to];
          
          const newParticle = {
            id: particleIdRef.current++,
            x: fromRegion.x,
            y: fromRegion.y,
            targetX: toRegion.x,
            targetY: toRegion.y,
            progress: 0,
            intensity: (fromRegion.congestion + toRegion.congestion) / 2
          };
          
          setParticles(prev => [...prev.slice(-40), newParticle]);
        }
      });
    }
  }, [globalTraffic, regionNames, regionStates]);

  // Animate particles
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            progress: p.progress + 0.015
          }))
          .filter(p => p.progress < 1)
      );
    }, 16);

    return () => clearInterval(animationInterval);
  }, []);

  const getHeatColor = (congestion) => {
    // Metal heat color scale: dark -> red -> orange -> yellow -> white
    if (congestion < 0.2) return '#1a1a2e';
    if (congestion < 0.4) return '#4a0000';
    if (congestion < 0.6) return '#cc3300';
    if (congestion < 0.8) return '#ff6600';
    if (congestion < 1.0) return '#ffcc00';
    return '#ffff00';
  };

  const getParticlePos = (p) => {
    const x = p.x + (p.targetX - p.x) * p.progress;
    const y = p.y + (p.targetY - p.y) * p.progress;
    return { x, y };
  };

  // Draw connections between regions
  const connections = [
    ['US', 'EU'],
    ['EU', 'Russia'],
    ['EU', 'India'],
    ['India', 'Australia'],
    ['Australia', 'South Africa'],
    ['US', 'India'],
    ['Russia', 'Australia'],
    ['South Africa', 'EU']
  ];

  return (
    <div className="world-map-container">
      <svg width="100%" height="100%" viewBox="0 0 900 600" preserveAspectRatio="xMidYMid">
        <defs>
          <filter id="heat-glow-dark">
            <feGaussianBlur stdDeviation="1" />
          </filter>
          <filter id="heat-glow-red">
            <feGaussianBlur stdDeviation="2" />
          </filter>
          <filter id="heat-glow-orange">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <filter id="heat-glow-yellow">
            <feGaussianBlur stdDeviation="4" />
          </filter>
          <radialGradient id="node-glow-dark" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4a2a2a" />
            <stop offset="100%" stopColor="#1a1a2e" />
          </radialGradient>
          <radialGradient id="node-glow-red" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff6644" />
            <stop offset="100%" stopColor="#cc3300" />
          </radialGradient>
          <radialGradient id="node-glow-orange" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffaa44" />
            <stop offset="100%" stopColor="#ff6600" />
          </radialGradient>
          <radialGradient id="node-glow-yellow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffff88" />
            <stop offset="100%" stopColor="#ffcc00" />
          </radialGradient>
        </defs>

        <rect width="900" height="600" fill="#0a0e27" />

        {/* Connection lines */}
        <g className="connections">
          {connections.map((conn, idx) => {
            const from = regionStates[conn[0]];
            const to = regionStates[conn[1]];
            const avgCongestion = (from.congestion + to.congestion) / 2;
            const lineColor = getHeatColor(avgCongestion);
            
            return (
              <line
                key={idx}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={lineColor}
                strokeWidth={Math.max(0.5, avgCongestion * 2)}
                opacity={0.4}
                className="connection"
                style={{ 
                  filter: `drop-shadow(0 0 2px ${lineColor})`,
                  transition: 'all 0.3s ease'
                }}
              />
            );
          })}
        </g>

        {/* Data flow particles */}
        <g className="particles">
          {particles.map(p => {
            const pos = getParticlePos(p);
            const heatColor = getHeatColor(p.intensity);
            const size = 2 + p.intensity * 3;
            return (
              <circle
                key={p.id}
                cx={pos.x}
                cy={pos.y}
                r={size}
                fill={heatColor}
                opacity={1 - p.progress * 0.8}
                className="particle"
                style={{ filter: `drop-shadow(0 0 ${size + 2}px ${heatColor})` }}
              />
            );
          })}
        </g>

        {/* Region nodes */}
        <g className="region-nodes">
          {regionNames.map((region, idx) => {
            const state = regionStates[region];
            const heatColor = getHeatColor(state.congestion);
            const gradientId = 
              state.congestion < 0.4 ? 'node-glow-dark' :
              state.congestion < 0.7 ? 'node-glow-red' :
              state.congestion < 0.9 ? 'node-glow-orange' :
              'node-glow-yellow';
            
            return (
              <g key={region}>
                {/* Outer pulse ring */}
                <circle
                  cx={state.x}
                  cy={state.y}
                  r={18}
                  fill="none"
                  stroke={heatColor}
                  strokeWidth="1"
                  opacity={0.3}
                  className="pulse-ring"
                  style={{ animation: `pulse-ring ${1 + state.congestion * 0.5}s infinite` }}
                />

                {/* Main node */}
                <circle
                  cx={state.x}
                  cy={state.y}
                  r={12}
                  fill={`url(#${gradientId})`}
                  stroke={heatColor}
                  strokeWidth="2"
                  className="node"
                  style={{ filter: `drop-shadow(0 0 ${8 + state.congestion * 4}px ${heatColor})` }}
                />

                {/* Region label */}
                <text
                  x={state.x}
                  y={state.y + 30}
                  textAnchor="middle"
                  fill={heatColor}
                  fontSize="13"
                  fontWeight="bold"
                  fontFamily="'Courier New', monospace"
                  className="region-label"
                  style={{ 
                    textShadow: `0 0 10px ${heatColor}`,
                    pointerEvents: 'none'
                  }}
                >
                  {region}
                </text>

                {/* Congestion value */}
                <text
                  x={state.x}
                  y={state.y - 20}
                  textAnchor="middle"
                  fill={heatColor}
                  fontSize="11"
                  fontFamily="'Courier New', monospace"
                  opacity="0.8"
                  style={{ pointerEvents: 'none' }}
                >
                  {(state.congestion * 100).toFixed(0)}%
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

export default WorldMap;
