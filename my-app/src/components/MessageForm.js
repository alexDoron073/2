import React from 'react';

const MessageForm = ({
  username,
  text,
  onUsernameChange,
  onTextChange,
  onSubmit,
  pending,
}) => (
  <form className="message-form" onSubmit={onSubmit}>
    <input
      className="form-input"
      type="text"
      name="username"
      placeholder="Имя"
      value={username}
      onChange={(e) => onUsernameChange(e.target.value)}
      required
    />
    <textarea
      className="form-input"
      name="text"
      placeholder="Сообщение"
      value={text}
      onChange={(e) => onTextChange(e.target.value)}
      required
      rows={2}
    />
    <button className="primary-button" type="submit" disabled={pending}>
      {pending ? 'Отправка...' : 'Отправить'}
    </button>
  </form>
);

export default MessageForm;

