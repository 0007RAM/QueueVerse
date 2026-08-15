package com.smartqueue.util;

import com.smartqueue.enums.QueueType;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * Generates human-friendly token numbers such as "TMP-001", "BNK-014".
 */
@Component
public class TokenNumberGenerator {

    private static final Map<QueueType, String> PREFIXES = Map.of(
            QueueType.TEMPLE, "TMP",
            QueueType.BANK, "BNK",
            QueueType.HOSPITAL, "HSP",
            QueueType.RESTAURANT, "RST",
            QueueType.GOVERNMENT_OFFICE, "GOV"
    );

    /**
     * @param queueType the type of the queue the token belongs to
     * @param sequence  the running sequence number for that queue (1-based)
     * @return a formatted token number, e.g. TMP-001
     */
    public String generate(QueueType queueType, int sequence) {
        String prefix = PREFIXES.getOrDefault(queueType, "GEN");
        return String.format("%s-%03d", prefix, sequence);
    }
}
