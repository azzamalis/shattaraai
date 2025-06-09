import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface MetricCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

export function MetricCard({ icon, value, label }: MetricCardProps) {
  return (
    <Card className="bg-dashboard-card border-dashboard-separator shadow-lg hover:bg-dashboard-card-hover transition-colors duration-200">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-lg text-dashboard-icons">
            {icon}
          </div>
          <div>
            <div className="text-2xl font-bold text-dashboard-text">{value}</div>
            <div className="text-sm text-dashboard-text-secondary">{label}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
