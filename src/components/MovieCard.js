import { useEffect, useState, useContext } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { API_BASE_URL } from './config/api';
import UserContext from '../context/UserContext';

export default function MovieCard({ movie, onUpdate, onDelete }) {
    const { user } = useContext(UserContext);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/movies/getComments/${movie._id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await res.json();
                setComments(data.comments.reverse());
            } catch (error) {
                console.error('Error fetching comments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [movie._id]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        setError('');

        if (!newComment.trim()) {
            setError('Comment cannot be empty.');
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/movies/addComment/${movie._id}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ comment: newComment })
            });

            const data = await res.json();

            if (res.status !== 200) {
                setError(data.error || 'Failed to add comment.');
            } else {
                setComments([{ comment: newComment }, ...comments]);
                setNewComment('');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            setError('Failed to add comment. Please try again.');
        }
    };



return (
    <Card>
    <Card.Body>
    <Card.Title>{movie.title}</Card.Title>
    <Card.Subtitle className="mb-2 text-muted">Directed by: {movie.director}</Card.Subtitle>
    <Card.Text>
        <strong>Year:</strong> {movie.year} <br />
        <strong>Genre:</strong> {movie.genre} <br />
        <strong>Description:</strong> {movie.description}
    </Card.Text>

    {user.isAdmin && (
        <>
            <Button variant="primary" onClick={() => onUpdate(movie._id)}>Update</Button>
            <Button variant="danger" onClick={() => onDelete(movie._id)}>Delete</Button>
        </>
    )}

    <hr />

    {user.isAdmin  ? 
        <>
            <Form onSubmit={handleAddComment}>
            <Form.Group controlId="newComment">
            <Form.Control
                type="text"
                placeholder="Add Comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
            />
            </Form.Group>
                <Button type="submit" variant="success" className="mt-2">
                    Submit Comment
                </Button>
                {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display any error */}
            </Form>
            <hr />
        </>
    : null }

    <h5>Comments</h5>
    {loading ? (
            <p>Loading comments...</p>
        ) : comments.length > 0 ? (
            comments.map((comment, index) => (
                <div key={index} className="mb-2">
                    --- {comment.comment}
                </div>
            )
        )) : (
            <p>No comments yet. Be the first to comment!</p>
        )
    }
    </Card.Body>
    </Card>
    );
}