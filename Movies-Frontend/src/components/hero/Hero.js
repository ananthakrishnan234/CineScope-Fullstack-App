import './Hero.css';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import { Paper } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';

const Hero = ({ movies }) => {
  const navigate = useNavigate();

  const reviews = (movieId) => {
    navigate(`/Reviews/${movieId}`);
  };

  return (
    <div className='movie-carousel-container'>
      <Carousel showThumbs={false} infiniteLoop autoPlay>
        {movies?.filter(movie => movie.poster && movie.backdrops?.length).map((movie) => {
          const trailerId = new URLSearchParams(new URL(movie.trailerLink).search).get("v");
          const backdrop = movie.backdrops[0];
          const poster = movie.poster;

          return (
            <div key={movie.imdbId}>
              <Paper>
                <div className='movie-card-container'>
                  <div className="movie-card" style={{ "--img": `url(${backdrop})` }}>
                    <div className="movie-detail">
                      <div className="movie-poster">
                        <img src={poster} alt={movie.title} />
                      </div>
                      <div className="movie-title">
                        <h4>{movie.title}</h4>
                      </div>
                      <div className="movie-buttons-container">
                        {trailerId && (
                          <Link to={`/Trailer/${trailerId}`}>
                            <div className="play-button-icon-container">
                              <FontAwesomeIcon
                                className="play-button-icon"
                                icon={faCirclePlay}
                                size="2x"
                                style={{ marginRight: "8px" }}
                              />
                            </div>
                          </Link>
                        )}
                        <div className="movie-review-button-container">
                          <Button variant="info" onClick={() => reviews(movie.imdbId)}>Reviews</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Paper>
            </div>
          );
        })}
      </Carousel>
    </div>
  );
};

export default Hero;
