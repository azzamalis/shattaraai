import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { User, Bell, Sun, Moon, Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

// Define the form schema
const profileFormSchema = z.object({
  preferredLanguage: z.string(),
  learningGoal: z.string(),
  heardFrom: z.string(),
  darkMode: z.boolean().default(true),
  notifyAiReplies: z.boolean().default(true),
  notifyNotesGenerated: z.boolean().default(true),
  notifyQuizReady: z.boolean().default(true)
});
type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Mock user data (would be fetched from Supabase)
const mockUserData = {
  id: "user123",
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  role: "Student",
  createdAt: "2023-09-15T12:00:00Z",
  avatarUrl: "",
  preferredLanguage: "English",
  learningGoal: "Master advanced algorithms",
  heardFrom: "Friend",
  darkMode: true,
  notifyAiReplies: true,
  notifyNotesGenerated: true,
  notifyQuizReady: false
};

// Mock learning stats (would be fetched from Supabase)
const mockLearningStats = {
  totalUploads: 24,
  totalSessions: 52,
  totalFlashcards: 187
};
const ProfileContent: React.FC = () => {
  const {
    toast
  } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(mockUserData.darkMode);

  // Initialize form with default values
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      preferredLanguage: mockUserData.preferredLanguage,
      learningGoal: mockUserData.learningGoal,
      heardFrom: mockUserData.heardFrom,
      darkMode: mockUserData.darkMode,
      notifyAiReplies: mockUserData.notifyAiReplies,
      notifyNotesGenerated: mockUserData.notifyNotesGenerated,
      notifyQuizReady: mockUserData.notifyQuizReady
    }
  });
  const onSubmit = (data: ProfileFormValues) => {
    console.log("Form submitted with data:", data);
    // Here you would update the user's profile in Supabase
    toast({
      title: "Profile updated",
      description: "Your profile settings have been saved."
    });
  };
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    form.setValue("darkMode", !isDarkMode);
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  return <div className="container mx-auto p-6 space-y-6">
      <div className="max-w-4xl mx-auto grid gap-6">
        {/* User Info Card */}
        <Card className="border-white/20 bg-[#222222] shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">User Information</CardTitle>
            <CardDescription className="text-white/70">
              View and manage your personal information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 bg-[#333333] text-white">
                  <AvatarImage src={mockUserData.avatarUrl} />
                  <AvatarFallback className="bg-[#00A3FF]/20 text-white">
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="absolute -bottom-2 -right-2 border-white/20 bg-[#333333] text-white hover:bg-[#444444]">
                      Change
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#222222] border-white/20 text-white">
                    <DialogHeader>
                      <DialogTitle>Update profile picture</DialogTitle>
                      <DialogDescription className="text-white/70">
                        Upload a new profile picture to personalize your account.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Input id="picture" type="file" className="col-span-4 bg-[#333333] border-white/20 text-white" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" className="bg-[#2323FF] hover:bg-[#2323FF]/90 text-white">Upload</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="space-y-3 text-center md:text-left flex-1">
                <div>
                  <h3 className="text-xl font-semibold text-white">{mockUserData.name}</h3>
                  <p className="text-white/70">{mockUserData.email}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="p-2 rounded-md bg-[#333333]">
                    <span className="text-xs font-medium text-white/70">Role</span>
                    <p className="text-white">{mockUserData.role}</p>
                  </div>
                  <div className="p-2 rounded-md bg-[#333333]">
                    <span className="text-xs font-medium text-white/70">Member Since</span>
                    <p className="text-white">{formatDate(mockUserData.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Learning Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-[#333333] text-center">
                <div className="text-2xl font-bold text-[#FFF]">{mockLearningStats.totalUploads}</div>
                <div className="text-sm text-white/70">Total Uploads</div>
              </div>
              <div className="p-3 rounded-lg bg-[#333333] text-center">
                <div className="text-2xl font-bold text-[#FFF]">{mockLearningStats.totalSessions}</div>
                <div className="text-sm text-white/70">Study Sessions</div>
              </div>
              <div className="p-3 rounded-lg bg-[#333333] text-center">
                <div className="text-2xl font-bold text-[#FFF]">{mockLearningStats.totalFlashcards}</div>
                <div className="text-sm text-white/70">Flashcards</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Preferences Form */}
        <Card className="border-white/20 bg-[#222222] shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">Learning Preferences</CardTitle>
            <CardDescription className="text-white/70">
              Update your learning settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="preferredLanguage" render={({
                  field
                }) => <FormItem>
                        <FormLabel className="text-white">Preferred Language</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-[#333333] border-white/20 text-white">
                              <SelectValue placeholder="Select a language" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-[#333333] border-white/20">
                            <SelectItem value="English" className="text-white hover:bg-white/10">English</SelectItem>
                            <SelectItem value="Spanish" className="text-white hover:bg-white/10">Spanish</SelectItem>
                            <SelectItem value="French" className="text-white hover:bg-white/10">French</SelectItem>
                            <SelectItem value="German" className="text-white hover:bg-white/10">German</SelectItem>
                            <SelectItem value="Mandarin" className="text-white hover:bg-white/10">Mandarin</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-400" />
                      </FormItem>} />
                  
                  <FormField control={form.control} name="heardFrom" render={({
                  field
                }) => <FormItem>
                        <FormLabel className="text-white">How Did You Hear About Us?</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-[#333333] border-white/20 text-white">
                              <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-[#333333] border-white/20">
                            <SelectItem value="Search" className="text-white hover:bg-white/10">Search Engine</SelectItem>
                            <SelectItem value="Friend" className="text-white hover:bg-white/10">Friend</SelectItem>
                            <SelectItem value="Social" className="text-white hover:bg-white/10">Social Media</SelectItem>
                            <SelectItem value="Ad" className="text-white hover:bg-white/10">Advertisement</SelectItem>
                            <SelectItem value="Other" className="text-white hover:bg-white/10">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-400" />
                      </FormItem>} />
                </div>
                
                <FormField control={form.control} name="learningGoal" render={({
                field
              }) => <FormItem>
                      <FormLabel className="text-white">Main Learning Goal</FormLabel>
                      <FormControl>
                        <Textarea placeholder="What do you want to achieve with Shattara AI?" className="resize-none h-20 bg-[#333333] border-white/20 text-white placeholder:text-white/50" {...field} />
                      </FormControl>
                      <FormDescription className="text-white/70">
                        This helps us tailor AI suggestions to your specific goals.
                      </FormDescription>
                      <FormMessage className="text-red-400" />
                    </FormItem>} />
                
                <Separator className="bg-white/20" />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Display Settings</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel className="text-white">Theme Mode</FormLabel>
                      <FormDescription className="text-white/70">Switch between light and dark mode</FormDescription>
                    </div>
                    <Button type="button" variant="outline" size="icon" onClick={toggleDarkMode} className="border-white/20 bg-[#333333] text-white hover:bg-[#444444]">
                      {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <Separator className="bg-white/20" />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Notification Settings</h3>
                  
                  <FormField control={form.control} name="notifyAiReplies" render={({
                  field
                }) => <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/20 bg-[#333333] p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-white">AI Replies</FormLabel>
                          <FormDescription className="text-white/70">
                            Receive notifications when AI responses are ready
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>} />
                  
                  <FormField control={form.control} name="notifyNotesGenerated" render={({
                  field
                }) => <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/20 bg-[#333333] p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-white">Notes Generated</FormLabel>
                          <FormDescription className="text-white/70">
                            Get notified when notes are generated from your uploads
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>} />
                  
                  <FormField control={form.control} name="notifyQuizReady" render={({
                  field
                }) => <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/20 bg-[#333333] p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-white">Quiz Ready</FormLabel>
                          <FormDescription className="text-white/70">
                            Get notified when a quiz is ready to take
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>} />
                </div>
                
                <CardFooter className="px-0 flex flex-col sm:flex-row gap-4">
                  <Button type="submit" className="w-full sm:w-auto bg-[#2323FF] hover:bg-[#2323FF]/90 text-white">
                    Save Changes
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full sm:w-auto flex items-center gap-2">
                        <Trash2 className="h-4 w-4" />
                        Delete My Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-[#222222] border-white/20 text-white">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-white/70">
                          This action cannot be undone. This will permanently delete your
                          account and remove all your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-[#333333] border-white/20 text-white hover:bg-[#444444]">Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white">Delete Account</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>;
};

// Wrap the profile content in the dashboard layout
const Profile = () => {
  return <DashboardLayout>
      <ProfileContent />
    </DashboardLayout>;
};
export default Profile;