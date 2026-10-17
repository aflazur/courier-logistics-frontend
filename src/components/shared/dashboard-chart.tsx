'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Legend,
  Pie,
  PieChart,
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

const AXIS = { fontSize: 12, fill: 'var(--color-ink-500)' };
const TOOLTIP = {
  borderRadius: 2,
  border: '1px solid var(--color-ink-100)',
  fontSize: 12,
  background: 'var(--color-surface)',
  color: 'var(--color-ink-900)',
};

/** Bar chart. Each bar can carry its own colour (e.g. green = delivered, red = cancelled). */
export function DashboardChart({ data }: { data: ChartDatum[] }) {
  const crowded = data.length > 5;
  return (
    <div role="img" aria-label="Bar chart of shipment counts by status" className="overflow-x-clip">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: crowded ? 24 : 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-ink-100)" vertical={false} />
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
          <Tooltip contentStyle={TOOLTIP} cursor={{ fill: 'var(--color-chalk-100)' }} />
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
    <div role="img" aria-label="Line chart of new shipments per day" className="overflow-x-clip">
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-ink-100)" vertical={false} />
          <XAxis dataKey="label" tick={AXIS} axisLine={false} tickLine={false} />
          <YAxis tick={AXIS} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip contentStyle={TOOLTIP} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--color-ink-900)"
            strokeWidth={3}
            dot={{ r: 4, fill: '#f0a202', stroke: 'var(--color-ink-900)', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Donut chart for share-of-total data (e.g. delivered vs in progress vs problem). */
export function StatusPieChart({ data }: { data: ChartDatum[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  return (
    <div role="img" aria-label="Pie chart of shipment outcome share">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius={56}
            outerRadius={96}
            paddingAngle={2}
            stroke="var(--color-surface)"
            strokeWidth={2}
          >
            {data.map((d) => (
              <Cell key={d.label} fill={d.color ?? '#f0a202'} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={TOOLTIP}
            formatter={(value, name) => [
              `${value} (${total ? Math.round((Number(value) / total) * 100) : 0}%)`,
              name,
            ]}
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{ fontSize: 12, color: 'var(--color-ink-500)' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
