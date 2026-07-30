package com.example.movies.repository;

import com.example.movies.model.Movie;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MovieRepository extends MongoRepository<Movie, ObjectId> {

    Optional<Movie> findMovieByImdbId(String imdbId);

    Page<Movie> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    Page<Movie> findByGenresContainingIgnoreCase(String genre, Pageable pageable);

    Page<Movie> findByTitleContainingIgnoreCaseAndGenresContainingIgnoreCase(
            String title, String genre, Pageable pageable);

    Page<Movie> findAll(Pageable pageable);

    List<Movie> findAll();
}