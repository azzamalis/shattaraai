
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Zap, Upload, Mic, FileText, GraduationCap, Home } from "lucide-react";

interface UsageLimits {
  chats: { used: number; total: number };
  uploads: { used: number; total: number };
  recording: { used: number; total: number };
  summaries: { used: number; total: number };
  exams: { used: number; total: number };
  rooms: { used: number; total: number };
}

interface SubscriptionData {
  planType: 'free' | 'pro';
  expiryDate?: string;
  limits?: UsageLimits;
}

// Mock data - in a real app this would come from your backend
const mockSubscriptionData: SubscriptionData = {
  planType: 'free',
  limits: {
    chats: { used: 47, total: 100 },
    uploads: { used: 18, total: 25 },
    recording: { used: 180, total: 300 },
    summaries: { used: 12, total: 20 },
    exams: { used: 3, total: 5 },
    rooms: { used: 2, total: 3 }
  }
};

const getProgressColor = (percentage: number) => {
  if (percentage <= 25) return "bg-[#0E8345]"; // Green
  if (percentage <= 50) return "bg-[#F6BC2F]"; // Yellow
  return "bg-[#DE1135]"; // Red
};

const getProgressPercentage = (used: number, total: number) => {
  return Math.round((used / total) * 100);
};

const LimitItem = ({ 
  icon: Icon, 
  label, 
  used, 
  total, 
  unit = "" 
}: {
  icon: React.ElementType;
  label: string;
  used: number;
  total: number;
  unit?: string;
}) => {
  const percentage = getProgressPercentage(used, total);
  const progressColor = getProgressColor(percentage);
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>
        <span className="text-sm font-medium text-foreground">
          {used}{unit} / {total}{unit}
        </span>
      </div>
      <div className="relative">
        <Progress value={percentage} className="h-2" />
        <div 
          className={`absolute top-0 left-0 h-2 rounded-full transition-all ${progressColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export function SubscriptionPlanCard() {
  const subscription = mockSubscriptionData;

  if (subscription.planType === 'pro') {
    return (
      <Card className="card-enhanced border-0">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Subscription Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-none">
                <Crown className="h-3 w-3 mr-1" />
                Pro Plan
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">
                Unlimited access to all features
              </p>
            </div>
          </div>
          
          {subscription.expiryDate && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Plan expires on: <span className="font-medium text-foreground">
                  {new Date(subscription.expiryDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </p>
            </div>
          )}
          
          <Button variant="outline" className="w-full">
            Manage Subscription
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-enhanced border-0">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Subscription Plan
          </div>
          <Badge variant="outline" className="text-muted-foreground">
            Free Plan
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <LimitItem
            icon={FileText}
            label="AI Chats"
            used={subscription.limits!.chats.used}
            total={subscription.limits!.chats.total}
          />
          
          <LimitItem
            icon={Upload}
            label="Uploads"
            used={subscription.limits!.uploads.used}
            total={subscription.limits!.uploads.total}
          />
          
          <LimitItem
            icon={Mic}
            label="Recording"
            used={subscription.limits!.recording.used}
            total={subscription.limits!.recording.total}
            unit=" min"
          />
          
          <LimitItem
            icon={FileText}
            label="Summaries"
            used={subscription.limits!.summaries.used}
            total={subscription.limits!.summaries.total}
          />
          
          <LimitItem
            icon={GraduationCap}
            label="Exams"
            used={subscription.limits!.exams.used}
            total={subscription.limits!.exams.total}
          />
          
          <LimitItem
            icon={Home}
            label="Rooms"
            used={subscription.limits!.rooms.used}
            total={subscription.limits!.rooms.total}
          />
        </div>
        
        <div className="pt-4 border-t border-border">
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            <Crown className="h-4 w-4 mr-2" />
            Upgrade to Pro
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
