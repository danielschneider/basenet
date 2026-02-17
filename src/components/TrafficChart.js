import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import './TrafficChart.css';

function TrafficChart({ data }) {
  return (
    <div className="traffic-chart">
      <h3>Traffic History (Last Minute)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1a3a52" />
          <XAxis 
            dataKey="time" 
            stroke="#666"
            style={{ fontSize: '0.75em' }}
            tick={{ fill: '#888' }}
          />
          <YAxis 
            stroke="#666"
            style={{ fontSize: '0.75em' }}
            tick={{ fill: '#888' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(10, 14, 39, 0.9)',
              border: '1px solid #00ff88',
              borderRadius: '4px',
              color: '#00ff88'
            }}
            labelStyle={{ color: '#00ff88' }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#00ff88"
            dot={false}
            strokeWidth={2}
            isAnimationActive={false}
            name="Traffic (Mbps)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TrafficChart;
