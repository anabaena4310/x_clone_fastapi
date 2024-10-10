import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Post {
  id: number;
  title: string;
  content: string;
  author: {
    username: string;
  };
}

const SNSApp: React.FC = () => {
  // State variables for user registration, login, post creation, and timeline display
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string>('');
  const [token, setToken] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState<boolean>(false); // ユーザー登録済みかどうかの状態

  // ユーザー登録成功時に呼び出す関数
  const handleRegisterSuccess = () => {
    setIsRegistered(true); // 登録が成功したら、isRegisteredをtrueに設定
  };

  // Handle user registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/register/', {
        username: username, // usernameを明示的に指定
        password: password, // passwordを明示的に指定
      });
      console.log('Registration successful:', response.data);
      setError('');
      handleRegisterSuccess(); // 登録成功時の処理を呼び出す
    } catch (err) {
      console.error('Error during registration:', err);
      setError('Registration failed. Please try again.');
    }
  };

  // Handle user login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/login', {
        username,
        password,
      });
      const { token } = response.data;
      localStorage.setItem('token', token); // Save token in localStorage
      setToken(token);
      setError('');
      console.log('Login successful:', response.data);
    } catch (err) {
      console.error('Error during login:', err);
      setError('Login failed. Please check your credentials.');
    }
  };

  // Handle post creation
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('You must be logged in to create a post.');
      return;
    }
    try {
      const userId = 1

      const response = await axios.post(
        'http://localhost:8000/posts',
        {
          title,
          content,
          user_id: userId, // user_idをセット
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Post created successfully:', response.data);
      setError('');
      fetchPosts(); // Refresh the timeline after creating a post
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  // Fetch posts for the timeline
  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/posts');
      setPosts(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts.');
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
    }
    fetchPosts(); // Load posts when the component is mounted
  }, []);

  return (
    <div>
      <h1>Social Media App</h1>

      {/* User Registration */}
      {!token && (
        <div>
          <h2>Sign Up</h2>
          <form onSubmit={handleRegister}>
            <div>
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Sign Up</button>
          </form>
        </div>
      )}

      {/* User Login */}
      {!token && ( // ユーザーがログインしていない場合のみ表示
        <div>
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div>
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Login</button>
          </form>
        </div>
      )}

      {/* Create Post */}
      {(
        <div>
          <h2>Create Post</h2>
          <form onSubmit={handleCreatePost}>
            <div>
              <label>Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Content:</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
            <button type="submit">Create Post</button>
          </form>
        </div>
      )}

      {/* Timeline */}
      <div>
        <h2>Timeline</h2>
        {error && <p>{error}</p>}
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <p>Posted by: {post.id}</p>
            </li>
          ))}
        </ul>
      </div>
      {token && (
        <button onClick={handleLogout}>Logout</button>
      )}
    </div>
  );
};

export default SNSApp;
