package com.example.movies.service;

import com.example.movies.exception.MovieNotFoundException;
import com.example.movies.model.Movie;
import com.example.movies.model.Review;
import com.example.movies.repository.MovieRepository;
import com.example.movies.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private MovieService movieService;

    @Autowired
    private MongoTemplate mongoTemplate;

    public Review createReview(String reviewBody, String imdbId,
                               Integer rating, String authorName) {

        Movie movie = movieRepository.findMovieByImdbId(imdbId)
                .orElseThrow(() -> new MovieNotFoundException(imdbId));

        Review review = reviewRepository.insert(
                new Review(reviewBody, rating, authorName,
                        LocalDateTime.now(), LocalDateTime.now())
        );

        mongoTemplate.update(Movie.class)
                .matching(Criteria.where("imdbId").is(imdbId))
                .apply(new Update().push("reviews").value(review))
                .first();

        Movie updatedMovie = movieRepository.findMovieByImdbId(imdbId)
                .orElseThrow(() -> new MovieNotFoundException(imdbId));
        movieService.updateAverageRating(updatedMovie);

        return review;
    }
}