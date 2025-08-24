import React from 'react';
import { useParams } from 'react-router-dom';
import './Trailer.css';

const Trailer = () => {
  const { ytTrailerId } = useParams();

  return (
    <div className="react-player-container">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${ytTrailerId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default Trailer;
