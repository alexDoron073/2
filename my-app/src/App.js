import { useCallback, useEffect, useState } from 'react';
import './App.css';
import ChatHeader from './components/ChatHeader';
import MessageForm from './components/MessageForm';
import MessageList from './components/MessageList';

const API_URL = '/api/messages';

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [text, setText] = useState('');
  const [pending, setPending] = useState(false);

  const fetchMessages = useCallback(async () => {
    try {
      setError('');
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Не удалось загрузить сообщения');
      }
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username.trim() || !text.trim()) return;
    setPending(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          text: text.trim(),
        }),
      });
      if (!response.ok) {
        throw new Error('Не удалось отправить сообщение');
      }
      await fetchMessages();
      setText('');
    } catch (err) {
      setError(err.message);
    } finally {
      setPending(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Удаление не удалось');
      }
      setMessages((prev) => prev.filter((message) => message.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="chat-app">
      <ChatHeader totalMessages={messages.length} />
      <main className="chat-body">
        <MessageList
          messages={messages}
          loading={loading}
          error={error}
          onDelete={handleDelete}
        />
      </main>
      <MessageForm
        username={username}
        text={text}
        onUsernameChange={setUsername}
        onTextChange={setText}
        onSubmit={handleSubmit}
        pending={pending}
      />
    </div>
  );
}

export default App;
