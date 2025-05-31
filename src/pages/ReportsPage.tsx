import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame, FileText, BookOpen, Bot, AlertTriangle, Smile, Star, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { MetricCard } from "@/components/metrics/MetricCard";

const weeklyProgress = [
  { name: "Sun", Accuracy: 70 },
  { name: "Mon", Accuracy: 80 },
  { name: "Tue", Accuracy: 60 },
  { name: "Wed", Accuracy: 75 },
  { name: "Thu", Accuracy: 85 },
  { name: "Fri", Accuracy: 90 },
  { name: "Sat", Accuracy: 88 },
];

const challenges = [
  { topic: "Physics: Kinematics", notes: "Struggled with equations" },
  { topic: "Arabic Literature", notes: "Needs deeper comprehension" },
  { topic: "English Essay Writing", notes: "Grammar inconsistencies" },
];

export default function ReportsPage() {
  return (
    <DashboardLayout>
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
        <Card className="mb-6 bg-card border-border shadow-lg transition-colors duration-200">
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-foreground">📈 Learning Progress</CardTitle>
            <span className="text-sm text-muted-foreground">Accuracy This Week</span>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyProgress}>
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))',
                      fontSize: '12px'
                    }}
                    labelStyle={{ color: '#00A3FF' }}
                  />
                  <Bar 
                    dataKey="Accuracy" 
                    fill="#00A3FF" 
                    radius={[6, 6, 0, 0]} 
                    opacity={0.8}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Goals + Feedback */}
        <div className="grid gap-4 lg:grid-cols-2 mb-6">
          <Card className="bg-card border-border shadow-lg hover:bg-accent transition-colors duration-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-foreground">🎯 Weekly Goal</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-lg mb-2 text-foreground">You've completed 80% of your goal!</p>
              <Progress value={80} className="h-3 bg-muted" />
              <p className="text-sm text-muted-foreground mt-2">
                Just 2 more quizzes to hit your target.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-lg hover:bg-accent transition-colors duration-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-foreground">✨ Helpfulness Rating</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-3xl font-bold mb-2 text-foreground">94%</p>
              <Progress value={94} className="h-3 bg-muted" />
              <p className="text-sm text-muted-foreground mt-2">
                Based on 200 feedback entries this month.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Areas of Difficulty */}
        <Card className="mb-6 bg-card border-border shadow-lg hover:bg-accent transition-colors duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-foreground">🚧 Top Challenges</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ul className="space-y-4">
              {challenges.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <AlertTriangle className="text-yellow-500 mt-1" size={20} />
                  <div>
                    <p className="font-medium text-foreground">{item.topic}</p>
                    <p className="text-sm text-muted-foreground">{item.notes}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Enhanced Motivation Card */}
        <Card className="bg-gradient-to-br from-card to-accent border-border shadow-lg hover:shadow-xl transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-full bg-green-500/10 text-green-500">
                <Star size={24} />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-3">
                  <h3 className="text-xl font-semibold text-foreground">Keep Going!</h3>
                  <TrendingUp className="text-green-500" size={20} />
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
    </DashboardLayout>
  );
}
