import { File } from "lucide-react";
import { type Message } from "./types";
import ReactMarkdown from 'react-markdown';

export const ChatMessage = ({ message }: { message: Message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
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
    </div>
  );
};