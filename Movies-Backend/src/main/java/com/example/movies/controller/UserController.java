package com.example.movies.controller;

import com.example.movies.model.Movie;
import com.example.movies.model.User;
import com.example.movies.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "Users", description = "Profile and watchlist management (requires login)")
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Operation(summary = "Get current user profile",
            security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getProfile(
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(Map.of(
                "name",      currentUser.getName(),
                "email",     currentUser.getEmail(),
                "watchlist", currentUser.getWatchlist()
        ));
    }

    @Operation(summary = "Get watchlist movies",
            security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/watchlist")
    public ResponseEntity<List<Movie>> getWatchlist(
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(userService.getWatchlist(currentUser.getEmail()));
    }

    @Operation(summary = "Add movie to watchlist",
            security = @SecurityRequirement(name = "bearerAuth"))
    @PostMapping("/watchlist/{imdbId}")
    public ResponseEntity<Map<String, Object>> addToWatchlist(
            @PathVariable String imdbId,
            @AuthenticationPrincipal User currentUser) {
        User updated = userService.addToWatchlist(currentUser.getEmail(), imdbId);
        return ResponseEntity.ok(Map.of(
                "message",   "Added to watchlist",
                "watchlist", updated.getWatchlist()
        ));
    }

    @Operation(summary = "Remove movie from watchlist",
            security = @SecurityRequirement(name = "bearerAuth"))
    @DeleteMapping("/watchlist/{imdbId}")
    public ResponseEntity<Map<String, Object>> removeFromWatchlist(
            @PathVariable String imdbId,
            @AuthenticationPrincipal User currentUser) {
        User updated = userService.removeFromWatchlist(currentUser.getEmail(), imdbId);
        return ResponseEntity.ok(Map.of(
                "message",   "Removed from watchlist",
                "watchlist", updated.getWatchlist()
        ));
    }
}