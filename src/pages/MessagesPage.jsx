import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  Check,
  Tag,
  Trash2,
  Send,
  Sparkles,
  Inbox,
  AlertTriangle,
} from "lucide-react";
import api from "../services/api";

export const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState("conv-1");
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [typingId, setTypingId] = useState(null);
  const [deletingConversation, setDeletingConversation] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchConversations = async () => {
    setLoading(true);
    const data = await api.getMessages();
    setConversations(data);
    if (data.length > 0 && !activeId) {
      setActiveId(data[0].id);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeId, conversations, typingId]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const activeConversation =
    conversations.find((c) => c.id === activeId) || conversations[0];

  const unreadCount = conversations.filter((c) => !c.read).length;

  const handleMarkAllRead = async () => {
    const updated = await api.markAllMessagesRead();
    setConversations(updated);
    showToast("All conversations marked as read");
  };

  const handleConfirmDelete = async () => {
    if (!deletingConversation) return;
    setActionLoading(true);
    try {
      const id = deletingConversation.id;
      const name = deletingConversation.sender?.name || "Customer";
      const updated = await api.deleteConversation(id);
      setConversations(updated);
      if (activeId === id) {
        setActiveId(updated.length > 0 ? updated[0].id : null);
      }
      setDeletingConversation(null);
      showToast(`Conversation with ${name} deleted`);
    } catch (err) {
      console.error("Failed to delete conversation:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // Smart Contextual Reply Generator based on what the admin replies
  const generateContextualReply = (userInput, conversation) => {
    const text = (userInput || "").toLowerCase();
    const senderName = conversation?.sender?.name || "Customer";
    const tag = conversation?.tag || "General";

    // 1. Stock / Ready / Availability
    if (
      text.includes("ready") ||
      text.includes("ada") ||
      text.includes("tersedia") ||
      text.includes("stok") ||
      text.includes("stock") ||
      text.includes("size") ||
      text.includes("ukuran")
    ) {
      const replies = [
        "Wah bagus deh kalau ready! Saya langsung checkout sekarang ya kak.",
        "Awesome, glad to hear it's in stock! Placing the order right away.",
        "Sip kak, terima kasih infonya! Saya pesan yang ukuran tersebut ya.",
        "Great, thanks for confirming availability! Ordering now.",
      ];
      return replies[Math.floor(Math.random() * replies.length)];
    }

    // 2. Shipping / Tracking / Delivery / Dispatch
    if (
      text.includes("kirim") ||
      text.includes("resi") ||
      text.includes("tracking") ||
      text.includes("dikirim") ||
      text.includes("kurir") ||
      text.includes("paket") ||
      text.includes("antar") ||
      text.includes("shipping") ||
      text.includes("dispatch") ||
      text.includes("dhl") ||
      text.includes("jne")
    ) {
      const replies = [
        "Siap, nomor resinya sudah saya cek dan aktif. Terima kasih banyak atas update cepatnya!",
        "Got it! Tracking number is confirmed and moving. Appreciate the swift dispatch!",
        "Mantap kak, terima kasih ya sudah diproses cepat pengirimannya.",
      ];
      return replies[Math.floor(Math.random() * replies.length)];
    }

    // 3. Discount / Promo / Voucher / Price
    if (
      text.includes("diskon") ||
      text.includes("promo") ||
      text.includes("voucher") ||
      text.includes("kupon") ||
      text.includes("harga") ||
      text.includes("discount") ||
      text.includes("run20") ||
      text.includes("ship100") ||
      text.includes("school15") ||
      text.includes("spring")
    ) {
      const replies = [
        "Keren banget promonya! Kodenya langsung berhasil saya terapkan di checkout.",
        "Awesome discount! Voucher code worked smoothly, thank you so much.",
        "Terima kasih atas potongan diskonnya kak!",
      ];
      return replies[Math.floor(Math.random() * replies.length)];
    }

    // 4. Gratitude / Greetings
    if (
      text.includes("terima kasih") ||
      text.includes("makasih") ||
      text.includes("thanks") ||
      text.includes("thank you") ||
      text.includes("tq") ||
      text.includes("sama-sama") ||
      text.includes("you're welcome")
    ) {
      const replies = [
        "Sama-sama kak! Senang sekali belanja di Shoesmu, pelayanannya ramah banget.",
        "You're very welcome! Great customer service like this is why I keep coming back.",
        "Sama-sama kak! Sukses selalu untuk Shoesmu!",
      ];
      return replies[Math.floor(Math.random() * replies.length)];
    }

    // 5. Short Confirmation / OK / Siap / Yes
    if (
      text === "oke" ||
      text === "ok" ||
      text === "sip" ||
      text === "siap" ||
      text === "baik" ||
      text === "yes" ||
      text === "ya" ||
      text.includes("noted") ||
      text.includes("done")
    ) {
      const replies = [
        "Understood, appreciate you looking into this so quickly.",
        "Sip kak, terima kasih banyak atas bantuannya ya!",
        "Noted! Have a great day ahead!",
      ];
      return replies[Math.floor(Math.random() * replies.length)];
    }

    // 6. Support Bot specific responses
    if (tag === "Support" || senderName.toLowerCase().includes("bot")) {
      const botReplies = [
        "Ticket updated successfully in the system logs. Status: Handled.",
        "System automated confirmation: Response recorded by administrative agent.",
        "All pending inquiries for this queue are now synchronized.",
      ];
      return botReplies[Math.floor(Math.random() * botReplies.length)];
    }

    // 7. General Contextual Fallbacks
    const generalReplies = [
      "Understood, appreciate you looking into this so quickly.",
      "Baik kak, terima kasih banyak atas penjelasan dan responnya ya!",
      "Awesome, thanks for the update! Really helpful.",
      "Noted kak, terima kasih atas pelayanannya yang sangat responsif.",
    ];
    return generalReplies[Math.floor(Math.random() * generalReplies.length)];
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversation) return;

    const text = inputText.trim();
    const currentTargetId = activeConversation.id;
    const targetConversation = activeConversation;
    setInputText("");

    // Send user message
    const updated = await api.sendMessage(currentTargetId, text);
    setConversations(updated);

    // Trigger realistic live customer reply with typing indicator for ANY conversation
    setTypingId(currentTargetId);

    setTimeout(async () => {
      const contextualReplyText = generateContextualReply(text, targetConversation);
      const withReply = await api.receiveCustomerReply(currentTargetId, contextualReplyText);
      setConversations(withReply);
      setTypingId(null);
    }, 1300);
  };

  // Filter Logic
  const filteredConversations = conversations.filter((item) => {
    // Filter tab
    if (activeFilter === "Unread" && item.read) return false;
    if (activeFilter === "Order" && item.tag !== "Order") return false;
    if (activeFilter === "Support" && item.tag !== "Support") return false;
    if (activeFilter === "General" && item.tag !== "General") return false;

    // Search query
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.sender.name.toLowerCase().includes(q) ||
      item.sender.email.toLowerCase().includes(q) ||
      item.lastMessage.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111111] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-[13px] font-medium animate-in fade-in slide-in-from-bottom-2 duration-150 pointer-events-none">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header: Title, Subtitle, & Search + Mark All Read */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-extrabold text-ink tracking-tight leading-tight">
            Messages
          </h1>
          <p className="text-[13.5px] text-gray-500 font-medium mt-1">
            {loading
              ? "Loading conversations..."
              : `${conversations.length} conversations · ${unreadCount} unread`}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Search sender or message */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sender or message..."
              className="w-56 sm:w-64 h-9 px-3.5 bg-gray-100/90 border border-gray-200 rounded-full text-xs text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-black outline-none transition-all"
            />
          </div>

          {/* Mark all read button */}
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="h-9 px-4 rounded-full bg-black hover:bg-gray-800 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition-all active:scale-95 shrink-0"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {["All", "Unread", "Order", "Support", "General"].map((tab) => {
          const isActive = activeFilter === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveFilter(tab)}
              className={`px-3.5 py-1 rounded-full text-xs transition-all font-semibold cursor-pointer ${
                isActive
                  ? "bg-black text-white font-bold shadow-2xs"
                  : "bg-white border border-gray-200 text-gray-600 hover:text-black hover:border-gray-300"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Main 2-Column Split: List on Left, Chat on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Conversations List */}
        <div className="lg:col-span-4 xl:col-span-4 bg-white border border-gray-200/90 rounded-2xl shadow-2xs overflow-hidden divide-y divide-gray-100 h-[calc(100vh-210px)] min-h-[500px] max-h-[750px] overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-400 text-xs">
              Loading inbox...
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-gray-400 space-y-1">
              <Inbox className="w-6 h-6 mx-auto text-gray-300 mb-2" />
              <p className="font-bold text-xs text-gray-700">No conversations</p>
              <p className="text-[11px]">Try adjusting your filter or search.</p>
            </div>
          ) : (
            filteredConversations.map((item) => {
              const isSelected = activeConversation?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveId(item.id)}
                  className={`p-4 transition-all cursor-pointer flex gap-3.5 items-start ${
                    isSelected
                      ? "bg-gray-100/80 font-medium"
                      : "hover:bg-gray-50/70"
                  }`}
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-black text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    {item.sender.initials}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4 className="font-bold text-[13.5px] text-ink truncate leading-tight">
                        {item.sender.name}
                      </h4>
                      <span className="text-[11px] text-gray-400 shrink-0 font-medium">
                        {item.time}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 truncate leading-snug">
                      {item.lastMessage}
                    </p>

                    {/* Tag Badge */}
                    {item.tag && (
                      <div className="mt-1.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-gray-600 bg-gray-100 border border-gray-200/80">
                          <Tag className="w-2.5 h-2.5 text-gray-400" />
                          <span>{item.tag}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Chat Window with Fixed Header & Bottom Input */}
        <div className="lg:col-span-8 xl:col-span-8 bg-white border border-gray-200/90 rounded-2xl shadow-2xs overflow-hidden flex flex-col h-[calc(100vh-210px)] min-h-[500px] max-h-[750px]">
          {activeConversation ? (
            <>
              {/* Chat Header (Fixed at top) */}
              <div className="shrink-0 px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-black text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    {activeConversation.sender.initials}
                  </div>
                  <div>
                    <h3 className="font-bold text-[14px] text-ink leading-tight">
                      {activeConversation.sender.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5 leading-tight">
                      {activeConversation.sender.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {activeConversation.tag && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold text-gray-700 bg-gray-100 border border-gray-200">
                      <Tag className="w-3 h-3 text-gray-400" />
                      <span>{activeConversation.tag}</span>
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setDeletingConversation(activeConversation)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete conversation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chat Thread Messages (Only this container scrolls) */}
              <div className="flex-1 min-h-0 p-6 overflow-y-auto space-y-4 bg-white">
                {activeConversation.conversation &&
                activeConversation.conversation.length > 0 ? (
                  activeConversation.conversation.map((msg) => {
                    const isMe = msg.sender === "me";
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${
                          isMe ? "items-end" : "items-start"
                        }`}
                      >
                        {/* Bubble */}
                        <div
                          className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed shadow-2xs ${
                            isMe
                              ? "bg-black text-white rounded-br-xs"
                              : "bg-white border border-gray-200/90 text-gray-900 rounded-bl-xs"
                          }`}
                        >
                          {msg.text}
                        </div>
                        {/* Time below */}
                        <span className="text-[11px] text-gray-400 mt-1 px-1">
                          {msg.time}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex items-center justify-center text-center text-gray-400 text-xs">
                    No message history with {activeConversation.sender.name}
                  </div>
                )}

                {/* Typing Indicator */}
                {typingId === activeConversation.id && (
                  <div className="flex flex-col items-start animate-in fade-in slide-in-from-bottom-1 duration-150">
                    <div className="bg-gray-100/90 border border-gray-200/70 rounded-2xl rounded-bl-xs px-4 py-2.5 shadow-2xs flex items-center gap-2">
                      <span className="text-[12px] font-semibold text-gray-600">
                        {activeConversation.sender.name.split(" ")[0]} is typing
                      </span>
                      <span className="flex gap-1 items-center pt-0.5">
                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
                      </span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Reply Input Box (Fixed at bottom) */}
              <form
                onSubmit={handleSendMessage}
                className="shrink-0 p-4 border-t border-gray-100 flex items-center gap-3 bg-white"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Reply to ${activeConversation.sender.name.split(" ")[0]}...`}
                  className="flex-1 h-11 px-4 text-[13.5px] bg-gray-100/90 border border-gray-200 rounded-full text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-black outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="h-11 px-5 rounded-full bg-black hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition-all active:scale-95 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 text-xs">
              Select a conversation to view chat history
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: Confirm Delete Conversation                                       */}
      {/* ========================================================================= */}
      {deletingConversation &&
        createPortal(
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150 font-sans">
            <div
              className="fixed inset-0 -z-10 bg-transparent"
              onClick={() => !actionLoading && setDeletingConversation(null)}
            />
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 text-center space-y-4 relative z-10 animate-in zoom-in-95 duration-150">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-2xs">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-ink">Delete Conversation?</h3>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                  Are you sure you want to delete the chat thread with <strong>{deletingConversation.sender?.name || "this customer"}</strong>? All message history will be permanently removed.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2.5 pt-2">
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => setDeletingConversation(null)}
                  className="px-4 py-2 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors active:scale-95 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleConfirmDelete}
                  className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer transition-all active:scale-95 shadow-sm disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {actionLoading && (
                    <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  )}
                  <span>{actionLoading ? "Deleting..." : "Yes, Delete"}</span>
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default MessagesPage;
