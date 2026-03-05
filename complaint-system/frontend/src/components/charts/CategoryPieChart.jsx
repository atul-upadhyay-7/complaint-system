import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ELECTRIC_BLUE_COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1'];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-card px-4 py-3 rounded-xl border border-blue-500/20 shadow-xl">
                <p className="text-sm font-semibold text-foreground">{payload[0].name}</p>
                <p className="text-xs text-blue-400 mt-1">{payload[0].value} complaints</p>
            </div>
        );
    }
    return null;
};

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

export default function CategoryPieChart({ data = [] }) {
    if (!data.length) {
        return (
            <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
                No category data available
            </div>
        );
    }

    const chartData = data.map(d => ({ name: d._id, value: d.count }));

    return (
        <ResponsiveContainer width="100%" height={280}>
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomLabel}
                >
                    {chartData.map((_, i) => (
                        <Cell
                            key={i}
                            fill={ELECTRIC_BLUE_COLORS[i % ELECTRIC_BLUE_COLORS.length]}
                            stroke="rgba(0,0,0,0.2)"
                            strokeWidth={1}
                        />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '11px' }}>{value}</span>}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}
