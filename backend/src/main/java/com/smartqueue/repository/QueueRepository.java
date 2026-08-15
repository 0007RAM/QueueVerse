package com.smartqueue.repository;

import com.smartqueue.entity.Queue;
import com.smartqueue.enums.QueueType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QueueRepository extends JpaRepository<Queue, Long> {

    List<Queue> findByQueueType(QueueType queueType);

    List<Queue> findByIsPaused(Boolean isPaused);
}
