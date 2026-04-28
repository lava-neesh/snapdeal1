import React, { useState } from "react";
import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      navigate(`/products?search=${search}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <header className="navbar">
      
      {/* LEFT */}
      <div className="nav-left">
        <div className="logo" onClick={() => navigate("/")}>
          <img src="/image/logo.png" alt="Snapdeal" />
        </div>
      </div>

      {/* CENTER SEARCH */}
      <div className="nav-center">
        <input
          type="text"
          placeholder="Search for Brands & Products"
          className="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>

      {/* RIGHT */}
      <div className="nav-right">
        <Link to="/cart">Cart</Link>

        {!email ? (
          <Link to="/login">Login</Link>
        ) : (
          <div className="profile">
            <span onClick={() => setOpen(!open)}>
              👤 My Profile
            </span>

            {open && (
              <div className="dropdown">
                <p onClick={() => navigate("/order")}>
                  📦 My Orders
                </p>

                <p onClick={() => navigate("/user-dashboard")}>
                  👤 Profile
                </p>

                <p onClick={handleLogout}>
                  🚪 Logout
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;