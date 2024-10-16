import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from './config/api';
import Swal from 'sweetalert2';

export default function UpdateMovie() {
    const { movieId } = useParams(); // Get movieId from URL
    const navigate = useNavigate();

    const [movie, setMovie] = useState({
        title: '',
        director: '',
        year: '',
        genre: '',
        description: ''
    });
    const [loading, setLoading] = useState(true);

    // Fetch the existing movie details when the component loads
    useEffect(() => {
        fetch(`${API_BASE_URL}/movies/getMovie/${movieId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.error
                });
                navigate('/'); // Redirect user if there's an error fetching movie
            } else {
                setMovie({
                    title: data.title,
                    director: data.director,
                    year: data.year,
                    genre: data.genre,
                    description: data.description
                });
                setLoading(false);
            }
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load movie details'
            });
            setLoading(false);
        });
    }, [movieId, navigate]);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setMovie({ ...movie, [name]: value });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`${API_BASE_URL}/movies/updateMovie/${movieId}`, {
            method: 'PATCH', // PATCH for partial update
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(movie)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Movie updated successfully') {
                Swal.fire({
                    icon: 'success',
                    title: 'Movie Updated',
                    text: 'Movie updated successfully!'
                });
                navigate('/movies'); // Redirect to another page after successful update
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.error || 'Failed to update movie'
                });
            }
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update movie'
            });
        });
    };

    if (loading) {
        return <div>Loading movie details...</div>;
    }

    return (
        <div className="container-fluid banner-section">
            <div className="container">
                <div className="update-movie">
                    <h1>Update Movie</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="title">Movie Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                className="form-control"
                                value={movie.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="director">Director</label>
                            <input
                                type="text"
                                id="director"
                                name="director"
                                className="form-control"
                                value={movie.director}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="year">Year</label>
                            <input
                                type="number"
                                id="year"
                                name="year"
                                className="form-control"
                                value={movie.year}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="genre">Genre</label>
                            <input
                                type="text"
                                id="genre"
                                name="genre"
                                className="form-control"
                                value={movie.genre}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                className="form-control"
                                value={movie.description}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        <button type="submit" className="btn btn-primary mt-3">
                            Update Movie
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
