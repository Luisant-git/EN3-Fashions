import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/WhatsAppChat.scss';

const WhatsAppChat = () => {
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [chats, setChats] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [readMessages, setReadMessages] = useState(() => {
    const saved = localStorage.getItem('readMessages');
    return saved ? JSON.parse(saved) : {};
  });
  const [sessionState, setSessionState] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [readMessages]);

  useEffect(() => {
    if (selectedChat) {
      fetchSessionState();
    }
  }, [selectedChat]);



  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/whatsapp/messages`);
      setMessages(response.data);
      
      const uniqueChats = {};
      response.data.forEach(msg => {
        if (!uniqueChats[msg.from]) {
          uniqueChats[msg.from] = {
            phone: msg.from,
            lastMessage: msg.message,
            lastTime: msg.createdAt,
            unreadCount: 0
          };
        }
        if (new Date(msg.createdAt) > new Date(uniqueChats[msg.from].lastTime)) {
          uniqueChats[msg.from].lastMessage = msg.message;
          uniqueChats[msg.from].lastTime = msg.createdAt;
        }
        if (msg.direction === 'incoming' && (!readMessages[msg.from] || new Date(msg.createdAt) > new Date(readMessages[msg.from]))) {
          uniqueChats[msg.from].unreadCount++;
        }
      });
      setChats(Object.values(uniqueChats));
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if ((!messageText.trim() && !selectedFile) || !selectedChat) return;

    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('to', selectedChat);
        if (messageText.trim()) formData.append('caption', messageText);
        
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/whatsapp/send-media`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSelectedFile(null);
      } else {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/whatsapp/send-message`, {
          to: selectedChat,
          message: messageText
        });
      }
      setMessageText('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const fetchSessionState = async () => {
    if (!selectedChat) return;
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/whatsapp-session/session?phone=${selectedChat}`);
      setSessionState(response.data);
    } catch (error) {
      setSessionState(null);
    }
  };

  const sendCatalogMenu = async (phone) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/whatsapp-session/test-menu`, {
        phone,
        message: 'menu'
      });
      setTimeout(() => {
        fetchMessages();
        fetchSessionState();
      }, 500);
    } catch (error) {
      console.error('Error sending menu:', error);
    }
  };

  const filteredMessages = selectedChat 
    ? messages.filter(m => m.from === selectedChat)
    : [];

  return (
    <div className="whatsapp-chat">
      <div className="chat-sidebar">
        <h2>WhatsApp Chats</h2>
        {chats.map(chat => (
          <div 
            key={chat.phone}
            className={`chat-item ${selectedChat === chat.phone ? 'active' : ''} ${chat.unreadCount > 0 ? 'unread' : ''}`}
            onClick={() => {
              setSelectedChat(chat.phone);
              if (chat.unreadCount > 0) {
                const newReadMessages = { ...readMessages, [chat.phone]: new Date().toISOString() };
                setReadMessages(newReadMessages);
                localStorage.setItem('readMessages', JSON.stringify(newReadMessages));
              }
            }}
          >
            <div className="chat-avatar">{chat.phone.slice(-4)}</div>
            <div className="chat-info">
              <div className="chat-phone">
                {chat.phone}
                {chat.unreadCount > 0 && <span className="unread-badge">{chat.unreadCount}</span>}
              </div>
              <div className="chat-last-msg">{chat.lastMessage}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-main">
        {selectedChat ? (
          <>
            <div className="chat-header">
              <div className="header-info">
                <h3>{selectedChat}</h3>
                {sessionState && (
                  <span className="session-badge">
                    {sessionState.state === 'menu' && '📋 Main Menu'}
                    {sessionState.state === 'category' && '📂 Browsing Subcategory'}
                    {sessionState.state === 'subcategory' && '🏷️ Browsing Products'}
                  </span>
                )}
              </div>
              <button className="menu-btn" onClick={() => sendCatalogMenu(selectedChat)}>
                📋 Send Menu
              </button>
            </div>
            <div className="chat-messages">
              <div ref={messagesEndRef} />
              {[...filteredMessages].reverse().map(msg => (
                <div key={msg.id} className={`message ${msg.direction}`}>
                  <div className="message-bubble">
                    {msg.mediaType === 'image' && msg.mediaUrl && (
                      <img src={msg.mediaUrl} alt="media" className="message-media" />
                    )}
                    {msg.mediaType === 'video' && msg.mediaUrl && (
                      <video src={msg.mediaUrl} controls className="message-media" />
                    )}
                    {msg.mediaType === 'audio' && msg.mediaUrl && (
                      <audio src={msg.mediaUrl} controls className="message-audio" />
                    )}
                    {msg.mediaType === 'document' && msg.mediaUrl && (
                      <a href={msg.mediaUrl} target="_blank" rel="noopener noreferrer" className="message-document">
                        📄 Document
                      </a>
                    )}
                    {msg.message && msg.message !== 'image file' && msg.message !== 'video file' && msg.message !== 'audio file' && msg.message !== 'document file' && <p>{msg.message}</p>}
                    <span className="message-time">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                      {msg.direction === 'outgoing' && (
                        <span className={`tick-mark ${msg.status}`}>
                          {msg.status === 'sent' && '✓'}
                          {msg.status === 'delivered' && '✓✓'}
                          {msg.status === 'read' && '✓✓'}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={(e) => setSelectedFile(e.target.files[0])}
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
              />
              {selectedFile && (
                <div className="file-preview">
                  <span>{selectedFile.name}</span>
                  <button className="remove-file" onClick={() => setSelectedFile(null)}>×</button>
                </div>
              )}
              <div className="input-wrapper">
                <button className="attach-btn" onClick={() => fileInputRef.current?.click()}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                  </svg>
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button className="send-btn" onClick={sendMessage}>Send</button>
              </div>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppChat;
