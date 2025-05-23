import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

// Mock user data
const initialUserData = {
  name: "Alex Johnson",
  role: "Student",
  createdAt: "2023-09-15T12:00:00Z",
  avatarUrl: "",
  preferredLanguage: "English",
  learningGoal: "Master advanced algorithms",
  darkMode: true,
  notifications: {
    aiReplies: true,
    notesGenerated: true,
    quizReady: false
  },
  stats: {
    uploads: 24,
    sessions: 52,
    flashcards: 187,
    progressPercent: 75
  }
};

export default function Profile() {
  const [userData, setUserData] = useState(initialUserData);
  const { toast } = useToast();

  const handleSaveChanges = () => {
    toast({
      title: "Changes saved",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      variant: "destructive",
      title: "Are you sure?",
      description: "This action cannot be undone. This will permanently delete your account.",
    });
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background p-6 text-foreground">
        {/* Main Profile Card */}
        <Card className="w-full mb-6">
          <CardContent className="p-6">
            <div className="flex flex-wrap justify-between items-start gap-6">
              {/* Left side - User Info */}
              <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={userData.avatarUrl} alt={userData.name} />
                  <AvatarFallback>
                    {userData.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold">{userData.name}</h1>
                  <p className="text-muted-foreground mb-2">{userData.role}</p>
                  <p className="text-sm text-muted-foreground">
                    Member since {format(new Date(userData.createdAt), "MMMM yyyy")}
                  </p>
                </div>
              </div>

              {/* Right side - Stats */}
              <div className="flex flex-wrap gap-8">
                <div className="text-center">
                  <p className="text-2xl font-bold">{userData.stats.uploads}</p>
                  <p className="text-sm text-muted-foreground">Uploads</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{userData.stats.sessions}</p>
                  <p className="text-sm text-muted-foreground">Sessions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{userData.stats.flashcards}</p>
                  <p className="text-sm text-muted-foreground">Flashcards</p>
                </div>
                <div className="min-w-[200px]">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Goal Progress</span>
                    <span className="text-sm font-bold">{userData.stats.progressPercent}%</span>
                  </div>
                  <Progress value={userData.stats.progressPercent} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Cards */}
        <div className="space-y-4">
          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Preferred Language
                </label>
                <Select
                  value={userData.preferredLanguage}
                  onValueChange={(value) => 
                    setUserData(prev => ({ ...prev, preferredLanguage: value }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Learning Goal
                </label>
                <Textarea
                  value={userData.learningGoal}
                  onChange={(e) => 
                    setUserData(prev => ({ ...prev, learningGoal: e.target.value }))
                  }
                  className="min-h-[100px]"
                  placeholder="What do you want to achieve?"
                />
              </div>
            </CardContent>
          </Card>

          {/* Display Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <label className="text-sm text-muted-foreground">Dark Mode</label>
                <Switch
                  checked={userData.darkMode}
                  onCheckedChange={(checked) =>
                    setUserData(prev => ({ ...prev, darkMode: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-muted-foreground">AI Replies</label>
                  <Switch
                    checked={userData.notifications.aiReplies}
                    onCheckedChange={(checked) =>
                      setUserData(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, aiReplies: checked }
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm text-muted-foreground">Notes Generated</label>
                  <Switch
                    checked={userData.notifications.notesGenerated}
                    onCheckedChange={(checked) =>
                      setUserData(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, notesGenerated: checked }
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm text-muted-foreground">Quiz Ready</label>
                  <Switch
                    checked={userData.notifications.quizReady}
                    onCheckedChange={(checked) =>
                      setUserData(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, quizReady: checked }
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <Button
            variant="outline"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={handleDeleteAccount}
          >
            Delete My Account
          </Button>
          <Button
            onClick={handleSaveChanges}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}