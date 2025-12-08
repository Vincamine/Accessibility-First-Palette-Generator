'use client';

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DataPoint {
  label: string;
  value: number;
}

interface BarChartProps {
  data: DataPoint[];
  colors: string[];
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export default function BarChart({ data, colors, title, xAxisLabel, yAxisLabel }: BarChartProps) {
  // Transform data to match Recharts format
  const chartData = data.map((point, index) => ({
    name: point.label,
    value: point.value,
    fill: colors[index] || colors[0],
  }));

  return (
    <div className="w-full h-full flex flex-col">
      {title && (
        <h4 className="text-sm font-medium text-gray-700 text-center mb-2">{title}</h4>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={chartData}
          margin={{ top: 10, right: 20, left: 10, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
            label={xAxisLabel ? { value: xAxisLabel, position: 'bottom', offset: 0 } : undefined}
            tick={{ fontSize: 11 }}
            stroke="#6b7280"
          />
          <YAxis
            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', style: { fontSize: 11 } } : undefined}
            tick={{ fontSize: 11 }}
            stroke="#6b7280"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="value" />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
