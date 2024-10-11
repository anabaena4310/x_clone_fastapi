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
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string>('');
  const [token, setToken] = useState<string | null>(null);
  const [showLoginForm, setShowLoginForm] = useState<boolean>(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/register/', {
        username: username,
        password: password,
      });
      console.log('Registration successful:', response.data);
      setError('');
    } catch (err) {
      console.error('Error during registration:', err);
      setError('Registration failed. Please try again.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/login', {
        username,
        password,
      });
      const { token } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setError('');
      console.log('Login successful:', response.data);
    } catch (err) {
      console.error('Error during login:', err);
      setError('Login failed. Please check your credentials.');
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('You must be logged in to create a post.');
      return;
    }
    try {
      const userId = 1;
      const response = await axios.post(
        'http://localhost:8000/posts',
        {
          title,
          content,
          user_id: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Post created successfully:', response.data);
      setError('');
      fetchPosts();
      setContent('');
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

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
    fetchPosts();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white p-4 flex flex-col">
        <svg className="w-8 h-8 text-blue-400 mb-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
        </svg>
        <nav className="space-y-4">
          <a href="#" className="flex items-center space-x-2 text-gray-700 hover:text-blue-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Home</span>
          </a>
          <a href="#" className="flex items-center space-x-2 text-gray-700 hover:text-blue-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Explore</span>
          </a>
          <a href="#" className="flex items-center space-x-2 text-gray-700 hover:text-blue-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span>Notifications</span>
          </a>
          <a href="#" className="flex items-center space-x-2 text-gray-700 hover:text-blue-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>Messages</span>
          </a>
        </nav>
        {token && (
          <button onClick={handleLogout} className="mt-auto bg-red-500 text-white rounded-full py-2 px-4 hover:bg-red-600 transition duration-200">
            Logout
          </button>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 border-x border-gray-200">
        <header className="bg-white p-4 sticky top-0 z-10 border-b border-gray-200">
          <h1 className="text-xl font-bold">Home</h1>
        </header>

        <main className="bg-white">
          {/* Create Post */}
          {token && (
            <div className="border-b border-gray-200 p-4">
              <form onSubmit={handleCreatePost} className="space-y-4">
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What's happening?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
                <button type="submit" className="bg-blue-500 text-white rounded-full py-2 px-4 hover:bg-blue-600 transition duration-200">
                  Post
                </button>
              </form>
            </div>
          )}

          {/* Timeline */}
          <div className="divide-y divide-gray-200">
            {error && <p className="text-red-500 p-4">{error}</p>}
            {posts.map((post) => (
              <div key={post.id} className="p-4 hover:bg-gray-50">
                <h3 className="font-bold">{post.id}</h3>
                <p className="mt-2">{post.content}</p>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Right sidebar */}
      <div className="w-80 p-4 space-y-4">
        {!token && (
          <div className="bg-white rounded-lg shadow p-4">
            {!showLoginForm ? (
              <div>
                <h2 className="text-xl font-bold mb-4">New to X?</h2>
                <button onClick={() => setShowLoginForm(true)} className="w-full bg-blue-500 text-white rounded-full py-2 px-4 hover:bg-blue-600 transition duration-200">
                  Sign up
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="submit" className="w-full bg-blue-500 text-white rounded-full py-2 px-4 hover:bg-blue-600 transition duration-200">
                  Sign up
                </button>
              </form>
            )}
          </div>
        )}
        {!token && (
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-bold mb-4">Already have an account?</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit" className="w-full bg-blue-500 text-white rounded-full py-2 px-4 hover:bg-blue-600 transition duration-200">
                Log in
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default SNSApp;