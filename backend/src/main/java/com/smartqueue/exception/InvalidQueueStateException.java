package com.smartqueue.exception;

/**
 * Thrown when an operation is attempted against a queue or token in an invalid state
 * (e.g. joining a paused queue, confirming an already-completed token).
 */
public class InvalidQueueStateException extends RuntimeException {
    public InvalidQueueStateException(String message) {
        super(message);
    }
}
