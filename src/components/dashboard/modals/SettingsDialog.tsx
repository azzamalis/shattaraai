import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { X, User, Palette, CreditCard, Users, Database } from 'lucide-react';
import { AccountTab } from './settings/AccountTab';
import { PersonalizationTab } from './settings/PersonalizationTab';
import { PlanBillingTab } from './settings/PlanBillingTab';
import { MembersTab } from './settings/MembersTab';
import { DataControlsTab } from './settings/DataControlsTab';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onOpenChange }) => {
  const [activeTab, setActiveTab] = useState('account');

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'personalization', label: 'Personalization', icon: Palette },
    { id: 'plan', label: 'Plan & Billing', icon: CreditCard },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'data', label: 'Data Controls', icon: Database },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[90vw] md:max-w-3xl lg:max-w-3xl h-[70vh] md:h-[600px] p-0 gap-0 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col md:flex-row h-full min-h-0">
          {/* Mobile Tab Navigation */}
          <div className="block md:hidden border-b border-border p-2">
            <div className="flex justify-between items-center mb-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="rounded-lg h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <TabsList className="w-full h-auto p-0 bg-transparent flex gap-1 overflow-x-auto touch-pan-x">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex-shrink-0 flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors whitespace-nowrap font-medium touch-manipulation relative data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=inactive]:text-primary/70 data-[state=inactive]:hover:text-foreground data-[state=inactive]:hover:bg-muted/50"
                >
                  <tab.icon className="h-3 w-3" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden md:block w-48 bg-muted/50 border-r border-border p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="rounded-lg h-8 w-8 p-0 ml-0.5 mb-1"
            >
              <X className="h-4 w-4" />
            </Button>
            <TabsList className="w-full h-auto p-0 bg-transparent flex flex-col space-y-1">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors relative justify-start whitespace-nowrap data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=inactive]:text-primary/70 data-[state=inactive]:hover:text-foreground data-[state=inactive]:hover:bg-muted/50"
                >
                  <tab.icon className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto max-h-full">
            <div className="p-4 md:p-6">
              <TabsContent value="account" className="mt-0">
                <AccountTab />
              </TabsContent>
              <TabsContent value="personalization" className="mt-0">
                <PersonalizationTab />
              </TabsContent>
              <TabsContent value="plan" className="mt-0">
                <PlanBillingTab />
              </TabsContent>
              <TabsContent value="members" className="mt-0">
                <MembersTab />
              </TabsContent>
              <TabsContent value="data" className="mt-0">
                <DataControlsTab />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
