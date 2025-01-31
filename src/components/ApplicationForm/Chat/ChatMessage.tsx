import { File, Bot, UserRound } from "lucide-react";
import { type Message } from "./types";
import ReactMarkdown from 'react-markdown';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const ChatMessage = ({ message }: { message: Message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <Avatar className="h-8 w-8 bg-primary">
          <AvatarFallback>
            <Bot className="h-5 w-5 text-primary-foreground" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={`rounded-lg p-3 max-w-[80%] ${
          isUser ? 'bg-blue-500 text-white' : 'bg-gray-100'
        }`}
      >
        {message.file ? (
          <div className="flex items-center gap-2">
            <File className="h-4 w-4" />
            <span>{message.file.name}</span>
          </div>
        ) : (
          <div className="prose prose-sm dark:prose-invert">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
      {isUser && (
        <Avatar className="h-8 w-8 bg-blue-500">
          <AvatarFallback>
            <UserRound className="h-5 w-5 text-white" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};