import React from 'react';

const ChatHeader = ({ totalMessages }) => (
  <header className="chat-header">
    <div>
      <h1>SQLite Web Chat</h1>
      <p>Express + React single-page чат с хранением истории</p>
    </div>
    <span className="chat-counter">
      {totalMessages} {totalMessages === 1 ? 'сообщение' : 'сообщений'}
    </span>
  </header>
);

export default ChatHeader;

