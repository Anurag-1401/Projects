// src/pages/Profile.js
import React from 'react';
import { useAuth } from '../context/Authcontext';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/actions/authActions';


const Profile = () => {
    const { user, logout } = useAuth();  // Access user state and logout function

    if (!user) {
        return <div>You are not logged in!</div>;
    }

    return (
        <div>
            <h1>Welcome, {user.name}</h1>
            <p>Email: {user.email}</p>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default Profile;
