package com.backend.it_service.exceptions;

public class MentorNotAvailableException extends RuntimeException {
    public MentorNotAvailableException(String message) {
        super(message);
    }
}