package com.smartqueue.exception;

/**
 * Thrown when a requested entity (User, Queue, Token) cannot be found.
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
