import { useEffect, useState } from "react";
import api from "../api/axios";

export default function SearchModal({ onClose, onRoomCreated }) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!search) {
      setResults([]);
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await api.get(
          `/api/users/search?searchTerm=${search}`
        );
        setResults(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, [search]);

  const handleUserClick = async (userId) => {
    try {
      const res = await api.post("/api/rooms/init", {
        otheruser: userId,
      });

      onRoomCreated(res.data.data);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ background: "#fff", padding: "20px", width: "300px" }}>
        <button id="close-search" onClick={onClose}>
          Close
        </button>

        <input
          id="search-input"
          type="text"
          placeholder="Search users"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div>
          {results.map((user) => (
            <div
              key={user._id}
              id={`user-result-${user._id}`}
              style={{ cursor: "pointer", padding: "5px 0" }}
              onClick={() => handleUserClick(user._id)}
            >
              {user.fullName} (@{user.username})
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
