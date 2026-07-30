package com.example.movies.exception;

public class MovieNotFoundException extends RuntimeException {
    public MovieNotFoundException(String imdbId) {
        super("Movie not found with IMDB ID: " + imdbId);
    }
}