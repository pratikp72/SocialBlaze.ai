import React from 'react';
import { FaTimes, FaImage, FaRegComment, FaRetweet, FaRegHeart } from 'react-icons/fa';
import { SiBluesky } from 'react-icons/si';

const CreatePostModal = ({
  showCreatePost,
  setShowCreatePost,
  activeTab,
  setActiveTab,
  selectedPlatforms,
  togglePlatform,
  postText,
  setPostText,
  handleImageSelect,
  imagePreview,
  handleRemoveImage,
  handlePost,
  loading,
  user
}) => {
  if (!showCreatePost) return null;

  return (
    <div className="modal-overlay">
      <div className="create-post-modal">
        <div className="modal-header">
          <div className="tabs">
            <button className={`tab ${activeTab === 'create-post' ? 'active' : ''}`} onClick={() => setActiveTab('create-post')}>Create Post</button>
          </div>
          <div className="modal-actions">
            <button className="btn-close" onClick={() => setShowCreatePost(false)}>
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="modal-body">
          <div className="post-creation-area">
            <div className="platform-selector">
              <label>Post to:</label>
              <div className="platforms">
                {['bluesky'].map(p => (
                  <button 
                    key={p} 
                    className={`platform-btn ${selectedPlatforms.includes(p) ? 'selected' : ''}`}
                    onClick={() => togglePlatform(p)}
                    title={p}
                  >
                    <SiBluesky style={{ color: '#3b82f6' }} />
                  </button>
                ))}
              </div>
            </div>

            <div className="editor-area">
              <div className="editor-scroll-container">
                <textarea
                  placeholder="What would you like to share?"
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  maxLength={300}
                />
                {imagePreview && (
                  <div className="editor-image-preview">
                    <img src={imagePreview} alt="Preview" />
                    <button onClick={handleRemoveImage} className="remove-image-btn">
                      <FaTimes />
                    </button>
                  </div>
                )}
              </div>
              <div className="editor-tools">
                <div className="tool-icons">
                  <button onClick={() => document.getElementById('modalImageUpload').click()} title="Add Image">
                    <FaImage />
                  </button>
                </div>
                <span className={`char-count ${postText.length > 280 ? 'warning' : ''}`}>
                  {postText.length}/300
                </span>
              </div>
            </div>

            {!imagePreview && (
              <div className="media-upload-section" onClick={() => document.getElementById('modalImageUpload').click()}>
                <input
                  type="file"
                  id="modalImageUpload"
                  accept="image/*"
                  onChange={handleImageSelect}
                  style={{ display: 'none' }}
                />
                <span className="icon"><FaImage style={{ fontSize: '2rem', color: '#94a3b8' }} /></span>
                <span>Click to upload image</span>
              </div>
            )}

            <div className="post-actions-footer">
              <div className="left-actions">
              </div>
              <div className="right-actions">
                <button className="btn-primary" onClick={handlePost} disabled={loading || !postText.trim()}>
                  {loading ? 'Publishing...' : 'Add To Queue'}
                </button>
              </div>
            </div>
          </div>

          <div className="preview-area">
            <div className="preview-header">
              <span>Post Preview</span>
              <div className="preview-tabs">
                <button className="active">Preview</button>
                <button>Comments</button>
              </div>
            </div>
            
            <div className="preview-card">
              <div className="preview-user">
                <div className="avatar-small">{(user.displayName || user.identifier).charAt(0).toUpperCase()}</div>
                <div className="user-meta">
                  <span className="name">{user.displayName || 'User Name'}</span>
                  <span className="handle">@{user.identifier}</span>
                </div>
                <span className="platform-icon"><SiBluesky style={{ color: '#3b82f6' }} /></span>
              </div>
              <div className="preview-content">
                <p>{postText || "Your post content will appear here..."}</p>
                {imagePreview && (
                  <div className="preview-image">
                    <img src={imagePreview} alt="Post content" />
                  </div>
                )}
              </div>
              <div className="preview-footer">
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FaRegComment /> 0</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FaRetweet /> 0</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FaRegHeart /> 0</span>
              </div>
            </div>
            
            <div className="preview-note">
              <p>Preview approximates how your content will display when published.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
