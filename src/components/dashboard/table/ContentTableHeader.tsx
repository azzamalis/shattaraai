
import React from 'react';

interface ContentTableHeaderProps {
  showSelectionColumn?: boolean;
}

export function ContentTableHeader({ showSelectionColumn }: ContentTableHeaderProps) {
  return (
    <thead>
      <tr className="border-b border-dashboard-separator">
        {showSelectionColumn && (
          <th className="text-left py-4 px-4 font-medium text-dashboard-text text-base w-10">
            Select
          </th>
        )}
        <th className="text-left py-4 px-4 font-medium text-dashboard-text text-base">Title Name</th>
        <th className="text-center py-4 px-4 font-medium text-dashboard-text text-base">Uploaded Date</th>
        <th className="text-center py-4 px-4 font-medium text-dashboard-text text-base">AI Content Tags</th>
        <th className="text-center py-4 px-4 font-medium text-dashboard-text text-base">Type</th>
        <th className="text-center py-4 px-4 font-medium text-dashboard-text text-base">Actions</th>
      </tr>
    </thead>
  );
}
