package com.smartqueue.entity;

import com.smartqueue.enums.QueueType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents a virtual queue (e.g. a temple counter, a bank branch) that users can join.
 */
@Entity
@Table(name = "queues")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Queue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 150)
    private String name;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "queue_type", nullable = false, length = 30)
    private QueueType queueType;

    @Builder.Default
    @Column(name = "current_token_number", nullable = false)
    private Integer currentTokenNumber = 0;

    @Builder.Default
    @Column(name = "average_service_time", nullable = false)
    private Integer averageServiceTime = 5;

    @Builder.Default
    @Column(name = "is_paused", nullable = false)
    private Boolean isPaused = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Builder.Default
    @OneToMany(mappedBy = "queue", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Token> tokens = new ArrayList<>();
}
