import React, { useEffect, useState } from "react";
import axios from "axios";
import "./manageusers.css";

function ManageUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://snapdeal-backend-x00d.onrender.com/api/user/all-users");
      setUsers(res.data);
    } catch (err) {
      console.log("Error fetching users:", err);
    }
  };

  return (
    <div className="users-container">
      <h2>Manage Users</h2>

      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Verified</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user._id.slice(-5)}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  {user.isVerified ? "✅ Verified" : "❌ Not Verified"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ManageUsers;