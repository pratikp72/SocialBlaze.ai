import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [user, setUser] = useState(null);
  const [loginData, setLoginData] = useState({
    identifier: '',
    password: ''
  });
  const [postText, setPostText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post(`${API_BASE_URL}/bluesky/login`, loginData);
      setIsAuthenticated(true);
      setUser(response.data.user);
      setMessage({ type: 'success', text: response.data.message });
      setLoginData({ identifier: '', password: '' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Login failed. Please check your credentials.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage({ 
          type: 'error', 
          text: 'Please select a valid image file.' 
        });
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ 
          type: 'error', 
          text: 'Image size must be less than 5MB.' 
        });
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handlePost = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('text', postText);
      formData.append('identifier', user?.identifier);
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const response = await axios.post(`${API_BASE_URL}/bluesky/post`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setMessage({ type: 'success', text: response.data.message });
      setPostText('');
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to post. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <header>
          <div className="logo">SB</div>
          <h1>SocialBlaze</h1>
          <p>Connect and share on Bluesky</p>
        </header>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {!isAuthenticated ? (
          <div className="card">
            <h2>Sign In to Bluesky</h2>
            <p className="info">
              Authenticate using your Bluesky handle and App Password to get started.
              <br />
              <small>
                Need an App Password? Go to Settings → App Passwords in your Bluesky account
              </small>
            </p>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="identifier">Bluesky Handle</label>
                <input
                  type="text"
                  id="identifier"
                  placeholder="yourhandle.bsky.social"
                  value={loginData.identifier}
                  onChange={(e) => setLoginData({ ...loginData, identifier: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">App Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your app password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? (
                  <>
                    <span style={{ marginRight: '8px' }}>⏳</span>
                    Connecting...
                  </>
                ) : (
                  'Connect to Bluesky'
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="card">
            <div className="header-row">
              <h2>Create Post</h2>
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setIsAuthenticated(false);
                  setUser(null);
                  setPostText('');
                  setSelectedImage(null);
                  setImagePreview(null);
                }}
              >
                Sign Out
              </button>
            </div>
            {user && (
              <div className="user-info">
                <div className="user-avatar">
                  {(user.displayName || user.identifier).charAt(0).toUpperCase()}
                </div>
                <span>Logged in as <strong>{user.displayName || user.identifier}</strong></span>
              </div>
            )}
            <form onSubmit={handlePost}>
              <div className="form-group">
                <label htmlFor="postText">What would you like to share?</label>
                <textarea
                  id="postText"
                  rows="6"
                  placeholder="Share your thoughts, ideas, or updates with the Bluesky community..."
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  maxLength={300}
                  required
                />
                <div className={`char-count ${postText.length > 280 ? 'warning' : ''} ${postText.length >= 300 ? 'danger' : ''}`}>
                  {postText.length}/300 characters
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="imageUpload">Add Media</label>
                {!imagePreview ? (
                  <div className="image-upload-area">
                    <input
                      type="file"
                      id="imageUpload"
                      accept="image/*"
                      onChange={handleImageSelect}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="imageUpload" className="image-upload-label">
                      <span className="upload-icon">📸</span>
                      <span>Add an image to your post</span>
                      <small>Supports JPEG, PNG, GIF, WebP • Max 5MB</small>
                    </label>
                  </div>
                ) : (
                  <div className="image-preview-container">
                    <img src={imagePreview} alt="Preview" className="image-preview" />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="btn-remove-image"
                      title="Remove image"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <button type="submit" disabled={loading || !postText.trim()} className="btn btn-primary">
                {loading ? (
                  <>
                    <span style={{ marginRight: '8px' }}>📤</span>
                    Publishing...
                  </>
                ) : (
                  <>
                    <span style={{ marginRight: '8px' }}>🚀</span>
                    Publish to Bluesky
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        <footer>
          <p>Built with Bluesky API • <a href="https://bsky.app" target="_blank" rel="noopener noreferrer">Bluesky</a></p>
        </footer>
      </div>
    </div>
  );
}

export default App;

