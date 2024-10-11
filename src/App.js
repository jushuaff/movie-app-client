import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { jwtDecode } from 'jwt-decode';  // Update the import here

import AppNavbar from './components/AppNavbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Movie from './pages/Movie';
import UpdateMovie from './pages/UpdateMovie';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
import Error from './pages/Error';

function App() {
    const [user, setUser] = useState({
        email: null,
        isAdmin: null
    });

    const unsetUser = () => {
        localStorage.clear();
        setUser({
            email: null,
            isAdmin: null
        });
    };

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            setUser({
                email: decodedToken.email,
                isAdmin: decodedToken.isAdmin
            });
        } else {
            setUser({
                email: null,
                isAdmin: null,
            });
        }
    }, [token]);

    useEffect(() => {
        console.log(user);
        console.log(localStorage);
    }, [user]);

    return (
        <UserProvider value={{ user, setUser, unsetUser }}>
            <Router class="shadow-sm">
                <AppNavbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/movies" element={<Movie />} />
                    <Route path="/register" element={<Register />} />
                    {!token ? 
                        <Route path="/login" element={<Login />} />
                    : null}
                    {token ? 
                        <Route path="/update-movie/:movieId" element={<UpdateMovie />} />
                    : null}
                    <Route path="/logout" element={<Logout />} />
                    <Route path="*" element={<Error />} />
                </Routes>
                <Footer />
            </Router>
        </UserProvider>
    );
}

export default App;
