
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface MetricCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

export function MetricCard({
  icon,
  value,
  label
}: MetricCardProps) {
  return (
    <Card className="bg-card border-border shadow-lg hover:bg-card-hover transition-colors duration-200">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="text-primary">
            {icon}
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">{value}</div>
            <div className="text-sm text-muted-foreground">{label}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
