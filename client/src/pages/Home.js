import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import api from "../api/axios";
import SearchModal from "../components/SearchModal";
import ChatWindow from "../components/ChatWindow";
import "./Home.css";

export default function Home() {
  const { user, loading, setUser } = useAuth();
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchRooms = async () => {
      try {
        const res = await api.get("/api/rooms/userrooms");
        setRooms(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRooms();
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const handleLogout = async () => {
    try {
      await api.get("/api/users/logout");
    } catch {}
    finally {
      setUser(null);
      navigate("/login");
    }
  };

  const handleRoomCreated = (room) => {
    setRooms((prev) => {
      const exists = prev.find((r) => r._id === room._id);
      if (exists) return prev;
      return [room, ...prev];
    });
    setSelectedRoom(room);
  };

  return (
    <div id="chat-layout" className="chat-layout">
      {/* ===== SIDEBAR ===== */}
      <div className="sidebar">
        {/* Profile Header */}
        <div className="sidebar-top">
          <div className="profile">
            <div className="avatar">
              {user.fullName?.charAt(0)}
            </div>
            <div>
              <div id="user-name">{user.fullName}</div>
              <div id="user-username">@{user.username}</div>
            </div>
          </div>
        </div>

        {/* New Chat */}
        <button
          id="new-chat-button"
          className="primary-btn"
          onClick={() => setShowSearch(true)}
        >
          + New Chat
        </button>

        {/* Recent Chats */}
        <div className="section-title">RECENT CHATS</div>

        <div id="chat-rooms-list" className="rooms-list">
          {rooms.map((room) => {
            const otherUser = room.users.find(
              (u) => u._id !== user._id
            );

            return (
              <div
  key={room._id}
  id={`room-${room._id}`}
  className={`room-item ${
    selectedRoom?._id === room._id ? "active" : ""
  }`}
  onClick={() => setSelectedRoom(room)}
>
                <div className="avatar small">
                  {otherUser?.fullName?.charAt(0)}
                </div>
                <div className="room-info">
                  <div className="room-name">
                    {otherUser?.fullName}
                  </div>
                  <div className="room-sub">
                    Last seen recently
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Logout */}
        <button
          id="logout-button"
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* ===== CHAT AREA ===== */}
      <div className="chat-area">
        {selectedRoom ? (
          <ChatWindow room={selectedRoom} />
        ) : (
          <div className="empty-chat">
            <div className="empty-card">
              <div className="empty-icon">💬</div>
              <h3>No chat selected</h3>
              <p>
                Select a conversation from the sidebar or start a new chat
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ===== SEARCH MODAL ===== */}
      {showSearch && (
        <SearchModal
          onClose={() => setShowSearch(false)}
          onRoomCreated={handleRoomCreated}
        />
      )}
    </div>
  );
}
