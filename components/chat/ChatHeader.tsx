"use client";

import React from "react";
import { Button, Tooltip } from "antd";
import { FileTextOutlined } from "@ant-design/icons";

interface ChatHeaderProps {
  onOpenDocuments: () => void;
  documentCount?: number;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  onOpenDocuments,
  documentCount = 0,
}) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-end px-4 py-3 bg-gradient-to-b from-[#343541] via-[#343541]/80 to-transparent">
      <Tooltip title="Document References" placement="bottomLeft">
        <Button
          type="text"
          onClick={onOpenDocuments}
          className="!flex items-center gap-2 !text-[#8E8EA0] hover:!text-white hover:!bg-[#40414F] !rounded-lg !px-3 !h-9"
        >
          <FileTextOutlined className="text-lg" />
          <span className="text-sm">Documents</span>
          {documentCount > 0 && (
            <span className="flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-medium text-white bg-[#10A37F] rounded-full">
              {documentCount}
            </span>
          )}
        </Button>
      </Tooltip>
    </div>
  );
};

export default ChatHeader;
