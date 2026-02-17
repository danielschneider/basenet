# 🌍 Backbone - Real-Time Internet Infrastructure Simulator

A browser-based gameplay simulation where you manage a global internet backbone provider, responding to real-time traffic patterns.

## Features

- **Live World Map**: Dynamic region coloring based on network congestion
- **Animated Network Arcs**: Visualize intercontinental data flow between US, EU, and Asia
- **Real-Time Traffic Charts**: Monitor traffic patterns over time
- **Sim Mechanics**: Manage capacity, peering quality, and defenses
- **Fully Static**: Deployable on GitHub Pages with no backend required

## Tech Stack

- **React 18**: UI framework
- **react-simple-maps**: SVG-based world map rendering
- **Recharts**: Real-time data visualization
- **Cloudflare Radar API**: Live traffic data source

## Getting Started

### Prerequisites

- Node.js 14+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

## Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy

# Run tests
npm test
```

## Project Structure

```
basenet/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── WorldMap.js
│   │   ├── WorldMap.css
│   │   ├── TrafficChart.js
│   │   └── TrafficChart.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Game Mechanics (MVP)

### Congestion Formula
```
congestion = demand / capacity
```

### Revenue Calculation
```
revenue = demand × peeringQuality × (1 - congestionPenalty)
```

### Stability
```
stability = 100 - (avgCongestion × 50) - (risk × 10)
Game Over if stability < 40
```

## Deployment

The project is configured for GitHub Pages deployment:

1. Update `homepage` in `package.json` with your GitHub username
2. Install gh-pages: `npm install gh-pages --save-dev`
3. Deploy: `npm run deploy`

## API Data Source

Currently using:
- **Cloudflare Radar API**: `https://api.cloudflare.com/client/v4/radar/http/requests/summary`
- Fallback to simulated data if API is unavailable

## Next Steps (Stretch Goals)

- [ ] Add capacity upgrade buttons
- [ ] Implement stability calculations
- [ ] Add flow particle animations
- [ ] Random outage events
- [ ] Dark cyberpunk theme enhancements
- [ ] Zoomable map interactions
- [ ] Sound effects

## Development Notes

- Map updates every 30 seconds from API
- Chart keeps last 60 data points
- SVG-based rendering for performance
- No external API keys required (Cloudflare API is public)

## License

ISC