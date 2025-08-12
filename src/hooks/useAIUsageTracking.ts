import { useState, useEffect } from 'react';

interface UsageStats {
  chatRequests: number;
  examGenerations: number;
  totalTokensUsed: number;
  totalCostUsd: number;
  planType: 'free' | 'pro' | 'enterprise';
}

interface PlanLimits {
  dailyChatLimit: number;
  dailyExamLimit: number;
  cacheDurationHours: number;
  planType: 'free' | 'pro' | 'enterprise';
}

interface RateLimitInfo {
  allowed: boolean;
  remaining: number;
  resetTime: string;
  planType: 'free' | 'pro' | 'enterprise';
}

export function useAIUsageTracking() {
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [planLimits, setPlanLimits] = useState<PlanLimits | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsageStats = async () => {
    try {
      setIsLoading(true);
      
      // For now, return mock data since the tables are newly created
      // and may not be in the TypeScript types yet
      setUsageStats({
        chatRequests: 5,
        examGenerations: 1,
        totalTokensUsed: 15000,
        totalCostUsd: 0.0025,
        planType: 'free'
      });

      setPlanLimits({
        dailyChatLimit: 50,
        dailyExamLimit: 5,
        cacheDurationHours: 24,
        planType: 'free'
      });

    } catch (err) {
      console.error('Error fetching usage stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch usage stats');
    } finally {
      setIsLoading(false);
    }
  };

  const checkRateLimit = async (requestType: 'chat' | 'exam'): Promise<RateLimitInfo | null> => {
    try {
      // Mock rate limit check for now
      return {
        allowed: true,
        remaining: requestType === 'chat' ? 45 : 4,
        resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        planType: 'free'
      };
    } catch (err) {
      console.error('Error checking rate limit:', err);
      return null;
    }
  };

  const getCacheStats = async () => {
    try {
      // Mock cache stats for now
      return {
        totalHits: 25,
        totalCached: 10,
        cacheHitRate: 0.4
      };
    } catch (err) {
      console.error('Error fetching cache stats:', err);
      return null;
    }
  };

  useEffect(() => {
    fetchUsageStats();
  }, []);

  const refreshStats = () => {
    fetchUsageStats();
  };

  return {
    usageStats,
    planLimits,
    isLoading,
    error,
    checkRateLimit,
    getCacheStats,
    refreshStats
  };
}