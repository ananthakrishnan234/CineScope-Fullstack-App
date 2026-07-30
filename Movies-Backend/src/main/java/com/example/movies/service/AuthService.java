package com.example.movies.service;

import com.example.movies.dto.AuthResponse;
import com.example.movies.dto.LoginRequest;
import com.example.movies.dto.RegisterRequest;
import com.example.movies.exception.EmailAlreadyExistsException;
import com.example.movies.exception.MovieNotFoundException;
import com.example.movies.model.User;
import com.example.movies.repository.UserRepository;
import com.example.movies.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException(request.email());
        }
        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole("ROLE_USER");
        userRepository.save(user);
        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user.getName(), user.getEmail());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(), request.password()
                )
        );
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new MovieNotFoundException("User not found"));
        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user.getName(), user.getEmail());
    }
}