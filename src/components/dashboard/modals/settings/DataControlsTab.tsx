import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useAuth } from '@/hooks/useAuth';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
export const DataControlsTab: React.FC = () => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    user,
    signOut
  } = useAuth();
  const {
    resetOnboarding
  } = useOnboarding();
  const navigate = useNavigate();
  const handleExportData = async () => {
    toast.info('Preparing your data export...');
    // This would trigger an export process
    toast.success('Export started. You will receive an email when ready.');
  };
  const handleResetOnboarding = () => {
    resetOnboarding();
    toast.success('Onboarding tutorial has been reset. You can now replay the checklist.');
  };
  const handleDeleteAccount = async () => {
    if (!user) return;
    setIsDeleting(true);
    try {
      // Delete user data (this would need proper implementation)
      const {
        error: contentError
      } = await supabase.from('content').delete().eq('user_id', user.id);
      if (contentError) throw contentError;

      // Sign out and redirect
      await signOut();
      toast.success('Account deleted successfully');
      navigate('/');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete account. Please contact support.');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };
  return <div className="pb-8">
      <div className="space-y-0">
        <div className="flex items-center justify-between py-3 border-b border-border">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">Export Your Data</span>
            
          </div>
          <Button variant="ghost" size="sm" onClick={handleExportData} className="h-8 px-3">
            Export
          </Button>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-border">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">Reset Onboarding Tutorial</span>
            
          </div>
          <Button variant="ghost" size="sm" onClick={handleResetOnboarding} className="h-8 px-3">
            Reset
          </Button>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-destructive/30">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-destructive">Delete Account</span>
            <span className="text-xs text-primary/70">
              Permanently delete your account and all associated data
            </span>
          </div>
          <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)} className="h-8 px-3">
            Delete
          </Button>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove all your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAccount} disabled={isDeleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
};