declare module '@/components/ui/bar-chart' {
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

  export function BarChart(props: BarChartProps): JSX.Element;
} 