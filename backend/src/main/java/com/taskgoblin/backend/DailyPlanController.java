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
    private final DailyPlanTaskRepository dailyPlanTaskRepository;
    
    public DailyPlanController(DailyPlanRepository dailyPlanRepository, TaskRepository taskRepository, DailyPlanTaskRepository dailyPlanTaskRepository) {
        this.dailyPlanRepository = dailyPlanRepository;
        this.taskRepository = taskRepository;
        this.dailyPlanTaskRepository = dailyPlanTaskRepository;
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
        
        // Get yesterday's Big Three
        List<Task> yesterdayBigThree = List.of();
        if (yesterdayPlan != null) {
            List<DailyPlanTask> bigThreeTasks = dailyPlanTaskRepository.findByDailyPlanIdOrderByPosition(yesterdayPlan.getId());
            List<Long> taskIds = bigThreeTasks.stream().map(DailyPlanTask::getTaskId).toList();
            yesterdayBigThree = allTasks.stream()
                .filter(t -> taskIds.contains(t.getId()))
                .toList();
        }
        review.put("bigThree", yesterdayBigThree);
        
        return ResponseEntity.ok(review);
    }
    
    @PutMapping("/big-three")
    public ResponseEntity<List<Task>> updateBigThree(@RequestBody List<Long> taskIds) {
        // Validate: must have 0-3 task IDs
        if (taskIds.size() > 3) {
            return ResponseEntity.badRequest().build();
        }
        
        LocalDate today = LocalDate.now();
        
        // Get or create today's plan
        DailyPlan todayPlan = dailyPlanRepository.findByDate(today)
            .orElseGet(() -> {
                DailyPlan newPlan = new DailyPlan(today);
                return dailyPlanRepository.save(newPlan);
            });
        
        // Delete existing Big Three for today
        dailyPlanTaskRepository.deleteByDailyPlanId(todayPlan.getId());
        
        // Create new Big Three entries
        for (int i = 0; i < taskIds.size(); i++) {
            Long taskId = taskIds.get(i);
            DailyPlanTask dpt = new DailyPlanTask(todayPlan.getId(), taskId, i + 1);
            dailyPlanTaskRepository.save(dpt);
        }
        
        // Return the tasks
        List<Task> tasks = taskRepository.findAllById(taskIds);
        return ResponseEntity.ok(tasks);
    }
    
    @GetMapping("/big-three")
    public ResponseEntity<List<Task>> getBigThree() {
        LocalDate today = LocalDate.now();
        
        DailyPlan todayPlan = dailyPlanRepository.findByDate(today).orElse(null);
        if (todayPlan == null) {
            return ResponseEntity.ok(List.of());
        }
        
        List<DailyPlanTask> bigThreeTasks = dailyPlanTaskRepository.findByDailyPlanIdOrderByPosition(todayPlan.getId());
        List<Long> taskIds = bigThreeTasks.stream().map(DailyPlanTask::getTaskId).toList();
        
        List<Task> tasks = taskRepository.findAllById(taskIds);
        return ResponseEntity.ok(tasks);
    }
}
