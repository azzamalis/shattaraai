
import React, { useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Clock, MessageSquare, FileUp, Activity, FileText, Layers, BookOpen, Users, Flame } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

// Mock data - in a real app, this would be fetched from an API
const weeklyData = [
  { name: "Mon", quizAccuracy: 65, flashcards: 24 },
  { name: "Tue", quizAccuracy: 59, flashcards: 13 },
  { name: "Wed", quizAccuracy: 80, flashcards: 36 },
  { name: "Thu", quizAccuracy: 81, flashcards: 45 },
  { name: "Fri", quizAccuracy: 76, flashcards: 27 },
  { name: "Sat", quizAccuracy: 85, flashcards: 18 },
  { name: "Sun", quizAccuracy: 83, flashcards: 31 }
];

const monthlyData = [
  { name: "Jan", quizAccuracy: 65, flashcards: 120 },
  { name: "Feb", quizAccuracy: 59, flashcards: 110 },
  { name: "Mar", quizAccuracy: 80, flashcards: 145 },
  { name: "Apr", quizAccuracy: 81, flashcards: 165 },
  { name: "May", quizAccuracy: 76, flashcards: 190 },
  { name: "Jun", quizAccuracy: 85, flashcards: 220 }
];

const ReportsPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly">("weekly");
  const data = timeframe === "weekly" ? weeklyData : monthlyData;

  // Fixed chart configuration - either use color OR theme, not both
  const chartConfig = {
    quizAccuracy: {
      label: "Quiz Accuracy",
      theme: {
        light: "#8B5CF6", // Vivid purple
        dark: "#8B5CF6"
      }
    },
    flashcards: {
      label: "Flashcards",
      theme: {
        light: "#1EAEDB", // Bright blue
        dark: "#1EAEDB"
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
  const aiHelpfulnessData = [
    { name: 'Very Helpful', value: 65 },
    { name: 'Somewhat Helpful', value: 25 },
    { name: 'Not Helpful', value: 10 }
  ];

  // Streak data (Optional enhancement)
  const studyStreak = 4;
  
  return (
    <DashboardLayout>
      <div className="flex flex-col min-h-screen text-white p-4 md:p-6 bg-black">
        {/* Header with greeting and streak */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">Welcome back, Ashlynn</h1>
            <p className="text-[#8E9196]">Your progress this week is awesome. Let's keep it up!</p>
          </div>
          <div className="flex items-center mt-4 md:mt-0 bg-[#221F26]/50 rounded-lg p-2">
            <Flame className="h-6 w-6 text-orange-500 mr-2" />
            <span className="text-white font-medium">{studyStreak}-day streak</span>
          </div>
        </div>

        {/* Engagement Metrics */}
        <h2 className="text-xl font-semibold mb-4">Engagement Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#221F26] border-0 shadow-lg hover:shadow-[#8B5CF6]/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium text-[#8E9196] flex items-center">
                <Clock className="w-4 h-4 mr-2 text-[#8B5CF6]" />
                Study Time This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{engagementMetrics.studyTime}</p>
              <p className="text-xs text-[#8E9196] mt-1">Hours:Minutes</p>
            </CardContent>
          </Card>

          <Card className="bg-[#221F26] border-0 shadow-lg hover:shadow-[#8B5CF6]/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium text-[#8E9196] flex items-center">
                <MessageSquare className="w-4 h-4 mr-2 text-[#1EAEDB]" />
                Total AI Chats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{engagementMetrics.aiChats}</p>
              <p className="text-xs text-[#8E9196] mt-1">Conversations</p>
            </CardContent>
          </Card>

          <Card className="bg-[#221F26] border-0 shadow-lg hover:shadow-[#8B5CF6]/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium text-[#8E9196] flex items-center">
                <FileUp className="w-4 h-4 mr-2 text-[#E5DEFF]" />
                Files Uploaded
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{engagementMetrics.filesUploaded}</p>
              <p className="text-xs text-[#8E9196] mt-1">Documents</p>
            </CardContent>
          </Card>

          <Card className="bg-[#221F26] border-0 shadow-lg hover:shadow-[#8B5CF6]/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium text-[#8E9196] flex items-center">
                <Activity className="w-4 h-4 mr-2 text-green-500" />
                Sessions This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{engagementMetrics.sessions}</p>
              <p className="text-xs text-[#8E9196] mt-1">Login sessions</p>
            </CardContent>
          </Card>
        </div>

        {/* Productivity Metrics */}
        <h2 className="text-xl font-semibold mb-4">Productivity Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#221F26] border-0 shadow-lg hover:shadow-[#8B5CF6]/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium text-[#8E9196] flex items-center">
                <FileText className="w-4 h-4 mr-2 text-[#E5DEFF]" />
                Summaries Created
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{productivityMetrics.summariesCreated}</p>
            </CardContent>
          </Card>

          <Card className="bg-[#221F26] border-0 shadow-lg hover:shadow-[#8B5CF6]/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium text-[#8E9196] flex items-center">
                <Layers className="w-4 h-4 mr-2 text-[#8B5CF6]" />
                Flashcards Created
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{productivityMetrics.flashcardsCreated}</p>
            </CardContent>
          </Card>

          <Card className="bg-[#221F26] border-0 shadow-lg hover:shadow-[#8B5CF6]/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium text-[#8E9196] flex items-center">
                <BookOpen className="w-4 h-4 mr-2 text-[#1EAEDB]" />
                Quizzes/Exams Taken
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{productivityMetrics.quizzesTaken}</p>
            </CardContent>
          </Card>

          <Card className="bg-[#221F26] border-0 shadow-lg hover:shadow-[#8B5CF6]/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium text-[#8E9196] flex items-center">
                <Users className="w-4 h-4 mr-2 text-green-500" />
                Rooms Created
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{productivityMetrics.roomsCreated}</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Charts */}
        <h2 className="text-xl font-semibold mb-4">Progress Charts</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-[#221F26] border-0 shadow-lg p-4 hover:shadow-[#8B5CF6]/10">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-white">Quiz Accuracy Over Time</CardTitle>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setTimeframe("weekly")}
                    className={`px-2 py-1 text-xs rounded-md ${
                      timeframe === "weekly"
                        ? "bg-[#8B5CF6] text-white"
                        : "bg-[#1A1F2C] text-[#8E9196]"
                    }`}
                  >
                    Weekly
                  </button>
                  <button
                    onClick={() => setTimeframe("monthly")}
                    className={`px-2 py-1 text-xs rounded-md ${
                      timeframe === "monthly"
                        ? "bg-[#8B5CF6] text-white"
                        : "bg-[#1A1F2C] text-[#8E9196]"
                    }`}
                  >
                    Monthly
                  </button>
                </div>
              </div>
              <CardDescription className="text-[#8E9196]">
                Your quiz accuracy over time
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[250px]">
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="name" stroke="#8E9196" />
                      <YAxis stroke="#8E9196" />
                      <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                      <Line
                        dataKey="quizAccuracy"
                        name="Quiz Accuracy"
                        type="monotone"
                        stroke="#8B5CF6"
                        strokeWidth={2}
                        dot={{ fill: "#8B5CF6", r: 4 }}
                        activeDot={{ r: 6, fill: "#fff", stroke: "#8B5CF6" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#221F26] border-0 shadow-lg p-4 hover:shadow-[#8B5CF6]/10">
            <CardHeader>
              <CardTitle className="text-white">Flashcards Reviewed</CardTitle>
              <CardDescription className="text-[#8E9196]">
                Number of flashcards reviewed per {timeframe === "weekly" ? "day" : "month"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[250px]">
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="name" stroke="#8E9196" />
                      <YAxis stroke="#8E9196" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="flashcards" name="Flashcards" fill="#1EAEDB" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Coverage */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          <Card className="bg-[#221F26] border-0 shadow-lg p-4 hover:shadow-[#8B5CF6]/10">
            <CardHeader>
              <CardTitle className="text-white">Content Coverage</CardTitle>
              <CardDescription className="text-stone-300">
                Percentage of uploads with generated notes/summaries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="flex-1 mr-4">
                  <Progress value={progressMetrics.contentCoverage} className="h-3 bg-[#1A1F2C]" />
                </div>
                <div className="text-xl font-semibold">
                  {progressMetrics.contentCoverage}%
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Helpfulness Feedback (Optional Enhancement) */}
        <h2 className="text-xl font-semibold mb-4">AI Assistant Feedback</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#221F26] border-0 shadow-lg col-span-1 hover:shadow-[#8B5CF6]/10">
            <CardHeader>
              <CardTitle className="text-white">Rate AI Helpfulness</CardTitle>
              <CardDescription className="text-stone-300">
                Based on your feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {aiHelpfulnessData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="text-sm text-stone-300">{item.name}</span>
                    <div className="flex items-center">
                      <div className="w-[150px] bg-[#1A1F2C] rounded-full h-2 mr-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${item.value}%`,
                            backgroundColor:
                              item.name === 'Very Helpful'
                                ? '#8B5CF6'
                                : item.name === 'Somewhat Helpful'
                                ? '#1EAEDB'
                                : '#E11D48',
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium text-stone-300">{item.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Highlight top used features */}
          <Card className="bg-[#221F26] border-0 shadow-lg col-span-1 md:col-span-2 hover:shadow-[#8B5CF6]/10">
            <CardHeader>
              <CardTitle className="text-white">Top Used Features</CardTitle>
              <CardDescription className="text-stone-300">
                Features you use most often
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#1A1F2C] rounded-xl p-4 flex flex-col items-center justify-center">
                  <MessageSquare className="h-8 w-8 text-[#8B5CF6] mb-2" />
                  <h3 className="font-medium text-center">AI Tutor</h3>
                  <p className="text-xs text-center mt-1 text-stone-300">Used 78 times</p>
                </div>
                <div className="bg-[#1A1F2C] rounded-xl p-4 flex flex-col items-center justify-center">
                  <Layers className="h-8 w-8 text-[#1EAEDB] mb-2" />
                  <h3 className="font-medium text-center">Flashcards</h3>
                  <p className="text-xs text-center mt-1 text-stone-300">Created 145 cards</p>
                </div>
                <div className="bg-[#1A1F2C] rounded-xl p-4 flex flex-col items-center justify-center">
                  <FileText className="h-8 w-8 text-[#E5DEFF] mb-2" />
                  <h3 className="font-medium text-center">Summaries</h3>
                  <p className="text-xs text-center mt-1 text-stone-300">15 documents</p>
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
