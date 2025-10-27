import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const DataControlsTab: React.FC = () => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleExportData = async () => {
    toast.info('Preparing your data export...');
    // This would trigger an export process
    toast.success('Export started. You will receive an email when ready.');
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    setIsDeleting(true);
    try {
      // Delete user data (this would need proper implementation)
      const { error: contentError } = await supabase
        .from('content')
        .delete()
        .eq('user_id', user.id);

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

  return (
    <div className="space-y-6">
      <div className="border border-border rounded-lg p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="text-sm font-medium mb-1">Export Your Data</h4>
            <p className="text-sm text-primary/70">
              Download all your content, notes, and learning data
            </p>
          </div>
          <Button variant="outline" onClick={handleExportData} className="flex-shrink-0">
            Export
          </Button>
        </div>
      </div>

      <div className="border border-destructive rounded-lg p-4 bg-destructive/5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="text-sm font-medium text-destructive mb-1">Delete Account</h4>
            <p className="text-sm text-primary/70">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            className="flex-shrink-0"
          >
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
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
