import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2, MessageSquare, FileText, Clock, DollarSign, Zap } from 'lucide-react';
import { useAIUsageTracking } from '@/hooks/useAIUsageTracking';

export function EnhancedLoadingIndicator({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <div className="absolute inset-0 h-6 w-6 rounded-full border-2 border-primary/20"></div>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">{message}</span>
          <span className="text-xs text-muted-foreground">Using smart content analysis...</span>
        </div>
      </div>
    </div>
  );
}

export function AIUsageDisplay() {
  const { usageStats, planLimits, isLoading, error, refreshStats } = useAIUsageTracking();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <EnhancedLoadingIndicator message="Loading usage stats" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-destructive">Error loading usage stats: {error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!usageStats || !planLimits) {
    return null;
  }

  const chatUsagePercent = (usageStats.chatRequests / planLimits.dailyChatLimit) * 100;
  const examUsagePercent = (usageStats.examGenerations / planLimits.dailyExamLimit) * 100;

  const getPlanColor = (planType: string) => {
    switch (planType) {
      case 'free': return 'bg-gray-500';
      case 'pro': return 'bg-blue-500';
      case 'enterprise': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getUsageColor = (percent: number) => {
    if (percent > 90) return 'bg-destructive';
    if (percent > 70) return 'bg-warning';
    return 'bg-primary';
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Plan Type */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
          <Badge className={`${getPlanColor(usageStats.planType)} text-white`}>
            {usageStats.planType.toUpperCase()}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold capitalize">{usageStats.planType}</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Cache: {planLimits.cacheDurationHours}h
          </p>
        </CardContent>
      </Card>

      {/* Chat Usage */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Chat Requests</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {usageStats.chatRequests}/{planLimits.dailyChatLimit}
          </div>
          <Progress 
            value={chatUsagePercent} 
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {Math.round(chatUsagePercent)}% used today
          </p>
        </CardContent>
      </Card>

      {/* Exam Generation Usage */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Exam Generations</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {usageStats.examGenerations}/{planLimits.dailyExamLimit}
          </div>
          <Progress 
            value={examUsagePercent} 
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {Math.round(examUsagePercent)}% used today
          </p>
        </CardContent>
      </Card>

      {/* Cost Tracking */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Cost</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${usageStats.totalCostUsd.toFixed(4)}
          </div>
          <p className="text-xs text-muted-foreground">
            {usageStats.totalTokensUsed.toLocaleString()} tokens
          </p>
        </CardContent>
      </Card>
    </div>
  );
}