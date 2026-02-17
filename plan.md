🌍 Backbone: A Real-Time Internet Infrastructure Simulator

Hybrid Map + Network Visualization (Weekend Project Plan)

⸻

1. Project Vision

Backbone is a real-time infrastructure simulation game where the player operates a global internet backbone provider.

The world map shows live regional traffic.
Animated network arcs visualize intercontinental data flow.
Real-time charts display traffic, congestion, and stability.

The player must:
	•	Increase regional capacity
	•	Manage peering quality
	•	Allocate DDoS defense
	•	Prevent cascading failures
	•	Maximize profit

No backend.
No persistence.
Fully static.
Deployable on GitHub Pages.

⸻

2. Core Design Constraints
	•	Runs entirely in browser
	•	React-based
	•	Static build (npm run build)
	•	Deployed via GitHub Pages
	•	No database
	•	No login
	•	Session

🌍 Backbone: A Real-Time Internet Infrastructure Simulator

Hybrid Map + Network Visualization (Weekend Project Plan)

⸻

1. Project Vision

Backbone is a real-time infrastructure simulation game where the player operates a global internet backbone provider.

The world map shows live regional traffic.
Animated network arcs visualize intercontinental data flow.
Real-time charts display traffic, congestion, and stability.

The player must:
	•	Increase regional capacity
	•	Manage peering quality
	•	Allocate DDoS defense
	•	Prevent cascading failures
	•	Maximize profit

No backend.
No persistence.
Fully static.
Deployable on GitHub Pages.

⸻

2. Core Design Constraints
	•	Runs entirely in browser
	•	React-based
	•	Static build (npm run build)
	•	Deployed via GitHub Pages
	•	No database
	•	No login
	•	Session-based gameplay (10–15 minutes)

⸻

3. Architecture Overview

Frontend Stack

Purpose	Tool
Framework	React
Map rendering	react-simple-maps (SVG-based)
Charts	Recharts
Animations	requestAnimationFrame + CSS
Data fetching	fetch + useEffect
State management	React hooks only

No Redux required.

⸻

4. Data Sources (Public APIs)

We need:
	•	Real-time or near-real-time internet traffic
	•	Public API access
	•	CORS-compatible or proxyable

4.1 Cloudflare Radar API

Provides:
	•	Country traffic trends
	•	Traffic anomalies
	•	DDoS activity

Example endpoint:

GET https://api.cloudflare.com/client/v4/radar/http/requests/summary

Example fetch usage:

async function fetchTraffic() {
  const response = await fetch("https://api.cloudflare.com/client/v4/radar/http/requests/summary");
  const data = await response.json();
  return data.result;
}

Use:
	•	Global traffic baseline
	•	Regional load factor

⸻

4.2 Internet Exchange Traffic (Example: DE-CIX)

Many IXPs expose JSON feeds or scrape-friendly endpoints.

Example concept:

https://api.de-cix.net/public/traffic

Usage:

async function fetchIXPTraffic() {
  const response = await fetch("https://api.de-cix.net/public/traffic");
  const data = await response.json();
  return data.currentThroughputTbps;
}

Use:
	•	EU demand baseline
	•	Volatility calculation

⸻

4.3 Fallback / Supplement: Public Market Data APIs

If live network data is limited, supplement volatility using:
	•	Commodity volatility APIs
	•	Public uptime monitoring APIs

But MVP should rely primarily on traffic indices.

⸻

5. Game Data Model

5.1 Live Inputs (From APIs)

globalTrafficIndex
euTraffic
usTraffic
asiaTraffic
volatilityIndex

Updated every 30–60 seconds.

⸻

5.2 Internal State

capacity = {
  eu: number,
  us: number,
  asia: number
}

defenseLevel
peeringQuality
budget
stability
profit
risk


⸻

6. Core Simulation Math

6.1 Congestion Formula

congestion = demand / capacity

6.2 Latency

latency = congestion²

6.3 Revenue

revenue = demand × peeringQuality × (1 - congestionPenalty)

Where:

if congestion > 1:
   congestionPenalty = congestion - 1
else:
   congestionPenalty = 0


⸻

6.4 Stability

stability = 100 - (avgCongestion × 50) - (risk × 10)

If stability < 40 → game over.

⸻

7. Hybrid Graphics Approach

7.1 World Map Layer

Using react-simple-maps:
	•	Base world map SVG
	•	Regions colored dynamically:
	•	Green: congestion < 0.7
	•	Yellow: 0.7–1.0
	•	Red: >1.0

Example:

<Geography
  geography={geo}
  fill={getRegionColor(regionCongestion)}
/>


⸻

7.2 Network Arc Overlay

Draw SVG arcs between:
	•	US ↔ EU
	•	EU ↔ Asia
	•	US ↔ Asia

Stroke width:

strokeWidth = demand / 100

Animate opacity pulse:

@keyframes pulse {
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
}


⸻

7.3 Flow Particles

Optional (MVP+):
	•	Small SVG circles moving along paths
	•	Speed proportional to traffic

Use requestAnimationFrame to update position.

⸻

8. Real-Time Charts

Using Recharts:

8.1 Traffic Line Chart
	•	X-axis: time
	•	Y-axis: traffic index
	•	Keep last 60 samples

Example:

<LineChart data={trafficHistory}>
  <Line type="monotone" dataKey="value" />
</LineChart>


⸻

8.2 Stability Gauge

Simple radial progress or horizontal bar:

width = stability %


⸻

9. UI Layout

-----------------------------------------------------
|                🌍 LIVE WORLD MAP                  |
|      (colored regions + animated arcs)            |
-----------------------------------------------------
| EU | US | ASIA status panels                      |
-----------------------------------------------------
| Controls:                                         |
| [Capacity +] [Defense +] [Peering Quality +]     |
-----------------------------------------------------
| Charts: Traffic | Stability | Profit              |
-----------------------------------------------------


⸻

10. Game Loop

Every 60 seconds:
	•	Fetch API data
	•	Update traffic baseline

Every second:
	•	Recalculate congestion
	•	Update revenue
	•	Update stability
	•	Push new point into chart history

Use:

useEffect(() => {
  const interval = setInterval(updateSimulation, 1000);
  return () => clearInterval(interval);
}, []);


⸻

11. Weekend Implementation Plan

Friday Night (2–3h)
	•	Setup React project
	•	Setup GitHub Pages deployment
	•	Install:
	•	react-simple-maps
	•	recharts
	•	Render static world map

⸻

Saturday Morning
	•	Integrate traffic API
	•	Display real traffic value
	•	Create chart
	•	Build region state model

⸻

Saturday Afternoon
	•	Implement congestion math
	•	Add capacity controls
	•	Add stability calculation
	•	Color regions dynamically

⸻

Saturday Evening
	•	Add animated arcs
	•	Add pulse animation
	•	Implement cascading failure logic

⸻

Sunday Morning
	•	Polish UI
	•	Improve transitions
	•	Add tooltips
	•	Add start / restart screen

⸻

Sunday Afternoon
	•	Performance tuning
	•	Deployment to GitHub Pages
	•	Final testing

⸻

12. GitHub Pages Deployment

Add to package.json:

"homepage": "https://yourusername.github.io/backbone"

Install:

npm install gh-pages --save-dev

Scripts:

"predeploy": "npm run build",
"deploy": "gh-pages -d build"

Deploy:

npm run deploy


⸻

13. Performance Considerations
	•	Keep animated elements under 200
	•	Store only last 60 data points
	•	Avoid heavy WebGL for MVP
	•	Use SVG for clarity and simplicity

⸻

14. Why This Is Feasible
	•	No backend required
	•	Public APIs
	•	No authentication flow
	•	Simple mathematical model
	•	SVG-based graphics
	•	Session-only game
	•	Weekend scope manageable

⸻

15. MVP Scope Checklist

✔ Live traffic fetch
✔ World map with dynamic region coloring
✔ Animated network arcs
✔ Real-time charts
✔ Congestion system
✔ Stability + failure condition
✔ Capacity upgrade buttons
✔ Deploy to GitHub Pages

⸻

16. Stretch Goals (Optional)
	•	Flow particles animation
	•	Random outage events
	•	Sound effects
	•	Zoomable map
	•	Dark cyberpunk theme

⸻

Final Result

You will have:
	•	A live global map reacting to real internet traffic
	•	Moving network lines
	•	Real-time charts
	•	A playable infrastructure management simulation
	•	Fully static deployment on GitHub Pages
	•	No persistence required

This is achievable in a focused weekend.

If you want, I can now generate:
	•	Folder structure
	•	Component breakdown
	•	Starter React template
	•	Or a simplified MVP-only blueprint