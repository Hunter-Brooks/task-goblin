package com.taskgoblin.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DailyPlanTaskRepository extends JpaRepository<DailyPlanTask, Long> {
    List<DailyPlanTask> findByDailyPlanIdOrderByPosition(Long dailyPlanId);
    void deleteByDailyPlanId(Long dailyPlanId);
}
