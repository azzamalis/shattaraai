import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar } from "@/components/ui/avatar";
import { BarChart } from "@/components/ui/bar-chart";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const ProfileContent = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [planType, setPlanType] = useState("free");

  // Mock data for the charts
  const performanceData = {
    labels: ["Flashcards", "Summaries", "Notes", "Exams"],
    datasets: [
      {
        label: "Score",
        data: [85, 78, 92, 88],
        backgroundColor: "#22c55e",
      },
      {
        label: "Performance",
        data: [75, 82, 88, 85],
        backgroundColor: "#3b82f6",
      },
    ],
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Information Card */}
        <Card className="p-6 space-y-4 bg-[#222222] border-white/20">
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20 bg-primary text-white">
              <div className="text-4xl">A</div>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white">Profile Settings</h2>
              <p className="text-white/70">Manage your account details</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-white">
                Username
              </label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="bg-[#333333] border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-white">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="bg-[#333333] border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="plan" className="text-sm font-medium text-white">
                Plan Type
              </label>
              <Select value={planType} onValueChange={setPlanType}>
                <SelectTrigger className="bg-[#333333] border-white/20 text-white">
                  <SelectValue placeholder="Select your plan" />
                </SelectTrigger>
                <SelectContent className="bg-[#333333] border-white/20">
                  <SelectItem value="free" className="text-white hover:bg-white/10">Free Plan</SelectItem>
                  <SelectItem value="pro" className="text-white hover:bg-white/10">Pro Plan</SelectItem>
                  <SelectItem value="enterprise" className="text-white hover:bg-white/10">Enterprise Plan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 pt-4">
              <Button className="w-full bg-primary hover:bg-primary-light text-white">
                Invite & Earn
              </Button>
              <Button variant="destructive" className="w-full">
                Delete Account
              </Button>
            </div>
          </div>
        </Card>

        {/* Performance Statistics Card */}
        <Card className="p-6 bg-[#222222] border-white/20">
          <h2 className="text-2xl font-bold mb-4 text-white">Performance Overview</h2>
          <div className="h-[400px]">
            <BarChart data={performanceData} />
          </div>
        </Card>
      </div>
    </div>
  );
};

const Profile = () => {
  return (
    <DashboardLayout>
      <ProfileContent />
    </DashboardLayout>
  );
};

export default Profile; 