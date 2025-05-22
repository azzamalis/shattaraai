
import React, { useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Clock, MessageSquare, FileUp, Activity, FileText, Layers, BookOpen, Users, Flame } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

// Mock data - in a real app, this would be fetched from an API
const weeklyData = [{
  name: "Mon",
  quizAccuracy: 65,
  flashcards: 24
}, {
  name: "Tue",
  quizAccuracy: 59,
  flashcards: 13
}, {
  name: "Wed",
  quizAccuracy: 80,
  flashcards: 36
}, {
  name: "Thu",
  quizAccuracy: 81,
  flashcards: 45
}, {
  name: "Fri",
  quizAccuracy: 76,
  flashcards: 27
}, {
  name: "Sat",
  quizAccuracy: 85,
  flashcards: 18
}, {
  name: "Sun",
  quizAccuracy: 83,
  flashcards: 31
}];

const monthlyData = [{
  name: "Jan",
  quizAccuracy: 65,
  flashcards: 120
}, {
  name: "Feb",
  quizAccuracy: 59,
  flashcards: 110
}, {
  name: "Mar",
  quizAccuracy: 80,
  flashcards: 145
}, {
  name: "Apr",
  quizAccuracy: 81,
  flashcards: 165
}, {
  name: "May",
  quizAccuracy: 76,
  flashcards: 190
}, {
  name: "Jun",
  quizAccuracy: 85,
  flashcards: 220
}];

// Helper function to get progress color based on value
const getProgressColor = (value: number) => {
  if (value <= 25) return "#DE1135";
  if (value <= 50) return "#F6BC2F";
  return "#0E8345";
};

const ReportsPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly">("weekly");
  const data = timeframe === "weekly" ? weeklyData : monthlyData;

  // Fixed chart configuration - either use color OR theme, not both
  const chartConfig = {
    quizAccuracy: {
      label: "Quiz Accuracy",
      theme: {
        light: "#00A3FF",
        dark: "#00A3FF"
      }
    },
    flashcards: {
      label: "Flashcards",
      theme: {
        light: "#0E8345",
        dark: "#0E8345"
      }
    }
  };

  // Calculated engagement metrics - in a real app, this would be actual user data
  const engagementMetrics = {
    studyTime: "32:15",
    aiChats: 78,
    filesUploaded: 24,
    sessions: 18
  };

  // Calculated productivity metrics
  const productivityMetrics = {
    summariesCreated: 15,
    flashcardsCreated: 145,
    quizzesTaken: 12,
    roomsCreated: 7
  };

  // Progress metrics
  const progressMetrics = {
    quizAccuracy: 78,
    flashcardsPerWeek: 120,
    contentCoverage: 65
  };

  // AI Helpfulness Feedback (Optional enhancement)
  const aiHelpfulnessData = [{
    name: 'Very Helpful',
    value: 65
  }, {
    name: 'Somewhat Helpful',
    value: 25
  }, {
    name: 'Not Helpful',
    value: 10
  }];

  // Streak data (Optional enhancement)
  const studyStreak = 4;
  
  return (
    <DashboardLayout>
      <div className="flex flex-col min-h-screen text-white p-4 md:p-6 bg-black">
        {/* Header with greeting and streak */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">Welcome back, Ashlynn</h1>
            <p className="text-[#A6A6A6]">Your progress this week is awesome. Let's keep it up!</p>
          </div>
          <div className="flex items-center mt-4 md:mt-0 rounded-lg p-2 bg-[#4B4B4B]">
            <Flame className="h-6 w-6 text-orange-500 mr-2" />
            <span className="text-white font-medium">{studyStreak}-day streak</span>
          </div>
        </div>

        {/* Engagement Metrics */}
        <h2 className="text-xl font-semibold mb-4">Engagement Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#4B4B4B] border-0 shadow-lg hover:shadow-[#00A3FF]/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium text-[#A6A6A6] flex items-center">
                <Clock className="w-4 h-4 mr-2 text-[#00A3FF]" />
                Study Time This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">{engagementMetrics.studyTime}</p>
              <p className="text-xs text-[#A6A6A6] mt-1">Hours:Minutes</p>
            </CardContent>
          </Card>

          <Card className="bg-[#4B4B4B] border-0 shadow-lg hover:shadow-[#00A3FF]/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium text-[#A6A6A6] flex items-center">
                <MessageSquare className="w-4 h-4 mr-2 text-[#00A3FF]" />
                Total AI Chats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">{engagementMetrics.aiChats}</p>
              <p className="text-xs text-[#A6A6A6] mt-1">Conversations</p>
            </CardContent>
          </Card>

          <Card className="bg-[#4B4B4B] border-0 shadow-lg hover:shadow-[#00A3FF]/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium text-[#A6A6A6] flex items-center">
                <FileUp className="w-4 h-4 mr-2 text-white" />
                Files Uploaded
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">{engagementMetrics.filesUploaded}</p>
              <p className="text-xs text-[#A6A6A6] mt-1">Documents</p>
            </CardContent>
          </Card>

          <Card className="bg-[#4B4B4B] border-0 shadow-lg hover:shadow-[#00A3FF]/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium text-[#A6A6A6] flex items-center">
                <Activity className="w-4 h-4 mr-2 text-[#0E8345]" />
                Sessions This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">{engagementMetrics.sessions}</p>
              <p className="text-xs text-[#A6A6A6] mt-1">Login sessions</p>
            </CardContent>
          </Card>
        </div>

        {/* Productivity Metrics */}
        <h2 className="text-xl font-semibold mb-4">Productivity Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#4B4B4B] border-0 shadow-lg hover:shadow-[#00A3FF]/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium text-[#A6A6A6] flex items-center">
                <FileText className="w-4 h-4 mr-2 text-white" />
                Summaries Created
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">{productivityMetrics.summariesCreated}</p>
            </CardContent>
          </Card>

          <Card className="bg-[#4B4B4B] border-0 shadow-lg hover:shadow-[#00A3FF]/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium text-[#A6A6A6] flex items-center">
                <Layers className="w-4 h-4 mr-2 text-[#00A3FF]" />
                Flashcards Created
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">{productivityMetrics.flashcardsCreated}</p>
            </CardContent>
          </Card>

          <Card className="bg-[#4B4B4B] border-0 shadow-lg hover:shadow-[#00A3FF]/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium text-[#A6A6A6] flex items-center">
                <BookOpen className="w-4 h-4 mr-2 text-[#00A3FF]" />
                Quizzes/Exams Taken
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">{productivityMetrics.quizzesTaken}</p>
            </CardContent>
          </Card>

          <Card className="bg-[#4B4B4B] border-0 shadow-lg hover:shadow-[#00A3FF]/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium text-[#A6A6A6] flex items-center">
                <Users className="w-4 h-4 mr-2 text-[#0E8345]" />
                Rooms Created
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">{productivityMetrics.roomsCreated}</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Charts */}
        <h2 className="text-xl font-semibold mb-4">Progress Charts</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-[#4B4B4B] border-0 shadow-lg p-4 hover:shadow-[#00A3FF]/10">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-white">Quiz Accuracy Over Time</CardTitle>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setTimeframe("weekly")} 
                    className={`px-2 py-1 text-xs rounded-md ${
                      timeframe === "weekly" 
                        ? "bg-[#00A3FF]/10 text-white" 
                        : "bg-[#4B4B4B] text-[#A6A6A6] hover:bg-[#5B5B5B]"
                    }`}
                  >
                    Weekly
                  </button>
                  <button 
                    onClick={() => setTimeframe("monthly")} 
                    className={`px-2 py-1 text-xs rounded-md ${
                      timeframe === "monthly" 
                        ? "bg-[#00A3FF]/10 text-white" 
                        : "bg-[#4B4B4B] text-[#A6A6A6] hover:bg-[#5B5B5B]"
                    }`}
                  >
                    Monthly
                  </button>
                </div>
              </div>
              <CardDescription className="text-[#A6A6A6]">
                Your quiz accuracy over time
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[250px]">
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                      <XAxis dataKey="name" stroke="#A6A6A6" />
                      <YAxis stroke="#A6A6A6" />
                      <ChartTooltip 
                        content={<ChartTooltipContent indicator="dot" />} 
                        contentStyle={{ backgroundColor: '#DDDDDD', color: '#000' }}
                      />
                      <Line 
                        dataKey="quizAccuracy" 
                        name="Quiz Accuracy" 
                        type="monotone" 
                        stroke="#00A3FF" 
                        strokeWidth={2} 
                        dot={{
                          fill: "#00A3FF",
                          r: 4
                        }} 
                        activeDot={{
                          r: 6,
                          fill: "#fff",
                          stroke: "#00A3FF"
                        }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#4B4B4B] border-0 shadow-lg p-4 hover:shadow-[#00A3FF]/10">
            <CardHeader>
              <CardTitle className="text-white">Flashcards Reviewed</CardTitle>
              <CardDescription className="text-[#A6A6A6]">
                Number of flashcards reviewed per {timeframe === "weekly" ? "day" : "month"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[250px]">
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                      <XAxis dataKey="name" stroke="#A6A6A6" />
                      <YAxis stroke="#A6A6A6" />
                      <ChartTooltip 
                        content={<ChartTooltipContent />} 
                        contentStyle={{ backgroundColor: '#DDDDDD', color: '#000' }}
                      />
                      <Bar dataKey="flashcards" name="Flashcards" fill="#0E8345" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Coverage */}
        <div className="grid grid-cols-1 gap-6 mb-8 mt-8 pt-4">
          <Card className="bg-[#4B4B4B] border-0 shadow-lg p-4 hover:shadow-[#00A3FF]/10">
            <CardHeader>
              <CardTitle className="text-white">Content Coverage</CardTitle>
              <CardDescription className="text-[#A6A6A6]">
                Percentage of uploads with generated notes/summaries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="flex-1 mr-4">
                  <Progress 
                    value={progressMetrics.contentCoverage} 
                    className="h-3 bg-[#333]"
                    indicatorClassName={`bg-[${getProgressColor(progressMetrics.contentCoverage)}]`}
                  />
                </div>
                <div className="text-xl font-semibold text-white">
                  {progressMetrics.contentCoverage}%
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Helpfulness Feedback (Optional Enhancement) */}
        <h2 className="text-xl font-semibold mb-4">AI Assistant Feedback</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#4B4B4B] border-0 shadow-lg col-span-1 hover:shadow-[#00A3FF]/10">
            <CardHeader>
              <CardTitle className="text-white">Rate AI Helpfulness</CardTitle>
              <CardDescription className="text-[#A6A6A6]">
                Based on your feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {aiHelpfulnessData.map(item => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="text-sm text-[#A6A6A6]">{item.name}</span>
                    <div className="flex items-center">
                      <div className="w-[150px] bg-[#333] rounded-full h-2 mr-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{
                            width: `${item.value}%`,
                            backgroundColor: 
                              item.name === 'Very Helpful' ? '#0E8345' : 
                              item.name === 'Somewhat Helpful' ? '#F6BC2F' : 
                              '#DE1135'
                          }} 
                        />
                      </div>
                      <span className="text-xs font-medium text-[#A6A6A6]">{item.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Highlight top used features */}
          <Card className="bg-[#4B4B4B] border-0 shadow-lg col-span-1 md:col-span-2 hover:shadow-[#00A3FF]/10">
            <CardHeader>
              <CardTitle className="text-white">Top Used Features</CardTitle>
              <CardDescription className="text-[#A6A6A6]">
                Features you use most often
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#333] rounded-xl p-4 flex flex-col items-center justify-center">
                  <MessageSquare className="h-8 w-8 text-[#00A3FF] mb-2" />
                  <h3 className="font-medium text-center text-white">AI Tutor</h3>
                  <p className="text-xs text-center mt-1 text-[#A6A6A6]">Used 78 times</p>
                </div>
                <div className="bg-[#333] rounded-xl p-4 flex flex-col items-center justify-center">
                  <Layers className="h-8 w-8 text-[#00A3FF] mb-2" />
                  <h3 className="font-medium text-center text-white">Flashcards</h3>
                  <p className="text-xs text-center mt-1 text-[#A6A6A6]">Created 145 cards</p>
                </div>
                <div className="bg-[#333] rounded-xl p-4 flex flex-col items-center justify-center">
                  <FileText className="h-8 w-8 text-white mb-2" />
                  <h3 className="font-medium text-center text-white">Summaries</h3>
                  <p className="text-xs text-center mt-1 text-[#A6A6A6]">15 documents</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
