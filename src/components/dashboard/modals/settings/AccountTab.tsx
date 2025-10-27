import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CircleDashed, Pen, Flame, FileCheck2, Info, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export const AccountTab: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [contentCount, setContentCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (profile?.full_name) {
      setFullName(profile.full_name);
    }
  }, [profile]);

  useEffect(() => {
    fetchContentCount();
  }, [user]);

  const fetchContentCount = async () => {
    if (!user) return;
    
    const { count, error } = await supabase
      .from('content')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);
    
    if (!error && count !== null) {
      setContentCount(count);
    }
  };

  const handleSaveName = async () => {
    if (!fullName.trim() || fullName.trim().length < 2) {
      toast.error('Name must be at least 2 characters');
      return;
    }

    setIsLoading(true);
    const { error } = await updateProfile({ full_name: fullName.trim() });
    
    if (error) {
      toast.error('Failed to update name');
    } else {
      toast.success('Name updated successfully');
      setIsEditing(false);
    }
    setIsLoading(false);
  };

  const handleCopyReferralLink = () => {
    const referralCode = user?.id.slice(0, 8).toUpperCase();
    const link = `https://shattara.com/invite/${referralCode}`;
    navigator.clipboard.writeText(link);
    toast.success('Referral link copied!');
  };

  const profileComplete = profile?.full_name && profile?.language && profile?.purpose;

  return (
    <div className="pb-8">
      <div className="space-y-0">
        {!profileComplete && (
          <div className="mb-4 p-3 bg-blue-50/80 dark:bg-blue-950/20 rounded-2xl border border-blue-200 dark:border-blue-900/50">
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <CircleDashed className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                </div>
                <svg className="absolute -inset-0.5 w-11 h-11 transform -rotate-90">
                  <circle cx="22" cy="22" r="16" stroke="currentColor" strokeWidth="2.5" fill="none" className="text-blue-200 dark:text-blue-900/30" />
                  <circle cx="22" cy="22" r="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeDasharray="60 100" className="text-blue-500 dark:text-blue-400 transition-all duration-700 ease-out" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm text-blue-900 dark:text-blue-100">Complete Profile</h3>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">Get personalized contents</p>
              </div>
              <Button
                className="flex-shrink-0 flex items-center gap-1 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-900/50 rounded-lg px-3 h-9"
              >
                <span>Complete</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between py-3 border-b border-border font-medium">
          <span className="text-sm font-medium">Name</span>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-7 text-sm w-48"
                autoFocus
              />
              <Button
                size="sm"
                onClick={handleSaveName}
                disabled={isLoading}
                className="h-7 px-3"
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsEditing(false);
                  setFullName(profile?.full_name || '');
                }}
                className="h-7 px-3"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-primary/70">
                {profile?.full_name || 'Not set'}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-7 w-7 p-0 text-primary/70 hover:text-primary"
              >
                <Pen className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between py-3 border-b border-border font-medium">
          <span className="text-sm font-medium">Email</span>
          <span className="text-sm text-primary/70">{user?.email}</span>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-border font-medium">
          <span className="text-sm font-medium">Date Created</span>
          <span className="text-sm text-primary/70">
            {profile?.created_at ? format(new Date(profile.created_at), 'MMM dd, yyyy') : 'N/A'}
          </span>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-border font-medium">
          <span className="text-sm font-medium">Streaks</span>
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-yellow-500/70" />
            <span className="text-sm text-primary/70">1</span>
          </div>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-border font-medium">
          <span className="text-sm font-medium">Content Count</span>
          <div className="flex items-center gap-2">
            <FileCheck2 className="h-4 w-4 text-blue-500/70" />
            <span className="text-sm text-primary/70">{contentCount}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-border mt-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-semibold line-clamp-1">
                  15% Off - Referral Link
                </span>
              </div>
              <div className="text-xs text-primary/70 line-clamp-1">
                Invite friends, get 15% off for 1 month per referral
                <Info className="inline-block h-3.5 w-3.5 text-muted-foreground cursor-help ml-1 mb-0.5" />
              </div>
            </div>
            <Button
              onClick={handleCopyReferralLink}
              className="shrink-0 px-3 h-9"
            >
              Copy Link
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
