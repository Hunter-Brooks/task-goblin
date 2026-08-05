package com.taskgoblin.backend;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InboxRepository extends JpaRepository<InboxItem, Long> {
    List<InboxItem> findByProcessedOrderByCreatedAtDesc(Boolean processed);
}
