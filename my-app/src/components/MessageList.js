import React from 'react';

const MessageList = ({ messages, loading, error, onDelete }) => {
  if (loading) {
    return <div className="chat-status">Загрузка истории...</div>;
  }

  if (error) {
    return <div className="chat-status chat-status-error">{error}</div>;
  }

  if (!messages.length) {
    return <div className="chat-status">Пока нет сообщений — начните переписку!</div>;
  }

  return (
    <ul className="message-list">
      {messages.map((message) => (
        <li key={message.id} className="message-item">
          <div className="message-meta">
            <span className="message-author">{message.username}</span>
            <time className="message-time">
              {new Date(message.timestamp).toLocaleString()}
            </time>
          </div>
          <p className="message-text">{message.text}</p>
          <button
            className="ghost-button"
            type="button"
            onClick={() => onDelete(message.id)}
          >
            Удалить
          </button>
        </li>
      ))}
    </ul>
  );
};

export default MessageList;

