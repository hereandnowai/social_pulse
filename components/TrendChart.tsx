
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendDataPoint } from '../types';

interface TrendChartProps {
  data: TrendDataPoint[];
}

export const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="positive" stroke="#22C55E" activeDot={{ r: 8 }} name="Positive (%)" />
          <Line type="monotone" dataKey="negative" stroke="#EF4444" name="Negative (%)" />
          <Line type="monotone" dataKey="neutral" stroke="#6B7280" name="Neutral (%)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
