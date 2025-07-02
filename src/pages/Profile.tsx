import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { languages } from "@/components/onboarding/data/languages";
import { getGoalOptions } from "@/components/onboarding/data/goals";
import { sourceOptions } from "@/components/onboarding/data/sources";
import { SubscriptionPlanCard } from "@/components/dashboard/SubscriptionPlanCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { Database } from "@/integrations/supabase/types";

interface NotificationSettings {
  aiReplies: boolean;
  notesGenerated: boolean;
  quizReady: boolean;
}

export default function Profile() {
  const {
    user,
    profile,
    updateProfile,
    loading
  } = useAuth();
  const {
    t
  } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);

  // Local state for form data
  const [formData, setFormData] = useState({
    language: '',
    purpose: '',
    goal: '',
    source: ''
  });
  const [notifications, setNotifications] = useState<NotificationSettings>({
    aiReplies: true,
    notesGenerated: true,
    quizReady: false
  });

  // Mock stats - in a real app, these would come from the database
  const mockStats = {
    uploads: 24,
    sessions: 52,
    flashcards: 187,
    progressPercent: 75
  };

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        language: profile.language || 'en',
        purpose: profile.purpose || '',
        goal: profile.goal || '',
        source: profile.source || ''
      });
    }
  }, [profile]);
  const handleSaveChanges = async () => {
    if (!user || !profile) {
      toast.error("Authentication required", {
        description: "Please sign in to update your profile."
      });
      return;
    }
    setIsSaving(true);
    try {
      // Map form values to database enum values
      const purposeMap: Record<string, Database['public']['Enums']['user_purpose']> = {
        'student': 'student',
        'teacher': 'teacher',
        'work': 'professional',
        'research': 'researcher'
      };
      const goalMap: Record<string, Database['public']['Enums']['user_goal']> = {
        'exam-prep': 'exam_prep',
        'research': 'data_analysis',
        'coursework': 'homework_help',
        'lesson-planning': 'lesson_planning',
        'grading': 'student_assessment',
        'personalization': 'content_creation',
        'productivity': 'career_advancement',
        'learning': 'skill_building',
        'innovation': 'collaboration'
      };
      const sourceMap: Record<string, Database['public']['Enums']['user_source']> = {
        'search': 'search_engine',
        'instagram': 'social_media',
        'tiktok': 'social_media',
        'twitter': 'social_media',
        'youtube': 'social_media',
        'online-ad': 'advertisement',
        'friends-family': 'referral'
      };
      const updates: Partial<Database['public']['Tables']['profiles']['Update']> = {
        language: formData.language,
        purpose: formData.purpose ? purposeMap[formData.purpose] : null,
        goal: formData.goal ? goalMap[formData.goal] : null,
        source: formData.source ? sourceMap[formData.source] : null
      };
      const {
        error
      } = await updateProfile(updates);
      if (error) {
        toast.error("Failed to save changes", {
          description: error.message
        });
      } else {
        toast.success("Changes saved", {
          description: "Your profile has been updated successfully."
        });
      }
    } catch (error) {
      toast.error("An unexpected error occurred", {
        description: "Please try again later."
      });
    } finally {
      setIsSaving(false);
    }
  };
  const handleDeleteAccount = () => {
    toast.error("Are you sure?", {
      description: "This action cannot be undone. This will permanently delete your account."
    });
  };
  if (loading) {
    return <DashboardLayout>
        <div className="h-full bg-background text-foreground flex items-center justify-center">
          <div className="text-muted-foreground">Loading profile...</div>
        </div>
      </DashboardLayout>;
  }
  if (!user || !profile) {
    return <DashboardLayout>
        <div className="h-full bg-background text-foreground flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground mb-2">Profile not found</h2>
            <p className="text-muted-foreground">Please sign in to view your profile.</p>
          </div>
        </div>
      </DashboardLayout>;
  }
  return <DashboardLayout>
      <div className="h-full bg-background text-foreground">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <Card className="card-enhanced w-full mb-6 border-0">
            <CardContent className="p-6">
              <div className="flex flex-wrap justify-between items-start gap-6">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {profile.full_name || user.email?.split('@')[0] || 'User'}
                  </h1>
                  <p className="text-muted-foreground mb-2">
                    {profile.purpose ? profile.purpose.charAt(0).toUpperCase() + profile.purpose.slice(1) : 'User'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Member since {profile.created_at ? format(new Date(profile.created_at), "MMMM yyyy") : 'Recently'}
                  </p>
                </div>

                <div className="flex flex-wrap gap-8">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{mockStats.uploads}</p>
                    <p className="text-sm text-muted-foreground">Uploads</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{mockStats.sessions}</p>
                    <p className="text-sm text-muted-foreground">Sessions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{mockStats.flashcards}</p>
                    <p className="text-sm text-muted-foreground">Flashcards</p>
                  </div>
                  
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-enhanced border-0">
            <CardHeader>
              <CardTitle className="text-foreground">Preferences</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Language
                  </label>
                  <Select value={formData.language} onValueChange={value => setFormData(prev => ({
                  ...prev,
                  language: value
                }))}>
                    <SelectTrigger className="w-full component-base">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {languages.map(lang => <SelectItem key={lang.value} value={lang.value} className="text-foreground hover:bg-accent">
                          {lang.label}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    How do you want to use Shattara?
                  </label>
                  <Select value={formData.purpose} onValueChange={value => setFormData(prev => ({
                  ...prev,
                  purpose: value,
                  goal: ''
                }))}>
                    <SelectTrigger className="w-full component-base">
                      <SelectValue placeholder="I'm here for" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="student" className="text-foreground hover:bg-accent">Student</SelectItem>
                      <SelectItem value="teacher" className="text-foreground hover:bg-accent">Teacher</SelectItem>
                      <SelectItem value="work" className="text-foreground hover:bg-accent">Work</SelectItem>
                      <SelectItem value="research" className="text-foreground hover:bg-accent">Research</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    What's your main personal goal with Shattara?
                  </label>
                  <Select value={formData.goal} onValueChange={value => setFormData(prev => ({
                  ...prev,
                  goal: value
                }))}>
                    <SelectTrigger className="w-full component-base">
                      <SelectValue placeholder="Select your goals" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {getGoalOptions(formData.purpose).map(option => <SelectItem key={option.value} value={option.value} className="text-foreground hover:bg-accent">
                          {t(option.labelKey)}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    How did you hear about us?
                  </label>
                  <Select value={formData.source} onValueChange={value => setFormData(prev => ({
                  ...prev,
                  source: value
                }))}>
                    <SelectTrigger className="w-full component-base">
                      <SelectValue placeholder="I found Shattara from" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {sourceOptions.map(option => <SelectItem key={option.value} value={option.value} className="text-foreground hover:bg-accent">
                          {t(option.labelKey)}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-enhanced border-0">
            <CardHeader>
              <CardTitle className="text-foreground">Notification Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-muted-foreground">AI Replies</label>
                  <Switch checked={notifications.aiReplies} onCheckedChange={checked => setNotifications(prev => ({
                  ...prev,
                  aiReplies: checked
                }))} className="data-[state=checked]:bg-primary" />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm text-muted-foreground">Notes Generated</label>
                  <Switch checked={notifications.notesGenerated} onCheckedChange={checked => setNotifications(prev => ({
                  ...prev,
                  notesGenerated: checked
                }))} className="data-[state=checked]:bg-primary" />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm text-muted-foreground">Quiz Ready</label>
                  <Switch checked={notifications.quizReady} onCheckedChange={checked => setNotifications(prev => ({
                  ...prev,
                  quizReady: checked
                }))} className="data-[state=checked]:bg-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="border-0">
            <SubscriptionPlanCard />
          </div>

          <div className="flex justify-end gap-4 pt-2">
            <Button variant="outline" className="bg-destructive text-white hover:bg-destructive/90 hover:text-white border-destructive" onClick={handleDeleteAccount}>
              Delete My Account
            </Button>
            <Button onClick={handleSaveChanges} disabled={isSaving} className="bg-foreground text-background hover:bg-foreground/90">
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>;
}
