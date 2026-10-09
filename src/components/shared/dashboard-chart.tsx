'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export interface ChartDatum {
  label: string;
  value: number;
  color?: string;
}

const AXIS = { fontSize: 12, fill: '#5b6472' };
const TOOLTIP = { borderRadius: 2, border: '1px solid #dde3e8', fontSize: 12 };

/** Bar chart. Each bar can carry its own colour (e.g. green = delivered, red = cancelled). */
export function DashboardChart({ data }: { data: ChartDatum[] }) {
  const crowded = data.length > 5;
  return (
    <div role="img" aria-label="Bar chart of shipment counts by status">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: crowded ? 24 : 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dde3e8" vertical={false} />
          <XAxis
            dataKey="label"
            tick={AXIS}
            axisLine={false}
            tickLine={false}
            interval={0}
            angle={crowded ? -25 : 0}
            textAnchor={crowded ? 'end' : 'middle'}
            height={crowded ? 64 : 30}
          />
          <YAxis tick={AXIS} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip contentStyle={TOOLTIP} cursor={{ fill: '#efece4' }} />
          <Bar dataKey="value" radius={[2, 2, 0, 0]} fill="#f0a202">
            {data.map((d) => (
              <Cell key={d.label} fill={d.color ?? '#f0a202'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Simple line chart for a short time series (e.g. new shipments per day). */
export function TrendChart({ data }: { data: ChartDatum[] }) {
  return (
    <div role="img" aria-label="Line chart of new shipments per day">
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dde3e8" vertical={false} />
          <XAxis dataKey="label" tick={AXIS} axisLine={false} tickLine={false} />
          <YAxis tick={AXIS} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip contentStyle={TOOLTIP} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#0f1b2d"
            strokeWidth={3}
            dot={{ r: 4, fill: '#f0a202', stroke: '#0f1b2d', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
