import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Search,
  CheckCheck,
  Trash2,
  ExternalLink,
  X,
  Clock,
  Inbox,
  Send,
  CornerUpLeft,
  AlertTriangle,
} from "lucide-react";
import { MOCK_MESSAGES } from "../../data/mockData";
import QuickChatModal from "./QuickChatModal";

export const MessagesDropdown = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChat, setActiveChat] = useState(null);
  const [threadToDelete, setThreadToDelete] = useState(null);
  const dropdownRef = useRef(null);

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("shoesmu_messages");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return MOCK_MESSAGES;
  });

  // Persist messages
  useEffect(() => {
    localStorage.setItem("shoesmu_messages", JSON.stringify(messages));
  }, [messages]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const unreadCount = messages.filter((m) => !m.read).length;

  const markThreadAsRead = (id) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read: true } : m))
    );
  };

  const markAllAsRead = () => {
    setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
  };

  const deleteThread = (id, e) => {
    e.stopPropagation();
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const handleOpenChat = (msg) => {
    markThreadAsRead(msg.id);
    setActiveChat(msg);
    setIsOpen(false);
  };

  const handleSendMessage = (chatId, text) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newMsg = {
      id: "msg-" + Date.now(),
      sender: "me",
      text,
      time: timeStr,
    };

    setMessages((prev) =>
      prev.map((thread) => {
        if (thread.id === chatId) {
          const updatedConv = [...(thread.conversation || []), newMsg];
          return {
            ...thread,
            lastMessage: text,
            time: "Just now",
            read: true,
            conversation: updatedConv,
          };
        }
        return thread;
      })
    );

    // Update active chat in modal
    setActiveChat((prev) => {
      if (!prev || prev.id !== chatId) return prev;
      return {
        ...prev,
        lastMessage: text,
        conversation: [...(prev.conversation || []), newMsg],
      };
    });

    // Simulate auto-reply if customer is marked online
    const currentThread = messages.find((m) => m.id === chatId);
    if (currentThread && currentThread.online) {
      setTimeout(() => {
        const autoReplies = [
          "Thank you for the quick confirmation! Much appreciated.",
          "Awesome, thanks for checking on that for me!",
          "Great service as always! I will proceed with the order.",
          "Noted, thanks Alex! Looking forward to receiving it.",
        ];
        const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
        const replyMsg = {
          id: "msg-reply-" + Date.now(),
          sender: "them",
          text: randomReply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) =>
          prev.map((thread) => {
            if (thread.id === chatId) {
              return {
                ...thread,
                lastMessage: randomReply,
                time: "Just now",
                read: false,
                conversation: [...(thread.conversation || []), replyMsg],
              };
            }
            return thread;
          })
        );

        setActiveChat((prev) => {
          if (!prev || prev.id !== chatId) return prev;
          return {
            ...prev,
            lastMessage: randomReply,
            conversation: [...(prev.conversation || []), replyMsg],
          };
        });
      }, 1400);
    }
  };

  // Filter messages by search query
  const filteredMessages = messages.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.sender.name.toLowerCase().includes(q) ||
      m.sender.email.toLowerCase().includes(q) ||
      m.lastMessage.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <div className="relative inline-block" ref={dropdownRef}>
        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Messages"
          className={`relative w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
            isOpen
              ? "bg-black text-white shadow-sm"
              : "hover:bg-gray-100 text-gray-700 active:scale-95"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[15px] h-[15px] px-1 rounded-full bg-[#D92D21] text-white text-[9px] font-bold flex items-center justify-center animate-in zoom-in duration-150">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Floating Popover Panel */}
        {isOpen && (
          <div className="fixed sm:absolute top-16 sm:top-full right-2 sm:right-0 mt-1 w-[calc(100vw-16px)] sm:w-[380px] max-w-[400px] bg-white border border-gray-200/90 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-50 overflow-hidden font-sans animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Header */}
            <div className="px-4 pt-3.5 pb-3 border-b border-gray-100 bg-gray-50/70">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[15px] text-ink">Inquiries & Chat</span>
                  {unreadCount > 0 ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                      {unreadCount} unread
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 text-[10px] font-bold">
                      All read
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      title="Mark all as read"
                      className="p-1.5 rounded-lg text-gray-500 hover:text-ink hover:bg-gray-200/70 transition-colors flex items-center gap-1 text-[11px] font-medium"
                    >
                      <CheckCheck className="w-3.5 h-3.5 text-gray-600" />
                      <span className="hidden sm:inline">Mark read</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search customer inquiries..."
                  className="w-full h-8 pl-8 pr-3 bg-white border border-gray-200 rounded-lg text-[12px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black transition-all"
                />
              </div>
            </div>

            {/* List of Message Threads */}
            <div className="max-h-[340px] overflow-y-auto divide-y divide-gray-100">
              {filteredMessages.length === 0 ? (
                <div className="py-12 px-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-100 mx-auto flex items-center justify-center text-gray-400 mb-3">
                    <Inbox className="w-6 h-6" />
                  </div>
                  <p className="text-[13px] font-bold text-gray-800">No inquiries found</p>
                  <p className="text-[12px] text-gray-400 mt-0.5">
                    {searchQuery ? "No matches for your search query." : "You have no active message threads."}
                  </p>
                </div>
              ) : (
                filteredMessages.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleOpenChat(item)}
                    className={`p-3.5 transition-all flex items-start gap-3 cursor-pointer group relative ${
                      item.read
                        ? "bg-white hover:bg-gray-50/80 opacity-85 hover:opacity-100"
                        : "bg-emerald-50/20 hover:bg-emerald-50/40"
                    }`}
                  >
                    {/* Avatar with Online Status */}
                    <div className="relative shrink-0 mt-0.5">
                      {item.sender.avatar ? (
                        <img
                          src={item.sender.avatar}
                          alt={item.sender.name}
                          className="w-9 h-9 rounded-full object-cover border border-gray-200 shadow-2xs"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs">
                          {item.sender.initials || "CU"}
                        </div>
                      )}
                      {item.online && (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute -bottom-0.5 -right-0.5" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-8">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <p
                          className={`text-[13px] leading-tight truncate ${
                            item.read ? "font-semibold text-gray-800" : "font-bold text-ink"
                          }`}
                        >
                          {item.sender.name}
                        </p>
                        <span className="text-[10.5px] text-gray-400 shrink-0 font-medium">
                          {item.time}
                        </span>
                      </div>
                      <p
                        className={`text-[12px] leading-snug line-clamp-2 ${
                          item.read ? "text-gray-500 font-normal" : "text-gray-900 font-medium"
                        }`}
                      >
                        {item.lastMessage}
                      </p>
                    </div>

                    {/* Unread indicator dot */}
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 absolute right-3 top-4 shadow-sm" />
                    )}

                    {/* Hover Quick Actions */}
                    <div className="absolute right-3 top-3.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenChat(item);
                        }}
                        title="Reply"
                        className="px-2 py-1 rounded-md bg-black text-white text-[11px] font-bold flex items-center gap-1 shadow-2xs hover:bg-gray-800"
                      >
                        <CornerUpLeft className="w-3 h-3" />
                        <span>Reply</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setThreadToDelete(item);
                        }}
                        title="Delete thread"
                        className="p-1 rounded-md bg-white border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 shadow-2xs cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-2.5 px-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between text-[11px]">
              <span className="text-gray-500">Live Customer Support Sync</span>
              <button
                type="button"
                onClick={() => {
                  navigate("/customers");
                  setIsOpen(false);
                }}
                className="text-ink font-bold hover:underline flex items-center gap-1"
              >
                <span>View Customers</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Chat Interactive Modal */}
      <QuickChatModal
        chat={activeChat}
        isOpen={Boolean(activeChat)}
        onClose={() => setActiveChat(null)}
        onSendMessage={handleSendMessage}
      />

      {/* ========================================================================= */}
      {/* MODAL: Confirm Delete Chat Thread                                         */}
      {/* ========================================================================= */}
      {threadToDelete &&
        createPortal(
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150 font-sans">
            <div
              className="fixed inset-0 -z-10 bg-transparent"
              onClick={() => setThreadToDelete(null)}
            />
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 text-center space-y-4 relative z-10 animate-in zoom-in-95 duration-150">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-2xs">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-ink">Delete Message Thread?</h3>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                  Are you sure you want to remove the message thread with <strong>{threadToDelete.sender?.name || "this customer"}</strong>? All message history will be permanently deleted.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setThreadToDelete(null)}
                  className="px-4 py-2 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMessages((prev) => prev.filter((m) => m.id !== threadToDelete.id));
                    setThreadToDelete(null);
                  }}
                  className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer transition-all active:scale-95 shadow-sm inline-flex items-center gap-1.5"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default MessagesDropdown;
