package com.smartqueue.exception;

/**
 * Thrown when a user attempts to join a queue they already have an active token in.
 */
public class DuplicateTokenException extends RuntimeException {
    public DuplicateTokenException(String message) {
        super(message);
    }
}
