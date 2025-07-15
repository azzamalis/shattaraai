import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContactSalesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  fullName: string;
  businessEmail: string;
  organizationName: string;
  teamSize: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  businessEmail?: string;
  organizationName?: string;
  teamSize?: string;
}

export function ContactSalesModal({ open, onOpenChange }: ContactSalesModalProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    businessEmail: '',
    organizationName: '',
    teamSize: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.businessEmail.trim()) {
      newErrors.businessEmail = 'Business email is required';
    } else if (!validateEmail(formData.businessEmail)) {
      newErrors.businessEmail = 'Please enter a valid email address';
    }

    if (!formData.organizationName.trim()) {
      newErrors.organizationName = 'Organization name is required';
    }

    if (!formData.teamSize) {
      newErrors.teamSize = 'Team size is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Reset form and close modal on success
      setFormData({
        fullName: '',
        businessEmail: '',
        organizationName: '',
        teamSize: '',
        message: '',
      });
      setErrors({});
      onOpenChange(false);
      
      toast({
        title: "Message Sent",
        description: "Thank you for your interest! Our sales team will contact you soon.",
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="w-[500px] bg-card border-border p-6 rounded-xl shadow-lg max-h-[90vh] overflow-y-auto"
      >
        <DialogTitle className="sr-only">Contact Sales</DialogTitle>
        <DialogDescription className="sr-only">
          Contact our sales team to learn more about our enterprise plans
        </DialogDescription>
        
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-foreground">Contact Sales</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onOpenChange(false)} 
              className="text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <X size={18} />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          
          {/* Form */}
          <div className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Full Name <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className={`bg-muted border-none text-foreground placeholder:text-muted-foreground ${
                  errors.fullName ? 'ring-2 ring-destructive' : ''
                }`}
              />
              {errors.fullName && (
                <p className="text-sm text-destructive">{errors.fullName}</p>
              )}
            </div>

            {/* Business Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Business Email <span className="text-destructive">*</span>
              </label>
              <Input
                type="email"
                placeholder="Enter your business email"
                value={formData.businessEmail}
                onChange={(e) => handleInputChange('businessEmail', e.target.value)}
                className={`bg-muted border-none text-foreground placeholder:text-muted-foreground ${
                  errors.businessEmail ? 'ring-2 ring-destructive' : ''
                }`}
              />
              {errors.businessEmail && (
                <p className="text-sm text-destructive">{errors.businessEmail}</p>
              )}
            </div>

            {/* Organization Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Organization Name <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="Enter your organization name"
                value={formData.organizationName}
                onChange={(e) => handleInputChange('organizationName', e.target.value)}
                className={`bg-muted border-none text-foreground placeholder:text-muted-foreground ${
                  errors.organizationName ? 'ring-2 ring-destructive' : ''
                }`}
              />
              {errors.organizationName && (
                <p className="text-sm text-destructive">{errors.organizationName}</p>
              )}
            </div>

            {/* Team Size */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Team Size <span className="text-destructive">*</span>
              </label>
              <Select value={formData.teamSize} onValueChange={(value) => handleInputChange('teamSize', value)}>
                <SelectTrigger className={`bg-muted border-none text-foreground ${
                  errors.teamSize ? 'ring-2 ring-destructive' : ''
                }`}>
                  <SelectValue placeholder="Select team size" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-background border border-border shadow-lg">
                  <SelectItem value="1-5">1–5</SelectItem>
                  <SelectItem value="6-20">6–20</SelectItem>
                  <SelectItem value="21-50">21–50</SelectItem>
                  <SelectItem value="51+">51+</SelectItem>
                </SelectContent>
              </Select>
              {errors.teamSize && (
                <p className="text-sm text-destructive">{errors.teamSize}</p>
              )}
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Message
              </label>
              <Textarea
                placeholder="Tell us about your needs..."
                rows={4}
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                className="bg-muted border-none text-foreground placeholder:text-muted-foreground resize-none"
              />
            </div>
          </div>
          
          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button 
              variant="ghost" 
              className="text-muted-foreground hover:text-foreground hover:bg-accent"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            
            <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                  <span>Sending...</span>
                </div>
              ) : (
                'Send Message'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}