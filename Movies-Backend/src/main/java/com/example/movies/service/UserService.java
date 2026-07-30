package com.example.movies.service;

import com.example.movies.exception.MovieNotFoundException;
import com.example.movies.model.Movie;
import com.example.movies.model.User;
import com.example.movies.repository.MovieRepository;
import com.example.movies.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MovieRepository movieRepository;

    public User addToWatchlist(String email, String imdbId) {
        movieRepository.findMovieByImdbId(imdbId)
                .orElseThrow(() -> new MovieNotFoundException(imdbId));
        User user = findUserByEmail(email);
        if (!user.getWatchlist().contains(imdbId)) {
            user.getWatchlist().add(imdbId);
            userRepository.save(user);
        }
        return user;
    }

    public User removeFromWatchlist(String email, String imdbId) {
        User user = findUserByEmail(email);
        user.getWatchlist().remove(imdbId);
        userRepository.save(user);
        return user;
    }

    public List<Movie> getWatchlist(String email) {
        User user = findUserByEmail(email);
        List<Movie> movies = new ArrayList<>();
        for (String imdbId : user.getWatchlist()) {
            movieRepository.findMovieByImdbId(imdbId).ifPresent(movies::add);
        }
        return movies;
    }

    public User getProfile(String email) {
        return findUserByEmail(email);
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new MovieNotFoundException("User not found: " + email));
    }
}