'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export function DashboardChart({ data }: { data: { label: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#dde3e8" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12, fill: '#5b6472' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis tick={{ fontSize: 12, fill: '#5b6472' }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ borderRadius: 2, border: '1px solid #dde3e8', fontSize: 12 }}
          cursor={{ fill: '#efece4' }}
        />
        <Bar dataKey="value" fill="#f0a202" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
