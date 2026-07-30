package com.example.movies.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "reviews")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Review {

    @Id
    private ObjectId id;

    private String body;
    private Integer rating;
    private String authorName;
    private LocalDateTime created;
    private LocalDateTime updated;

    public Review(String body, Integer rating, String authorName,
                  LocalDateTime created, LocalDateTime updated) {
        this.body = body;
        this.rating = rating;
        this.authorName = authorName;
        this.created = created;
        this.updated = updated;
    }
}