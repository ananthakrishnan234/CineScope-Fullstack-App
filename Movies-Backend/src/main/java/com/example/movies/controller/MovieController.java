package com.example.movies.controller;

import com.example.movies.exception.MovieNotFoundException;
import com.example.movies.model.Movie;
import com.example.movies.service.MovieService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Movies", description = "Browse and search movies")
@RestController
@RequestMapping("/api/v1/movies")
public class MovieController {

    @Autowired
    private MovieService service;

    @Operation(summary = "Get all movies (paginated)")
    @GetMapping
    public ResponseEntity<Page<Movie>> getMovies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "title") String sortBy) {
        return ResponseEntity.ok(service.findAllMovies(page, size, sortBy));
    }

    @Operation(summary = "Get a single movie by IMDB ID")
    @ApiResponse(responseCode = "200", description = "Movie found")
    @ApiResponse(responseCode = "404", description = "Movie not found")
    @GetMapping("/{imdbId}")
    public ResponseEntity<Movie> getSingleMovie(
            @Parameter(description = "IMDB ID e.g. tt1234567")
            @PathVariable String imdbId) {
        Movie movie = service.findMovieByImdbId(imdbId)
                .orElseThrow(() -> new MovieNotFoundException(imdbId));
        return ResponseEntity.ok(movie);
    }

    @Operation(summary = "Search movies by title and/or genre")
    @GetMapping("/search")
    public ResponseEntity<Page<Movie>> searchMovies(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String genre,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(service.searchMovies(title, genre, page, size));
    }

    @Operation(summary = "Get all available genres")
    @GetMapping("/genres")
    public ResponseEntity<List<String>> getAllGenres() {
        return ResponseEntity.ok(service.findAllGenres());
    }
}

