package com.example.movies.controller;

import com.example.movies.dto.ReviewRequest;
import com.example.movies.model.Review;
import com.example.movies.model.User;
import com.example.movies.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Reviews", description = "Submit movie reviews (requires login)")
@RestController
@RequestMapping("/api/v1/reviews")
public class ReviewController {

    @Autowired
    private ReviewService service;

    @Operation(summary = "Submit a review for a movie",
            security = @SecurityRequirement(name = "bearerAuth"))
    @PostMapping
    public ResponseEntity<Review> createReview(
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal User currentUser) {
        Review review = service.createReview(
                request.reviewBody(),
                request.imdbId(),
                request.rating(),
                currentUser.getName()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(review);
    }
}