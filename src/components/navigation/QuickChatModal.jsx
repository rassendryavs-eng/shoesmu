import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  User,
  CheckCheck,
  Smile,
  Paperclip,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

export const QuickChatModal = ({ chat, isOpen, onClose, onSendMessage }) => {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, chat?.conversation]);

  if (!isOpen || !chat) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(chat.id, inputText.trim());
    setInputText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.25)] border border-gray-200 overflow-hidden flex flex-col h-[560px] max-h-[90vh] font-sans animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Chat Header */}
        <div className="px-4 py-3 bg-black text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              {chat.sender.avatar ? (
                <img
                  src={chat.sender.avatar}
                  alt={chat.sender.name}
                  className="w-9 h-9 rounded-full object-cover border border-white/20"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center font-bold text-xs">
                  {chat.sender.initials || "CU"}
                </div>
              )}
              {chat.online && (
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-black absolute -bottom-0.5 -right-0.5" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-[14px] text-white leading-tight">
                  {chat.sender.name}
                </h3>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-gray-300 font-medium">
                  Customer
                </span>
              </div>
              <p className="text-[11px] text-gray-400 leading-tight mt-0.5">
                {chat.sender.email} • {chat.online ? "Online now" : "Offline"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Security / Verification Badge Banner */}
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
          <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Customer Direct Channel</span>
          </div>
          <span className="text-gray-400">Response time ~ 5 mins</span>
        </div>

        {/* Messages Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F9FAFB]">
          {chat.conversation && chat.conversation.length > 0 ? (
            chat.conversation.map((msg) => {
              const isMe = msg.sender === "me";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[13.5px] shadow-2xs leading-relaxed ${
                      isMe
                        ? "bg-black text-white rounded-br-xs"
                        : "bg-white text-gray-900 border border-gray-200/80 rounded-bl-xs"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className="flex items-center gap-1 mt-1 px-1 text-[10px] text-gray-400">
                    <span>{msg.time}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-emerald-600" />}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-400 text-xs">
              No message history with {chat.sender.name}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply Input Bar */}
        <form
          onSubmit={handleSend}
          className="p-3 bg-white border-t border-gray-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Reply to ${chat.sender.name}...`}
            className="flex-1 h-10 px-3.5 text-[13.5px] bg-gray-100/80 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-black transition-all"
            autoFocus
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="h-10 px-4 bg-black hover:bg-gray-800 disabled:opacity-40 text-white text-[13px] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuickChatModal;
