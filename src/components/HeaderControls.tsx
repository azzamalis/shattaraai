
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";

const HeaderControls = () => {
  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" className="border-border">
        <Download className="h-4 w-4 mr-2" />
        Save
      </Button>
      <Button variant="outline" size="sm" className="border-border">
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>
    </div>
  );
};

export default HeaderControls;
