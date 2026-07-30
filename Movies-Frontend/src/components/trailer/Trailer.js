import './Trailer.css';
import ReactPlayer from 'react-player/youtube';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';

/**
 * Trailer player page — /Trailer/:ytTrailerId
 *
 * Fix from original:
 *   - The original passed the full YouTube URL to the player,
 *     which caused it to fail on the first click because the URL
 *     was already parsed before being passed. Now we receive the
 *     raw YouTube video ID from the route param and build the URL here.
 *
 *   - Added a back button so users can return to the previous page.
 *
 *   - ReactPlayer is imported from 'react-player/youtube' (lighter)
 *     instead of 'react-player' (loads all providers).
 */
const Trailer = () => {
  const { ytTrailerId } = useParams();
  const navigate        = useNavigate();

  // Build the full YouTube embed URL from the video ID
  const youtubeUrl = `https://www.youtube.com/watch?v=${ytTrailerId}`;

  return (
    <div className="trailer-page">

      {/* Back button */}
      <div className="trailer-nav">
        <Button variant="link" className="back-btn" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} />
          &nbsp; Back
        </Button>
      </div>

      {/* Video player wrapper — 16:9 aspect ratio */}
      <div className="trailer-player-wrapper">
        <ReactPlayer
          url={youtubeUrl}
          controls={true}
          playing={true}
          width="100%"
          height="100%"
          className="react-player"
        />
      </div>

    </div>
  );
};

export default Trailer;