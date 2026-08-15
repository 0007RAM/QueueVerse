package com.smartqueue.enums;

/**
 * Lifecycle states of a Token from creation to closure.
 *
 * WAITING   -> token joined the queue, waiting for its turn
 * CALLED    -> admin called this token, user must confirm within the timeout window
 * CONFIRMED -> user confirmed presence after being called
 * COMPLETED -> service was completed for this token
 * EXPIRED   -> user failed to confirm within the timeout window
 * SKIPPED   -> admin manually skipped this token
 */
public enum TokenStatus {
    WAITING,
    CALLED,
    CONFIRMED,
    COMPLETED,
    EXPIRED,
    SKIPPED
}
