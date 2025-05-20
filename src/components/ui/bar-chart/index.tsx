import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BarChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor: string;
    }>;
  };
}

export function BarChart({ data }: BarChartProps) {
  // Transform the data to the format expected by Recharts
  const transformedData = data.labels.map((label, index) => ({
    name: label,
    ...data.datasets.reduce((acc, dataset) => ({
      ...acc,
      [dataset.label]: dataset.data[index],
    }), {}),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={transformedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {data.datasets.map((dataset, index) => (
          <Bar
            key={dataset.label}
            dataKey={dataset.label}
            fill={dataset.backgroundColor}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
} 