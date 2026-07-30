package com.example.movies.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ReviewRequest(

        @NotBlank(message = "Review body cannot be empty")
        @Size(min = 5, max = 1000, message = "Review must be between 5 and 1000 characters")
        String reviewBody,

        @NotBlank(message = "Movie ID is required")
        String imdbId,

        @NotNull(message = "Rating is required")
        @Min(value = 1, message = "Rating must be at least 1 star")
        @Max(value = 5, message = "Rating cannot exceed 5 stars")
        Integer rating

) {}