import { useState } from 'react';
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

/**
 * AuthModal — a single modal that handles both Login and Register.
 *
 * Props:
 *   show         — boolean, controls visibility
 *   onHide       — function to close the modal
 *   initialMode  — 'login' or 'register' (set when button is clicked in Header)
 *
 * The user can switch between Login and Register with a link at the bottom.
 */
const AuthModal = ({ show, onHide, initialMode = 'login' }) => {
  const { login, register }       = useAuth();
  const [mode, setMode]           = useState(initialMode);
  const [formData, setFormData]   = useState({ name: '', email: '', password: '' });
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);

  // Reset form when modal closes or mode changes
  const resetForm = () => {
    setFormData({ name: '', email: '', password: '' });
    setError('');
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onHide();
  };

  const switchMode = (newMode) => {
    resetForm();
    setMode(newMode);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
      handleClose();
    } catch (err) {
      // Show the error message from the backend (e.g. "Invalid email or password")
      const message = err.response?.data?.message || 'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered data-bs-theme="dark">
      <Modal.Header closeButton style={{ borderColor: '#333' }}>
        <Modal.Title style={{ color: 'gold' }}>
          {mode === 'login' ? 'Login to CineScope' : 'Create an Account'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ backgroundColor: '#1a1a1a' }}>
        {error && (
          <Alert variant="danger" className="py-2" style={{ fontSize: '14px' }}>
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>

          {/* Name field — only shown for Register */}
          {mode === 'register' && (
            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#ccc' }}>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ backgroundColor: '#2a2a2a', color: 'white', borderColor: '#444' }}
              />
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label style={{ color: '#ccc' }}>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ backgroundColor: '#2a2a2a', color: 'white', borderColor: '#444' }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ color: '#ccc' }}>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder={mode === 'register' ? 'Minimum 6 characters' : 'Your password'}
              value={formData.password}
              onChange={handleChange}
              required
              style={{ backgroundColor: '#2a2a2a', color: 'white', borderColor: '#444' }}
            />
          </Form.Group>

          <Button
            type="submit"
            variant="warning"
            className="w-100 mt-2"
            disabled={loading}
          >
            {loading
              ? <><Spinner size="sm" className="me-2" />Please wait...</>
              : mode === 'login' ? 'Login' : 'Create Account'
            }
          </Button>
        </Form>

        {/* Switch mode link */}
        <div className="text-center mt-3" style={{ fontSize: '14px', color: '#aaa' }}>
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <span
                role="button"
                onClick={() => switchMode('register')}
                style={{ color: 'gold', cursor: 'pointer' }}
              >
                Register here
              </span>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <span
                role="button"
                onClick={() => switchMode('login')}
                style={{ color: 'gold', cursor: 'pointer' }}
              >
                Login here
              </span>
            </>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AuthModal;