import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeIcons } from '../components/organisms/HomeIcons';
import { FormRegister } from '../components/organisms/FormRegister';

export const HomePage = () => {
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleIconClick = (type) => {
    if (type === 'history') {
      navigate('/history');
    } else if (user) {
      navigate('/tarot');
    } else {
      setShowForm(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full relative gap-4">
      {user && (
        <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
          <p className="text-sm text-[#6A4A4A] font-[monserrat]">✨ Hola, {user.username}</p>
          <button
            onClick={handleLogout}
            className="text-xs uppercase tracking-wide text-red-600 hover:text-red-800 font-semibold"
          >
            Cerrar sesión
          </button>
        </div>
      )}
      <div className="relative flex flex-col items-center">
        <HomeIcons onIconClick={handleIconClick} />
        {showForm && (
          <div className="absolute inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/20" onClick={() => setShowForm(false)}></div>
            <div className="relative z-10">
              <FormRegister />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
