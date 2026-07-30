package com.example.movies.service;

import com.example.movies.model.Movie;
import com.example.movies.model.Review;
import com.example.movies.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MovieService {

    @Autowired
    private MovieRepository repository;

    public Page<Movie> findAllMovies(int page, int size, String sortBy) {
        Sort sort = sortBy.equals("averageRating")
                ? Sort.by(Sort.Direction.DESC, "averageRating")
                : Sort.by(Sort.Direction.ASC, "title");
        Pageable pageable = PageRequest.of(page, size, sort);
        return repository.findAll(pageable);
    }

    public Page<Movie> searchMovies(String title, String genre, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "title"));
        boolean hasTitle = title != null && !title.isBlank();
        boolean hasGenre = genre != null && !genre.isBlank();

        if (hasTitle && hasGenre) {
            return repository.findByTitleContainingIgnoreCaseAndGenresContainingIgnoreCase(
                    title, genre, pageable);
        } else if (hasTitle) {
            return repository.findByTitleContainingIgnoreCase(title, pageable);
        } else if (hasGenre) {
            return repository.findByGenresContainingIgnoreCase(genre, pageable);
        } else {
            return repository.findAll(pageable);
        }
    }

    public Optional<Movie> findMovieByImdbId(String imdbId) {
        return repository.findMovieByImdbId(imdbId);
    }

    public List<String> findAllGenres() {
        return repository.findAll()
                .stream()
                .flatMap(movie -> movie.getGenres().stream())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    public void updateAverageRating(Movie movie) {
        if (movie.getReviews() == null || movie.getReviews().isEmpty()) {
            movie.setAverageRating(0.0);
        } else {
            double avg = movie.getReviews()
                    .stream()
                    .filter(r -> r.getRating() != null)
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0.0);
            movie.setAverageRating(Math.round(avg * 10.0) / 10.0);
        }
        repository.save(movie);
    }
}