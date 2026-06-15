import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send, User, MessageSquare } from "lucide-react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Messaging = () => {
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const currentUserId = user?._id || user?.id;

  useEffect(() => {
    fetchContacts();
    
    // Initialize Socket
    socketRef.current = io("https://talentforge-backend-production.up.railway.app");
    const token = localStorage.getItem("token");
    
    // Assuming backend decode token or something. 
    // Actually the current socket logic relies on "register_user" from frontend
    if (currentUserId) {
      socketRef.current.emit("register_user", currentUserId);
    }

    socketRef.current.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem("token");
      // Getting contacts + connected network users to chat with
      // For simplicity, we just fetch connections network and treat them as contacts
      const res = await axios.get("https://talentforge-backend-production.up.railway.app/api/connections/network", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const networkConnections = res.data.connections;
      const formattedContacts = networkConnections.map(conn => {
        const otherUser = conn.requester._id === currentUserId ? conn.recipient : conn.requester;
        return otherUser;
      });
      setContacts(formattedContacts);
    } catch (error) {
      toast.error("Failed to fetch contacts");
    }
  };

  const loadConversation = async (contact) => {
    setActiveContact(contact);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`https://talentforge-backend-production.up.railway.app/api/messages/${contact._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data.messages);
    } catch (error) {
      toast.error("Failed to load conversation");
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeContact) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("https://talentforge-backend-production.up.railway.app/api/messages", {
        receiverId: activeContact._id,
        content: newMessage,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessages((prev) => [...prev, res.data.message]);
      setNewMessage("");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto", height: "calc(100vh - 104px)", display: "flex", flexDirection: "column" }}>
      <h1 style={{ marginBottom: "20px" }}>Messages</h1>

      <div className="card" style={{ flex: 1, display: "flex", padding: 0, overflow: "hidden" }}>
        
        {/* Contacts Sidebar */}
        <div style={{ width: "300px", borderRight: "1px solid var(--color-border)", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "20px", borderBottom: "1px solid var(--color-border)", background: "var(--color-background)" }}>
            <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Connections</h3>
          </div>
          
          <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
            {contacts.length === 0 ? (
              <p className="text-muted" style={{ padding: "10px" }}>Connect with someone to start chatting!</p>
            ) : (
              contacts.map(contact => (
                <div 
                  key={contact._id} 
                  onClick={() => loadConversation(contact)}
                  style={{ 
                    padding: "15px", 
                    borderRadius: "8px", 
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    background: activeContact?._id === contact._id ? "var(--color-info-bg)" : "transparent",
                    transition: "background 0.2s"
                  }}
                  onMouseOver={(e) => { if(activeContact?._id !== contact._id) e.currentTarget.style.background = "var(--color-background)"; }}
                  onMouseOut={(e) => { if(activeContact?._id !== contact._id) e.currentTarget.style.background = "transparent"; }}
                >
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--color-primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <User size={20} />
                  </div>
                  <div>
                    <h4 style={{ margin: "0 0 4px 0" }}>{contact.fullName}</h4>
                    <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", textTransform: "capitalize" }}>{contact.role}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--color-background)" }}>
          {activeContact ? (
            <>
              {/* Chat Header */}
              <div style={{ padding: "20px", borderBottom: "1px solid var(--color-border)", background: "var(--color-surface)", display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--color-primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <User size={20} />
                </div>
                <h3 style={{ margin: 0 }}>{activeContact.fullName}</h3>
              </div>

              {/* Messages Container */}
              <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                {messages.length === 0 ? (
                  <div style={{ margin: "auto", color: "var(--color-text-muted)" }}>Send a message to start the conversation!</div>
                ) : (
                  messages.map(msg => {
                    const isMe = msg.sender === currentUserId;
                    return (
                      <div key={msg._id} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start" }}>
                        <div style={{
                          maxWidth: "70%",
                          padding: "12px 16px",
                          borderRadius: "16px",
                          borderBottomRightRadius: isMe ? "4px" : "16px",
                          borderBottomLeftRadius: isMe ? "16px" : "4px",
                          background: isMe ? "var(--color-primary)" : "var(--color-surface)",
                          color: isMe ? "white" : "var(--color-secondary)",
                          boxShadow: "var(--shadow-sm)",
                          border: isMe ? "none" : "1px solid var(--color-border)"
                        }}>
                          {msg.content}
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div style={{ padding: "20px", background: "var(--color-surface)", borderTop: "1px solid var(--color-border)" }}>
                <form onSubmit={sendMessage} style={{ display: "flex", gap: "12px" }}>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button type="submit" className="btn btn-primary" style={{ padding: "0 20px" }}>
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: "var(--color-text-muted)" }}>
              <MessageSquare size={48} style={{ marginBottom: "16px", opacity: 0.5 }} />
              <h3>Select a conversation</h3>
              <p>Choose a connection from the left to start chatting</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Messaging;
