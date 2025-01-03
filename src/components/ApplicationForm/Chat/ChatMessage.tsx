import { type Message } from './types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`rounded-lg p-3 max-w-[80%] ${
          message.role === 'assistant' ? 'bg-gray-100' : 'bg-blue-500 text-white'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};