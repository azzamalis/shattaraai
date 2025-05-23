import { Card } from "@/components/ui/card";

interface MetricCardProps {
  icon: JSX.Element;
  value: string;
  label: string;
}

export function MetricCard({ icon, value, label }: MetricCardProps) {
  return (
    <Card className="flex items-center p-4 gap-4 hover:bg-[#3A3A3A] transition bg-[#4B4B4B] border-0 shadow-lg hover:shadow-[#00A3FF]/10">
      <div className="bg-[#00A3FF]/20 p-2 rounded-md text-[#00A3FF]">{icon}</div>
      <div>
        <div className="text-xl font-bold text-white">{value}</div>
        <div className="text-sm text-[#A6A6A6]">{label}</div>
      </div>
    </Card>
  );
} 