import Hero from '../hero/Hero';

const Home = ({ movies }) => {
  console.log("Movies in Home:", movies); // Optional log
  return (
    <Hero movies={movies} />
  );
};

export default Home;

