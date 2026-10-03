import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-card px-4 py-3 rounded-xl border border-blue-500/20 shadow-xl">
                <p className="text-xs font-semibold text-foreground mb-2">{label}</p>
                {payload.map(p => (
                    <p key={p.name} className="text-xs" style={{ color: p.fill }}>
                        {p.name}: <span className="font-bold">{p.value}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function WeeklyBarChart({ data = [] }) {
    if (!data.length) {
        // Generate placeholder data for last 7 days
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        data = days.map(day => ({ day, Resolved: 0, Pending: 0 }));
    }

    return (
        <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                    dataKey="day"
                    tick={{ fill: '#5f7a65', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                />
                <YAxis
                    tick={{ fill: '#5f7a65', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => <span style={{ color: '#86a08b', fontSize: '11px' }}>{value}</span>}
                />
                <Bar dataKey="Resolved" fill="#309a5c" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
        </ResponsiveContainer>
    );
}
