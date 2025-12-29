import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import Login from './components/auth/Login';
import Sidebar from './components/layout/Sidebar';
import CreatePostModal from './components/posts/CreatePostModal';

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
  
  // UI State
  const [activeTab, setActiveTab] = useState('create-post');
  const [selectedPlatforms, setSelectedPlatforms] = useState(['bluesky']);
  const [showCreatePost, setShowCreatePost] = useState(true);

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
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select a valid image file.' });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size must be less than 5MB.' });
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
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
        headers: { 'Content-Type': 'multipart/form-data' }
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

  const togglePlatform = (platform) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  if (!isAuthenticated) {
    return (
      <Login 
        loginData={loginData}
        setLoginData={setLoginData}
        handleLogin={handleLogin}
        loading={loading}
        message={message}
      />
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar 
        user={user}
        setIsAuthenticated={setIsAuthenticated}
        setShowCreatePost={setShowCreatePost}
      />

      {/* Main Content */}
      <main className="main-content">
        <header className="top-bar">
          <h2>Posts</h2>
          <div className="top-actions">
          </div>
        </header>
        
        <div className="content-placeholder">
          <h3>Welcome back, {user.displayName || user.identifier}</h3>
          <p>Manage your social media presence from one place.</p>
        </div>

        {/* Create Post Modal */}
        <CreatePostModal 
          showCreatePost={showCreatePost}
          setShowCreatePost={setShowCreatePost}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedPlatforms={selectedPlatforms}
          togglePlatform={togglePlatform}
          postText={postText}
          setPostText={setPostText}
          handleImageSelect={handleImageSelect}
          imagePreview={imagePreview}
          handleRemoveImage={handleRemoveImage}
          handlePost={handlePost}
          loading={loading}
          user={user}
        />
      </main>
    </div>
  );
}

export default App;

