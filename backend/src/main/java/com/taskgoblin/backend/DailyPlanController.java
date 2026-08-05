package com.taskgoblin.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/daily-plan")
@CrossOrigin(origins = "${TASK_GOBLIN_CORS_ALLOWED_ORIGIN:http://localhost:5173}")
public class DailyPlanController {
    
    private final DailyPlanRepository dailyPlanRepository;
    private final TaskRepository taskRepository;
    
    public DailyPlanController(DailyPlanRepository dailyPlanRepository, TaskRepository taskRepository) {
        this.dailyPlanRepository = dailyPlanRepository;
        this.taskRepository = taskRepository;
    }
    
    @PostMapping("/start")
    public ResponseEntity<DailyPlan> startDay() {
        LocalDate today = LocalDate.now();
        
        // Check if plan already exists for today
        DailyPlan existingPlan = dailyPlanRepository.findByDate(today).orElse(null);
        
        if (existingPlan != null) {
            if (!existingPlan.isStarted()) {
                existingPlan.setStarted(true);
                dailyPlanRepository.save(existingPlan);
            }
            return ResponseEntity.ok(existingPlan);
        }
        
        // Create new plan for today
        DailyPlan newPlan = new DailyPlan(today);
        newPlan.setStarted(true);
        DailyPlan saved = dailyPlanRepository.save(newPlan);
        
        return ResponseEntity.ok(saved);
    }
    
    @GetMapping("/today")
    public ResponseEntity<DailyPlan> getTodaysPlan() {
        LocalDate today = LocalDate.now();
        DailyPlan plan = dailyPlanRepository.findByDate(today).orElse(null);
        
        if (plan == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(plan);
    }
    
    @GetMapping("/review/previous")
    public ResponseEntity<Map<String, Object>> getPreviousDayReview() {
        LocalDate yesterday = LocalDate.now().minusDays(1);
        
        // Get yesterday's start and end timestamps
        LocalDateTime startOfYesterday = yesterday.atStartOfDay();
        LocalDateTime endOfYesterday = yesterday.atTime(23, 59, 59);
        
        // Convert to Instant for comparison
        var startInstant = startOfYesterday.atZone(ZoneId.systemDefault()).toInstant();
        var endInstant = endOfYesterday.atZone(ZoneId.systemDefault()).toInstant();
        
        // Get all tasks
        List<Task> allTasks = taskRepository.findAll();
        
        // Filter completed tasks from yesterday
        List<Task> completedYesterday = allTasks.stream()
            .filter(t -> t.getCompletedAt() != null)
            .filter(t -> t.getCompletedAt().isAfter(startInstant) && t.getCompletedAt().isBefore(endInstant))
            .toList();
        
        // Get unfinished high priority tasks
        List<Task> unfinishedHighPriority = allTasks.stream()
            .filter(t -> t.getStatus() == TaskStatus.ACTIVE)
            .filter(t -> t.getPriority() == TaskPriority.HIGH)
            .toList();
        
        // Get overdue tasks
        LocalDate today = LocalDate.now();
        List<Task> overdueTasks = allTasks.stream()
            .filter(t -> t.getStatus() == TaskStatus.ACTIVE)
            .filter(t -> t.getDueDate() != null)
            .filter(t -> t.getDueDate().isBefore(today))
            .toList();
        
        // Get yesterday's plan
        DailyPlan yesterdayPlan = dailyPlanRepository.findByDate(yesterday).orElse(null);
        
        Map<String, Object> review = new HashMap<>();
        review.put("date", yesterday);
        review.put("completedTasks", completedYesterday);
        review.put("unfinishedHighPriority", unfinishedHighPriority);
        review.put("overdueTasks", overdueTasks);
        review.put("hadPlan", yesterdayPlan != null);
        review.put("planWasStarted", yesterdayPlan != null && yesterdayPlan.isStarted());
        
        return ResponseEntity.ok(review);
    }
}
