package com.taskgoblin.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
                
                // Auto-select Big Three if none exist
                autoSelectBigThreeIfNeeded(existingPlan);
            }
            return ResponseEntity.ok(existingPlan);
        }
        
        // Create new plan for today
        DailyPlan newPlan = new DailyPlan(today);
        newPlan.setStarted(true);
        DailyPlan saved = dailyPlanRepository.save(newPlan);
        
        // Auto-select Big Three for new plan
        autoSelectBigThreeIfNeeded(saved);
        
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
        
        // Return the tasks in the correct order
        List<Task> tasks = getTasksInOrder(taskIds);
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
        
        // Auto-select if Big Three is empty
        if (bigThreeTasks.isEmpty()) {
            autoSelectBigThreeIfNeeded(todayPlan);
            bigThreeTasks = dailyPlanTaskRepository.findByDailyPlanIdOrderByPosition(todayPlan.getId());
        }
        
        List<Long> taskIds = bigThreeTasks.stream().map(DailyPlanTask::getTaskId).toList();
        List<Task> tasks = getTasksInOrder(taskIds);
        
        // Check if any tasks were deleted - if so, refill Big Three
        if (tasks.size() < bigThreeTasks.size()) {
            // Some tasks no longer exist, clean up and refill
            cleanupAndRefillBigThree(todayPlan, tasks);
            // Fetch again after refill
            bigThreeTasks = dailyPlanTaskRepository.findByDailyPlanIdOrderByPosition(todayPlan.getId());
            taskIds = bigThreeTasks.stream().map(DailyPlanTask::getTaskId).toList();
            tasks = getTasksInOrder(taskIds);
        }
        
        return ResponseEntity.ok(tasks);
    }
    
    @PostMapping("/big-three/refresh")
    @Transactional
    public ResponseEntity<List<Task>> refreshBigThree() {
        LocalDate today = LocalDate.now();
        
        DailyPlan todayPlan = dailyPlanRepository.findByDate(today)
            .orElseGet(() -> {
                DailyPlan newPlan = new DailyPlan(today);
                return dailyPlanRepository.save(newPlan);
            });
        
        // Delete existing and force re-selection
        dailyPlanTaskRepository.deleteByDailyPlanId(todayPlan.getId());
        autoSelectBigThreeIfNeeded(todayPlan);
        
        List<DailyPlanTask> bigThreeTasks = dailyPlanTaskRepository.findByDailyPlanIdOrderByPosition(todayPlan.getId());
        List<Long> taskIds = bigThreeTasks.stream().map(DailyPlanTask::getTaskId).toList();
        
        List<Task> tasks = getTasksInOrder(taskIds);
        return ResponseEntity.ok(tasks);
    }
    
    private List<Task> getTasksInOrder(List<Long> taskIds) {
        // findAllById doesn't preserve order, so we need to manually sort
        List<Task> allTasks = taskRepository.findAllById(taskIds);
        Map<Long, Task> taskMap = allTasks.stream()
            .collect(Collectors.toMap(Task::getId, t -> t));
        
        return taskIds.stream()
            .map(taskMap::get)
            .filter(t -> t != null)
            .collect(Collectors.toList());
    }
    
    @Transactional
    private void cleanupAndRefillBigThree(DailyPlan plan, List<Task> existingValidTasks) {
        // Delete all existing Big Three entries (including invalid ones)
        dailyPlanTaskRepository.deleteByDailyPlanId(plan.getId());
        
        LocalDate today = LocalDate.now();
        
        // Get existing valid task IDs
        List<Long> existingTaskIds = existingValidTasks.stream()
            .map(Task::getId)
            .collect(Collectors.toList());
        
        // Get all active tasks excluding the ones already selected
        List<Task> candidates = taskRepository.findAll().stream()
            .filter(t -> t.getStatus() == TaskStatus.ACTIVE)
            .filter(t -> !existingTaskIds.contains(t.getId()))
            .sorted(createBigThreeComparator(today))
            .limit(3 - existingValidTasks.size())
            .collect(Collectors.toList());
        
        // Combine existing valid tasks with new candidates
        List<Task> finalBigThree = new ArrayList<>();
        finalBigThree.addAll(existingValidTasks);
        finalBigThree.addAll(candidates);
        
        // Sort the combined list by our Big Three criteria
        finalBigThree = finalBigThree.stream()
            .sorted(createBigThreeComparator(today))
            .limit(3)
            .collect(Collectors.toList());
        
        // Save as Big Three with correct positions
        for (int i = 0; i < finalBigThree.size(); i++) {
            DailyPlanTask dpt = new DailyPlanTask(plan.getId(), finalBigThree.get(i).getId(), i + 1);
            dailyPlanTaskRepository.save(dpt);
        }
    }
    
    private void autoSelectBigThreeIfNeeded(DailyPlan plan) {
        // Check if Big Three already exists
        List<DailyPlanTask> existing = dailyPlanTaskRepository.findByDailyPlanIdOrderByPosition(plan.getId());
        if (!existing.isEmpty()) {
            return;
        }
        
        LocalDate today = LocalDate.now();
        
        // Get all active tasks and sort by priority
        List<Task> candidates = taskRepository.findAll().stream()
            .filter(t -> t.getStatus() == TaskStatus.ACTIVE)
            .sorted(createBigThreeComparator(today))
            .limit(3)
            .collect(Collectors.toList());
        
        // If we have tasks, set them as Big Three
        if (!candidates.isEmpty()) {
            for (int i = 0; i < candidates.size(); i++) {
                DailyPlanTask dpt = new DailyPlanTask(plan.getId(), candidates.get(i).getId(), i + 1);
                dailyPlanTaskRepository.save(dpt);
            }
        }
    }
    
    private Comparator<Task> createBigThreeComparator(LocalDate today) {
        return Comparator
            // 1. Overdue tasks first
            .comparing((Task t) -> {
                if (t.getDueDate() != null && t.getDueDate().isBefore(today)) {
                    return 0; // Overdue
                }
                return 1; // Not overdue
            })
            // 2. Then by how soon the task is due
            .thenComparing(t -> {
                if (t.getDueDate() == null) {
                    return Long.MAX_VALUE; // No due date = lowest urgency
                }
                return ChronoUnit.DAYS.between(today, t.getDueDate());
            })
            // 3. Then by priority (HIGH > MEDIUM > LOW)
            .thenComparing(t -> {
                return switch (t.getPriority()) {
                    case HIGH -> 0;
                    case MEDIUM -> 1;
                    case LOW -> 2;
                };
            })
            // 4. Finally by creation date (older tasks first to avoid procrastination)
            .thenComparing(Task::getCreatedAt);
    }
}
