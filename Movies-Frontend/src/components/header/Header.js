import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm, faUser } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../auth/AuthModal';

/**
 * Header with:
 *   - CineScope brand name
 *   - Home and Watch List nav links
 *   - Login / Register buttons (when logged out)
 *   - User name + Logout button (when logged in)
 *   - AuthModal for login/register form
 */
const Header = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const [showModal, setShowModal]     = useState(false);
  const [authMode, setAuthMode]       = useState('login'); // 'login' or 'register'

  const openLogin    = () => { setAuthMode('login');    setShowModal(true); };
  const openRegister = () => { setAuthMode('register'); setShowModal(true); };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
        <Container fluid>

          {/* Brand */}
          <Navbar.Brand href="/" style={{ color: 'gold', fontWeight: '600' }}>
            <FontAwesomeIcon icon={faFilm} size="lg" style={{ marginRight: '8px' }} />
            CineScope
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">

            {/* Left nav links */}
            <Nav className="me-auto my-2 my-lg-0" navbarScroll>
              <NavLink className="nav-link" to="/">Home</NavLink>
              <NavLink className="nav-link" to="/watchList">Watch List</NavLink>
            </Nav>

            {/* Right: show user name + logout OR login + register buttons */}
            {isLoggedIn ? (
              <div className="d-flex align-items-center gap-3">
                <span style={{ color: 'gold', fontSize: '14px' }}>
                  <FontAwesomeIcon icon={faUser} style={{ marginRight: '6px' }} />
                  {user.name}
                </span>
                <Button variant="outline-danger" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Button variant="outline-info" onClick={openLogin}>Login</Button>
                <Button variant="outline-info" onClick={openRegister}>Register</Button>
              </div>
            )}

          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Auth modal — controlled by showModal state */}
      <AuthModal
        show={showModal}
        onHide={() => setShowModal(false)}
        initialMode={authMode}
      />
    </>
  );
};

export default Header;