import React, { useEffect, useState } from 'react';
import { logout_api_call } from '../pages/auth/api/call';
import { useNavigate, Link } from 'react-router-dom';
import { logout, isAuthenticated } from '../helpers';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        if (parsedUser.username) {
          setUsername(parsedUser.username);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, [loggedIn]);

  const handleLogout = () => {
    if (!window.confirm('Are you sure you want to logout?')) return;
    logout();
    navigate('/login');
    setShowDropdown(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 md:px-6 h-18 flex items-center justify-between">

        {/* Brand/Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-xl font-black text-gray-900 tracking-tighter">
            Property<span className="text-blue-600">HUB</span>
          </span>
        </Link>

        {/* Action Section */}
        <div className="relative">
          {loggedIn ? (
            /* Logged In View */
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-gray-100 transition-colors cursor-pointer border border-gray-100"
              >
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  {username ? username.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden md:block text-sm font-semibold text-gray-700">@{username}</span>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <>
                  {/* Backdrop — z-10, dropdown z-20 so backdrop is below it */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowDropdown(false)}
                  />

                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20 animate-in fade-in zoom-in duration-150 origin-top-right">
                    <div className="px-4 py-3 border-b border-gray-50 mb-1">
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Signed in as</p>
                      <p className="text-sm font-bold text-gray-900 truncate max-w-full">{username}</p>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-semibold transition-colors"
                    >
                      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Logged Out View */
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="px-6 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-gray-200"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;