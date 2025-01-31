import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { ChatWrapper } from "./Chat/ChatWrapper";
import { ChatInterface } from "./Chat/ChatInterface";
import { FloatingContainer } from "./Chat/FloatingContainer";
import { useChatState } from "./Chat/hooks/useChatState";
import { useUIState } from "./Chat/hooks/useUIState";

export const AIAssistant = () => {
  const {
    fileInputRef,
    messages,
    input,
    isLoading,
    analysis,
    setInput,
    handleFileChange,
    handleSend,
    clearChat
  } = useChatState();

  const {
    isOpen,
    isEnlarged,
    isFloating,
    position,
    size,
    setIsOpen,
    setIsEnlarged,
    setIsFloating,
    setPosition,
    setSize,
    handleClose
  } = useUIState();

  return (
    <ChatWrapper>
      <FloatingContainer
        isFloating={isFloating}
        initialPosition={position}
        initialSize={size}
        onPositionChange={(x, y) => setPosition({ x, y })}
        onSizeChange={(width, height) => setSize({ width, height })}
      >
        {isOpen ? (
          <ChatInterface
            messages={messages}
            isLoading={isLoading}
            analysis={analysis}
            input={input}
            isEnlarged={isEnlarged}
            isFloating={isFloating}
            onInputChange={setInput}
            onSend={handleSend}
            onFileClick={() => fileInputRef.current?.click()}
            onFloat={() => setIsFloating(!isFloating)}
            onResize={() => setIsEnlarged(!isEnlarged)}
            onClose={handleClose}
            onClear={clearChat}
          />
        ) : (
          <Button
            onClick={() => setIsOpen(true)}
            className="rounded-full w-12 h-12 flex items-center justify-center"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
        />
      </FloatingContainer>
    </ChatWrapper>
  );
};