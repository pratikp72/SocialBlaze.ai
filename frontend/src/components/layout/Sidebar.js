import React from 'react';
import { FaPen, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = ({ user, setIsAuthenticated, setShowCreatePost }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="brand-name">SocialBlaze.ai</span>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-item" onClick={() => setShowCreatePost(true)}>
          <FaPen />
          <span>Create Post</span>
        </div>
      </nav>
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">{(user.displayName || user.identifier).charAt(0).toUpperCase()}</div>
          <div className="user-details">
            <span className="name">{user.displayName || user.identifier}</span>
            <span className="handle">@{user.identifier}</span>
          </div>
        </div>
        <button className="btn-logout" onClick={() => setIsAuthenticated(false)}>
          <FaSignOutAlt style={{ marginRight: '8px' }} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
