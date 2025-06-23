import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame, FileText, BookOpen, Bot, AlertTriangle, Smile, Star, TrendingUp, Target, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { MetricCard } from "@/components/metrics/MetricCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
interface Challenge {
  topic: string;
  notes: string;
  progress: number;
  lastAttempt: string;
  difficulty: "High" | "Medium" | "Low";
  category: string;
  icon: string;
}
const weeklyProgress = [{
  name: "Sun",
  Accuracy: 70
}, {
  name: "Mon",
  Accuracy: 80
}, {
  name: "Tue",
  Accuracy: 60
}, {
  name: "Wed",
  Accuracy: 75
}, {
  name: "Thu",
  Accuracy: 85
}, {
  name: "Fri",
  Accuracy: 90
}, {
  name: "Sat",
  Accuracy: 88
}];
const challenges: Challenge[] = [{
  topic: "Physics: Kinematics",
  notes: "Struggled with equations",
  progress: 65,
  lastAttempt: "2 days ago",
  difficulty: "High",
  category: "Science",
  icon: "⚡" // You can replace with actual icons if preferred
}, {
  topic: "Arabic Literature",
  notes: "Needs deeper comprehension",
  progress: 45,
  lastAttempt: "1 day ago",
  difficulty: "Medium",
  category: "Languages",
  icon: "📚"
}, {
  topic: "English Essay Writing",
  notes: "Grammar inconsistencies",
  progress: 75,
  lastAttempt: "3 days ago",
  difficulty: "Medium",
  category: "Writing",
  icon: "✍️"
}];
export default function ReportsPage() {
  return <DashboardLayout>
      <div className="flex flex-col h-full bg-background transition-colors duration-300 text-foreground p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Your Learning Journey</h1>
          <p className="text-muted-foreground">Track your progress and identify areas for improvement</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard icon={<FileText />} value="42" label="Files Studied" />
          <MetricCard icon={<BookOpen />} value="128" label="Flashcards Reviewed" />
          <MetricCard icon={<Bot />} value="7" label="Quizzes Taken" />
          <MetricCard icon={<Flame />} value="6 days" label="Study Streak 🔥" />
        </div>

        {/* Weekly Progress */}
        <Card className="mb-6 bg-gradient-to-br from-card to-accent/5 border-border/50 shadow-lg hover:shadow-xl transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Learning Progress</h3>
                    <p className="text-sm text-muted-foreground">Accuracy This Week</p>
                  </div>
                </div>
                <div className="h-[240px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyProgress}>
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))',
                      fontSize: '12px'
                    }} labelStyle={{
                      color: '#00A3FF'
                    }} />
                      <Bar dataKey="Accuracy" fill="#00A3FF" radius={[6, 6, 0, 0]} opacity={0.8} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goals + Feedback */}
        <div className="grid gap-4 lg:grid-cols-2 mb-6">
          <Card className="bg-gradient-to-br from-card to-accent/5 border-border/50 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">Weekly Goal</h3>
                      <p className="text-sm text-muted-foreground">You're almost there!</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-foreground">80%</p>
                    <Progress value={80} className="h-2 bg-muted" />
                    <p className="text-sm text-muted-foreground">
                      Just 2 more quizzes to hit your target
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-accent/5 border-border/50 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">Helpfulness Rating</h3>
                      <p className="text-sm text-muted-foreground">Based on 200 feedback entries</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-foreground">94%</p>
                    <Progress value={94} className="h-2 bg-muted" />
                    <p className="text-sm text-muted-foreground">
                      Excellent feedback this month
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Challenges */}
        <Card className="mb-6 bg-gradient-to-br from-card to-accent/5 border-border/50 shadow-lg hover:shadow-xl transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Top Challenges</h3>
                    <p className="text-sm text-muted-foreground">Areas that need attention</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {challenges.map((item, idx) => <div key={idx} className="group flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-accent/5 transition-colors duration-200">
                      <div className="flex items-center space-x-3">
                        
                        <div>
                          <p className="font-medium text-foreground">{item.topic}</p>
                          <p className="text-sm text-muted-foreground">{item.notes}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="secondary" className={cn("text-xs font-normal", item.difficulty === "High" && "bg-red-500/10 text-red-500", item.difficulty === "Medium" && "bg-yellow-500/10 text-yellow-500", item.difficulty === "Low" && "bg-green-500/10 text-green-500")}>
                          {item.difficulty}
                        </Badge>
                      </div>
                    </div>)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Motivation Card */}
        <Card className="bg-gradient-to-br from-card to-accent/5 border-border/50 shadow-lg hover:shadow-xl transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-3">
                  <h3 className="text-xl font-semibold text-foreground">Keep Going!</h3>
                  
                </div>
                <p className="text-muted-foreground text-base leading-relaxed mb-4">
                  You're making steady progress. Focus on small wins daily — your future self will thank you. 🚀
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-muted-foreground">On track</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-muted-foreground">Improving daily</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>;
}