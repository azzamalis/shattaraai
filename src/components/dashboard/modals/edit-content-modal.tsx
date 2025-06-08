
import React, { useState, useEffect } from 'react';
import { BaseModal } from '@/components/ui/base-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus, FileText, Video, Youtube, Mic, RotateCcw } from 'lucide-react';
import { ContentTag, ContentType } from '../RoomContentTable';
import { ContentItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface EditContentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentItem: ContentItem | null;
  onSave?: (updatedItem: ContentItem) => void;
}

const getContentTypeIcon = (type: ContentType) => {
  switch (type) {
    case 'Video':
      return <Video className="h-4 w-4" />;
    case 'PDF Files':
      return <FileText className="h-4 w-4" />;
    case 'Recording':
      return <Mic className="h-4 w-4" />;
    case 'Youtube URL':
      return <Youtube className="h-4 w-4" />;
  }
};

const getTagColor = (tag: ContentTag) => {
  switch (tag) {
    case 'Summary':
      return 'bg-blue-500 text-white';
    case 'Notes':
      return 'bg-purple-500 text-white';
    case 'Exams':
      return 'bg-orange-500 text-white';
    case 'Flashcards':
      return 'bg-green-500 text-white';
  }
};

const availableTags: ContentTag[] = ['Summary', 'Notes', 'Exams', 'Flashcards'];
const availableContentTypes: { value: string; label: ContentType }[] = [
  { value: 'video', label: 'Video' },
  { value: 'pdf', label: 'PDF Files' },
  { value: 'recording', label: 'Recording' },
  { value: 'youtube', label: 'Youtube URL' }
];

export function EditContentModal({ open, onOpenChange, contentItem, onSave }: EditContentModalProps) {
  const [editedItem, setEditedItem] = useState<ContentItem | null>(null);
  const [originalItem, setOriginalItem] = useState<ContentItem | null>(null);
  const [newTagInput, setNewTagInput] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (contentItem) {
      setEditedItem({ ...contentItem });
      setOriginalItem({ ...contentItem });
      setHasChanges(false);
    }
  }, [contentItem]);

  useEffect(() => {
    if (editedItem && originalItem) {
      const changed = JSON.stringify(editedItem) !== JSON.stringify(originalItem);
      setHasChanges(changed);
    }
  }, [editedItem, originalItem]);

  const handleSave = () => {
    if (editedItem && onSave) {
      onSave(editedItem);
      toast({
        title: "Content updated",
        description: "Your changes have been saved successfully.",
      });
      onOpenChange(false);
    }
  };

  const handleReset = () => {
    if (originalItem) {
      setEditedItem({ ...originalItem });
      setNewTagInput('');
    }
  };

  const addTag = (tag: ContentTag) => {
    if (editedItem && editedItem.metadata?.contentTags && !editedItem.metadata.contentTags.includes(tag)) {
      setEditedItem({
        ...editedItem,
        metadata: {
          ...editedItem.metadata,
          contentTags: [...editedItem.metadata.contentTags, tag]
        }
      });
    }
    setNewTagInput('');
  };

  const removeTag = (tagToRemove: ContentTag) => {
    if (editedItem && editedItem.metadata?.contentTags) {
      setEditedItem({
        ...editedItem,
        metadata: {
          ...editedItem.metadata,
          contentTags: editedItem.metadata.contentTags.filter(tag => tag !== tagToRemove)
        }
      });
    }
  };

  const handleContentTypeChange = (value: string) => {
    if (editedItem) {
      setEditedItem({
        ...editedItem,
        type: value as ContentItem['type']
      });
    }
  };

  const filteredSuggestions = availableTags.filter(tag => 
    tag.toLowerCase().includes(newTagInput.toLowerCase()) &&
    !(editedItem?.metadata?.contentTags?.includes(tag))
  );

  if (!editedItem) return null;

  // Map ContentItem type to display type
  const getDisplayType = (type: string): ContentType => {
    switch (type) {
      case 'video':
        return 'Video';
      case 'pdf':
        return 'PDF Files';
      case 'recording':
        return 'Recording';
      case 'youtube':
        return 'Youtube URL';
      default:
        return 'PDF Files';
    }
  };

  const displayType = getDisplayType(editedItem.type);

  return (
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Content Details"
      contentClassName="w-[98vw] max-w-[1400px] max-h-[95vh] overflow-hidden !max-w-none sm:!max-w-[1400px]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        {/* Left Panel - Preview */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">Live Preview</h3>
          <div className="p-6 bg-muted/50 rounded-lg border border-border min-h-[350px]">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                {getContentTypeIcon(displayType)}
                <span className="text-sm text-muted-foreground">{displayType}</span>
              </div>
              
              <h4 className="text-xl font-semibold text-foreground">
                {editedItem.title || 'Untitled'}
              </h4>
              
              <p className="text-sm text-muted-foreground">
                Uploaded: {new Date(editedItem.createdAt).toLocaleDateString()}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {editedItem.metadata?.contentTags?.map((tag) => (
                  <Badge
                    key={tag}
                    className={`${getTagColor(tag as ContentTag)} text-xs`}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Edit Form */}
        <div className="space-y-6 overflow-y-auto max-h-[70vh] pr-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Edit Details</h3>
            {hasChanges && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Title</label>
            <Input
              value={editedItem.title}
              onChange={(e) => setEditedItem({ ...editedItem, title: e.target.value })}
              placeholder="Enter content title"
              className="component-base"
            />
          </div>

          {/* Content Type Dropdown */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Content Type</label>
            <Select value={editedItem.type} onValueChange={handleContentTypeChange}>
              <SelectTrigger className="component-base">
                <div className="flex items-center gap-2">
                  {getContentTypeIcon(displayType)}
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {availableContentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      {getContentTypeIcon(type.label)}
                      <span>{type.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Upload Date (Read-only) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Upload Date</label>
            <div className="p-3 bg-muted/30 rounded-md">
              <span className="text-sm text-muted-foreground">{new Date(editedItem.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Tags Management */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-foreground">AI Content Tags</label>
            
            {/* Current Tags */}
            <div className="flex flex-wrap gap-2">
              {editedItem.metadata?.contentTags?.map((tag) => (
                <Badge
                  key={tag}
                  className={`${getTagColor(tag as ContentTag)} text-xs flex items-center gap-1 pr-1`}
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag as ContentTag)}
                    className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>

            {/* Add New Tags */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  placeholder="Search and add tags..."
                  className="component-base"
                />
              </div>
              
              {/* Quick Add Suggestions */}
              <div className="flex flex-wrap gap-2">
                {availableTags
                  .filter(tag => !editedItem.metadata?.contentTags?.includes(tag))
                  .map((tag) => (
                    <Button
                      key={tag}
                      variant="outline"
                      size="sm"
                      onClick={() => addTag(tag)}
                      className="text-xs h-7"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {tag}
                    </Button>
                  ))}
              </div>

              {/* Filtered Suggestions */}
              {newTagInput && filteredSuggestions.length > 0 && (
                <div className="border border-border rounded-md bg-background p-2 space-y-1">
                  {filteredSuggestions.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => addTag(tag)}
                      className="w-full text-left p-2 text-sm hover:bg-accent rounded text-foreground"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-border mt-6">
        <div className="text-sm text-muted-foreground">
          {hasChanges ? "You have unsaved changes" : "No changes made"}
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            className="bg-foreground text-background hover:bg-foreground/90"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
