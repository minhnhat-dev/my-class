import React, { useContext, useState } from 'react';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function Authentication({ children }) {
  const { currentUser, setCurrentUser } = useState({});
  const { loading, setLoading } = useState(false);

  function login(email, password) {

  }

  function register(email, password) {

  }

  const value = {
    login,
    register,
    currentUser,
  };

  return (
    <>
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    </>
  );
}
