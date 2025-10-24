import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/WhatsAppChat.scss';

const WhatsAppChat = () => {
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [chats, setChats] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:4062/whatsapp/messages');
      setMessages(response.data);
      
      const uniqueChats = {};
      response.data.forEach(msg => {
        if (!uniqueChats[msg.from]) {
          uniqueChats[msg.from] = {
            phone: msg.from,
            lastMessage: msg.message,
            lastTime: msg.createdAt
          };
        }
      });
      setChats(Object.values(uniqueChats));
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !selectedChat) return;

    try {
      await axios.post('http://localhost:4062/whatsapp/send-message', {
        to: selectedChat,
        message: messageText
      });
      setMessageText('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
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
            className={`chat-item ${selectedChat === chat.phone ? 'active' : ''}`}
            onClick={() => setSelectedChat(chat.phone)}
          >
            <div className="chat-avatar">{chat.phone.slice(-4)}</div>
            <div className="chat-info">
              <div className="chat-phone">{chat.phone}</div>
              <div className="chat-last-msg">{chat.lastMessage}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-main">
        {selectedChat ? (
          <>
            <div className="chat-header">
              <h3>{selectedChat}</h3>
            </div>
            <div className="chat-messages">
              {filteredMessages.map(msg => (
                <div key={msg.id} className={`message ${msg.direction}`}>
                  <div className="message-bubble">
                    <p>{msg.message}</p>
                    <span className="message-time">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="chat-input">
              <input
                type="text"
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button onClick={sendMessage}>Send</button>
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
