import { useEffect, useState, useContext } from 'react';
import MovieCard from '../components/MovieCard'; // Import the updated MovieCard component
import { Row, Col, Form, Button, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';

export default function Movie() {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [movies, setMovies] = useState([]);
    const [title, setTitle] = useState('');
    const [director, setDirector] = useState('');
    const [year, setYear] = useState('');
    const [description, setDescription] = useState('');
    const [genre, setGenre] = useState('');
    const [error, setError] = useState('');

    // Fetch movies
    const fetchMovies = () => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/getMovies`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => {
            if (!res.ok) throw new Error('Failed to fetch movies');
            return res.json();
        })
        .then(data => {
            setMovies(data.movies || []);
            setError('');
        })
        .catch(err => setError(err.message));
    };

    useEffect(() => {
        if (user) {
            fetchMovies();
        }
    }, [user]);

    // Handle movie addition
    const handleAddMovie = () => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/addMovie`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ title, director, year, description, genre })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Failed to add movie");
            }
            return res.json();
        })
        .then(newMovie => {
            setMovies(prev => [...prev, newMovie]);
            setTitle('');
            setDirector('');
            setYear('');
            setDescription('');
            setGenre('');
            setError('');
        })
        .catch(err => setError(err.message));
    };

    // Handle movie deletion
    const handleDeleteMovie = (id) => {
        setMovies((prevMovies) => prevMovies.filter(movie => movie._id !== id));

        fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/deleteMovie/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => {
            if (!res.ok) throw new Error('Failed to delete movie');
            return res.json();
        })
        .catch(err => setError(err.message));
    };

    const handleUpdate = (id) => {
        navigate(`/update-movie/${id}`);
    }

    return (
        <Container fluid className="banner-section">
            <Container>
                {user ? (
                    <>
                    <Row className="mt-3">
                        <div className="col-md-12 d-flex justify-content-between align-items-center">
                            <h1>Movie Catalog</h1>
                        </div>
                    </Row>
                    <Row>
                        <Col md={12} className="mb-4">
                            <Form.Group controlId="addMovie">
                                <Form.Label>Add New Movie</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Movie Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <Form.Control
                                    type="text"
                                    placeholder="Director"
                                    value={director}
                                    onChange={(e) => setDirector(e.target.value)}
                                />
                                <Form.Control
                                    type="number"
                                    placeholder="Year"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                />
                                <Form.Control
                                    type="text"
                                    placeholder="Genre"
                                    value={genre}
                                    onChange={(e) => setGenre(e.target.value)}
                                />
                                <Form.Control
                                    as="textarea"
                                    placeholder="Description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                <Button variant="primary" onClick={handleAddMovie} className="mt-2">
                                    Add Movie
                                </Button>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        {movies.length > 0 ? (
                            movies.map(movie => (
                                <Col md={4} key={movie._id} className="mb-4">
                                    <MovieCard 
                                        movie={movie} 
                                        onUpdate={handleUpdate}
                                        onDelete={handleDeleteMovie}
                                    />
                                </Col>
                            ))
                        ) : (
                            <Col md={12}>
                                <h4>{error || 'No movies available'}</h4>
                            </Col>
                        )}
                    </Row>
                    </>
                ) : (
                    <>
                    <h1>You are not logged in</h1>
                    <Link className="btn btn-primary" to={"/login"}>Login to View</Link>
                    </>
                )}
            </Container>
        </Container>
    );
}
