import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm } from '@fortawesome/free-solid-svg-icons';

/**
 * NotFound — shown when the user navigates to a route that doesn't exist.
 * The catch-all route in App.js ( path="*" ) renders this component.
 */
const NotFound = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        backgroundColor: '#0d0d0d',
        color: '#aaa',
        textAlign: 'center',
        padding: '20px',
        gap: '16px',
      }}
    >
      <FontAwesomeIcon icon={faFilm} style={{ fontSize: '4rem', color: '#333' }} />

      <h1 style={{ color: 'gold', fontSize: '5rem', fontWeight: '700', margin: 0 }}>
        404
      </h1>

      <h4 style={{ color: 'white', margin: 0 }}>Page Not Found</h4>

      <p style={{ color: '#888', maxWidth: '340px', fontSize: '14px', margin: 0 }}>
        The page you're looking for doesn't exist or has been moved.
      </p>

      <Link
        to="/"
        style={{
          marginTop: '8px',
          padding: '10px 28px',
          backgroundColor: 'gold',
          color: '#0d0d0d',
          borderRadius: '6px',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '14px',
        }}
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;