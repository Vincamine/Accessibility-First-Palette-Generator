'use client';

import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DataPoint {
  label: string;
  value: number;
}

interface AreaChartProps {
  data: DataPoint[];
  colors: string[];
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export default function AreaChart({ data, colors, title, xAxisLabel, yAxisLabel }: AreaChartProps) {
  // Transform data to match Recharts format with color mapping
  const chartData = data.map((point, index) => ({
    name: point.label,
    value: point.value,
    color: colors[index] || colors[0],
  }));

  // Use gradient colors for area fill
  const primaryColor = colors[0] || '#3b82f6';
  const secondaryColor = colors[Math.floor(colors.length / 2)] || colors[0];

  // Custom dot to use different colors for each point
  const CustomDot = (props: { cx?: number; cy?: number; payload?: { color: string } }) => {
    const { cx, cy, payload } = props;
    if (!cx || !cy || !payload) return null;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
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
        <RechartsAreaChart
          data={chartData}
          margin={{ top: 10, right: 20, left: 10, bottom: 40 }}
        >
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={primaryColor} stopOpacity={0.8} />
              <stop offset="95%" stopColor={secondaryColor} stopOpacity={0.2} />
            </linearGradient>
          </defs>
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
          <Area
            type="monotone"
            dataKey="value"
            stroke={primaryColor}
            strokeWidth={2}
            fill="url(#colorGradient)"
            dot={<CustomDot />}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}
