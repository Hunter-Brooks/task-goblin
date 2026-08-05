package com.taskgoblin.backend;

import jakarta.persistence.*;

@Entity
@Table(name = "daily_plan_tasks", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"daily_plan_id", "position"})
})
public class DailyPlanTask {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "daily_plan_id", nullable = false)
    private Long dailyPlanId;
    
    @Column(name = "task_id", nullable = false)
    private Long taskId;
    
    @Column(nullable = false)
    private int position; // 1, 2, or 3
    
    public DailyPlanTask() {
    }
    
    public DailyPlanTask(Long dailyPlanId, Long taskId, int position) {
        this.dailyPlanId = dailyPlanId;
        this.taskId = taskId;
        this.position = position;
    }
    
    // Getters and Setters
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getDailyPlanId() {
        return dailyPlanId;
    }
    
    public void setDailyPlanId(Long dailyPlanId) {
        this.dailyPlanId = dailyPlanId;
    }
    
    public Long getTaskId() {
        return taskId;
    }
    
    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }
    
    public int getPosition() {
        return position;
    }
    
    public void setPosition(int position) {
        this.position = position;
    }
}
