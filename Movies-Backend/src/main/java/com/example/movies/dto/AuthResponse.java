package com.example.movies.dto;

public record AuthResponse(
        String token,
        String name,
        String email
) {}