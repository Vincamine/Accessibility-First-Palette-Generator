'use client';

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DataPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  colors: string[];
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export default function LineChart({ data, colors, title, xAxisLabel, yAxisLabel }: LineChartProps) {
  // Transform data to match Recharts format with color mapping
  const chartData = data.map((point, index) => ({
    name: point.label,
    value: point.value,
    color: colors[index] || colors[0],
  }));

  // Use first color for the line stroke
  const lineColor = colors[0] || '#3b82f6';

  // Custom dot to use different colors for each point
  const CustomDot = (props: { cx?: number; cy?: number; payload?: { color: string } }) => {
    const { cx, cy, payload } = props;
    if (!cx || !cy || !payload) return null;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill={payload.color}
        stroke="#fff"
        strokeWidth={2}
      />
    );
  };

  return (
    <div className="w-full h-full flex flex-col">
      {title && (
        <h4 className="text-sm font-medium text-gray-700 text-center mb-2">{title}</h4>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
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
          <Line
            type="monotone"
            dataKey="value"
            stroke={lineColor}
            strokeWidth={2}
            dot={<CustomDot />}
            activeDot={{ r: 7, strokeWidth: 2 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
