
import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  Clock, 
  Calendar, 
  MessageSquare, 
  FileUp, 
  Activity,
  Book, 
  BookOpen, 
  Star, 
  Layers, 
  FileText, 
  RefreshCw,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  XCircle,
  Clock8,
  Flame,
  Users
} from "lucide-react";
import { BarChart } from "@/components/ui/bar-chart";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Mock data for the reports page
const studyTimeData = [
  { day: "Mon", hours: 2.5 },
  { day: "Tue", hours: 1.8 },
  { day: "Wed", hours: 3.2 },
  { day: "Thu", hours: 2.0 },
  { day: "Fri", hours: 1.5 },
  { day: "Sat", hours: 4.0 },
  { day: "Sun", hours: 2.8 },
];

const quizPerformanceData = [
  { date: "June 1", score: 75 },
  { date: "June 8", score: 68 },
  { date: "June 15", score: 82 },
  { date: "June 22", score: 90 },
  { date: "June 29", score: 85 },
  { date: "July 6", score: 92 },
];

const resourceUsageData = [
  { name: "AI Tutor", value: 78 },
  { name: "Flashcards", value: 145 },
  { name: "Summaries", value: 34 },
  { name: "Quizzes", value: 26 },
  { name: "Uploads", value: 52 },
];

const flashcardData = [
  { name: "Correct", value: 68 },
  { name: "Incorrect", value: 32 },
];

const courseCompletionData = [
  { name: "Introduction to AI", progress: 85, lastActivity: "2 days ago" },
  { name: "Data Structures", progress: 62, lastActivity: "Yesterday" },
  { name: "Machine Learning Basics", progress: 45, lastActivity: "4 days ago" },
  { name: "Web Development", progress: 90, lastActivity: "Today" },
];

const challengingFlashcards = [
  { topic: "Neural Networks", question: "Define backpropagation algorithm", lastAttempt: "Failed" },
  { topic: "Data Structures", question: "Explain time complexity of quick sort", lastAttempt: "Failed" },
  { topic: "Machine Learning", question: "Difference between supervised and unsupervised learning", lastAttempt: "Failed" },
];

const aiInsights = [
  "You're most productive on weekends, averaging 3.4 hours of study time",
  "Consider revisiting 'Neural Networks' based on your flashcard performance",
  "Short, frequent study sessions have improved your retention by 18%",
  "You've completed over 125 flashcards this month - great progress!",
  "Your quiz scores have improved 12% when studying in the morning"
];

const COLORS = ['#8B5CF6', '#1EAEDB', '#E11D48', '#22C55E'];

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState("week");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const studyStreak = 5;
  const longestStreak = 9;
  
  const handleRefreshInsights = () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col min-h-screen text-white p-4 md:p-6 bg-black">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">Your Learning Progress</h1>
            <p className="text-[#8E9196]">Track your growth and optimize your study habits</p>
          </div>
          
          <div className="flex items-center mt-4 md:mt-0 gap-4">
            <div className="flex space-x-2 bg-[#1A1A1A] rounded-lg p-1">
              <Button 
                variant={dateRange === "week" ? "default" : "ghost"} 
                className={dateRange === "week" ? "bg-[#2323FF] hover:bg-[#2323FF]/90" : "text-[#8E9196]"}
                onClick={() => setDateRange("week")}
                size="sm"
              >
                Last 7 Days
              </Button>
              <Button 
                variant={dateRange === "month" ? "default" : "ghost"} 
                className={dateRange === "month" ? "bg-[#2323FF] hover:bg-[#2323FF]/90" : "text-[#8E9196]"}
                onClick={() => setDateRange("month")}
                size="sm"
              >
                This Month
              </Button>
              <Button 
                variant={dateRange === "semester" ? "default" : "ghost"} 
                className={dateRange === "semester" ? "bg-[#2323FF] hover:bg-[#2323FF]/90" : "text-[#8E9196]"}
                onClick={() => setDateRange("semester")}
                size="sm"
              >
                Semester
              </Button>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center bg-[#1A1A1A]/50 rounded-lg p-2 border border-[#2323FF]/20">
                    <Flame className="h-5 w-5 text-orange-500 mr-2" />
                    <span className="text-white font-medium">{studyStreak}-day streak</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Your longest streak: {longestStreak} days</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#1A1A1A] border-none shadow-md hover:shadow-[#2323FF]/10 transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium text-[#8E9196] flex items-center">
                <Clock className="w-4 h-4 mr-2 text-[#2323FF]" />
                Total Study Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">32:15</p>
                <Badge variant="outline" className="flex items-center gap-1 bg-green-500/10 text-green-400 border-green-500/20">
                  <ArrowUp className="h-3 w-3" />
                  12%
                </Badge>
              </div>
              <p className="text-xs text-[#8E9196] mt-1">Hours:Minutes</p>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-none shadow-md hover:shadow-[#2323FF]/10 transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium text-[#8E9196] flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-[#2323FF]" />
                Active Days This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">5/7</p>
                <Badge variant="outline" className="flex items-center gap-1 bg-green-500/10 text-green-400 border-green-500/20">
                  <ArrowUp className="h-3 w-3" />
                  1 day
                </Badge>
              </div>
              <div className="flex gap-1 mt-2">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                  <div 
                    key={i} 
                    className={`w-6 h-6 flex items-center justify-center rounded-full text-[10px] 
                      ${i < 5 ? "bg-[#2323FF]/20 text-[#2323FF]" : "bg-[#333] text-[#666]"}`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-none shadow-md hover:shadow-[#2323FF]/10 transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium text-[#8E9196] flex items-center">
                <MessageSquare className="w-4 h-4 mr-2 text-[#2323FF]" />
                AI Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">24</p>
                <Badge variant="outline" className="flex items-center gap-1 bg-green-500/10 text-green-400 border-green-500/20">
                  <ArrowUp className="h-3 w-3" />
                  8%
                </Badge>
              </div>
              <p className="text-xs text-[#8E9196] mt-1">Total conversations</p>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-none shadow-md hover:shadow-[#2323FF]/10 transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium text-[#8E9196] flex items-center">
                <FileUp className="w-4 h-4 mr-2 text-[#2323FF]" />
                Files Processed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">16</p>
                <Badge variant="outline" className="flex items-center gap-1 bg-red-500/10 text-red-400 border-red-500/20">
                  <ArrowDown className="h-3 w-3" />
                  3%
                </Badge>
              </div>
              <p className="text-xs text-[#8E9196] mt-1">Documents, PDFs, images</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Left Column - Engagement & Activity */}
          <div className="space-y-6">
            {/* Study Time Distribution */}
            <Card className="bg-[#1A1A1A] border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock8 className="h-5 w-5 text-[#2323FF]" />
                  Study Time Distribution
                </CardTitle>
                <CardDescription className="text-[#8E9196]">
                  Your study patterns over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={studyTimeData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2323FF" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#2323FF" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="day" stroke="#8E9196" />
                      <YAxis stroke="#8E9196" />
                      <RechartsTooltip 
                        formatter={(value: number) => [`${value} hours`, 'Study Time']}
                        contentStyle={{ backgroundColor: '#222', borderColor: '#444' }}
                        labelStyle={{ color: '#FFF' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="hours" 
                        stroke="#2323FF" 
                        fillOpacity={1} 
                        fill="url(#colorHours)" 
                        activeDot={{ r: 8, strokeWidth: 0, fill: '#FFF' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 p-3 bg-[#111] rounded-lg">
                  <p className="text-[#8E9196] text-sm">
                    <span className="text-white font-medium">Peak productivity:</span> Weekends, averaging 3.4 hours per day
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Resource Usage */}
            <Card className="bg-[#1A1A1A] border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-[#2323FF]" />
                  Resource Usage
                </CardTitle>
                <CardDescription className="text-[#8E9196]">
                  Your most used platform features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {resourceUsageData.map((item) => (
                    <div key={item.name} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">{item.name}</span>
                        <span className="text-xs text-[#8E9196]">{item.value} uses</span>
                      </div>
                      <div className="w-full bg-[#111] rounded-full h-2.5">
                        <div 
                          className="h-2.5 rounded-full bg-[#2323FF]" 
                          style={{ 
                            width: `${(item.value / Math.max(...resourceUsageData.map(d => d.value))) * 100}%`,
                            opacity: 0.7 + (0.3 * item.value / Math.max(...resourceUsageData.map(d => d.value)))
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Learning Performance */}
          <div className="space-y-6">
            {/* Quiz Performance */}
            <Card className="bg-[#1A1A1A] border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[#2323FF]" />
                  Quiz Performance
                </CardTitle>
                <CardDescription className="text-[#8E9196]">
                  Your quiz scores over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={quizPerformanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="date" stroke="#8E9196" />
                      <YAxis domain={[0, 100]} stroke="#8E9196" />
                      <RechartsTooltip 
                        formatter={(value: number) => [`${value}%`, 'Score']}
                        contentStyle={{ backgroundColor: '#222', borderColor: '#444' }}
                        labelStyle={{ color: '#FFF' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#2323FF" 
                        strokeWidth={3}
                        dot={{ fill: '#2323FF', strokeWidth: 0, r: 4 }}
                        activeDot={{ r: 8, strokeWidth: 0, fill: '#FFF' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-[#2323FF]/20 text-[#2323FF] border-none px-3 py-1">
                      Average: 82%
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1 bg-green-500/10 text-green-400 border-green-500/20">
                      <ArrowUp className="h-3 w-3" />
                      9%
                    </Badge>
                  </div>
                  <div className="text-sm text-[#8E9196]">
                    <span className="text-green-400">Highest:</span> Web Development (92%)
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Flashcard Performance & Challenging Cards */}
            <Card className="bg-[#1A1A1A] border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Layers className="h-5 w-5 text-[#2323FF]" />
                  Flashcard Performance
                </CardTitle>
                <CardDescription className="text-[#8E9196]">
                  Your recall accuracy and challenging flashcards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/3 flex flex-col items-center justify-center">
                    <div className="h-32 w-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={flashcardData}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={60}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {flashcardData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index === 0 ? '#2323FF' : '#E11D48'} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-center mt-2">
                      <span className="text-lg font-semibold text-white">68%</span>
                      <span className="text-sm text-[#8E9196] block">Recall Accuracy</span>
                    </p>
                  </div>
                  
                  <div className="w-full md:w-2/3">
                    <h3 className="text-sm font-medium text-[#8E9196] mb-2">Challenging Flashcards</h3>
                    <div className="space-y-2">
                      {challengingFlashcards.map((card, index) => (
                        <div key={index} className="p-2 bg-[#111] rounded-lg border border-[#333]">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-xs text-[#2323FF]">{card.topic}</p>
                              <p className="text-sm text-white">{card.question}</p>
                            </div>
                            <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20">
                              {card.lastAttempt}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Course Completion */}
        <div className="mb-8">
          <Card className="bg-[#1A1A1A] border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Book className="h-5 w-5 text-[#2323FF]" />
                Course Completion
              </CardTitle>
              <CardDescription className="text-[#8E9196]">
                Track your progress through enrolled courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {courseCompletionData.map((course, index) => (
                  <div key={index} className="rounded-lg bg-[#111] p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-white font-medium">{course.name}</h3>
                      <Badge variant="outline" className="text-[#8E9196]">
                        {course.lastActivity}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={course.progress} className="h-2 flex-1" />
                      <span className="text-white font-semibold">{course.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights & Feedback Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* AI Insights */}
          <Card className="bg-[#1A1A1A] border-none shadow-md lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <Star className="h-5 w-5 text-[#2323FF]" />
                  AI Learning Assistant Insights
                </CardTitle>
                <CardDescription className="text-[#8E9196]">
                  Personalized observations to enhance your learning
                </CardDescription>
              </div>
              <Button
                variant="outline" 
                size="sm"
                className="border-[#2323FF]/20 text-[#2323FF]"
                onClick={handleRefreshInsights}
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {aiInsights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="rounded-full bg-[#2323FF]/10 p-1 mt-0.5">
                      <div className="rounded-full bg-[#2323FF]/20 p-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#2323FF]"></div>
                      </div>
                    </div>
                    <p className="text-[#E5DEFF]">{insight}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* AI Helpfulness Rating */}
          <Card className="bg-[#1A1A1A] border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-[#2323FF]" />
                Rate AI Helpfulness
              </CardTitle>
              <CardDescription className="text-[#8E9196]">
                How helpful are the AI insights to your learning?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center my-4">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    variant="ghost"
                    className="p-2"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        rating <= 4 ? "text-[#2323FF] fill-[#2323FF]" : "text-[#8E9196]"
                      }`}
                    />
                    <span className="sr-only">{rating} star</span>
                  </Button>
                ))}
              </div>
              <div className="p-3 bg-[#111] rounded-lg">
                <h4 className="text-white text-sm mb-2">What could we improve?</h4>
                <textarea
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-md p-2 text-white text-sm"
                  rows={3}
                  placeholder="Share your feedback about AI recommendations..."
                />
                <Button className="w-full mt-3 bg-[#2323FF] hover:bg-[#2323FF]/90">
                  Submit Feedback
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
