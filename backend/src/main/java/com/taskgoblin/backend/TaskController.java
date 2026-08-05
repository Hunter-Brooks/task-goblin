package com.taskgoblin.backend;

import java.time.Instant;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "${app.cors.allowed-origin:http://localhost:5173}")
public class TaskController {
    private final TaskRepository taskRepository;

    public TaskController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @GetMapping
    public List<Task> getTasks() {
        return taskRepository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Task createTask(@RequestBody Task task) {
        task.setId(null);
        normalizeTask(task, null);
        return taskRepository.save(task);
    }

    @GetMapping("/{id}")
    public Task getTask(@PathVariable Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task taskUpdate) {
        Task existing = getTask(id);
        taskUpdate.setId(existing.getId());
        taskUpdate.setCreatedAt(existing.getCreatedAt());
        normalizeTask(taskUpdate, existing);
        return taskRepository.save(taskUpdate);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTask(@PathVariable Long id) {
        if (!taskRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found");
        }
        taskRepository.deleteById(id);
    }

    private void normalizeTask(Task task, Task existing) {
        if (task.getTitle() == null || task.getTitle().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Title is required");
        }
        task.setTitle(task.getTitle().trim());
        if (task.getStatus() == null) {
            task.setStatus(existing != null ? existing.getStatus() : TaskStatus.ACTIVE);
        }
        if (task.getPriority() == null) {
            task.setPriority(existing != null ? existing.getPriority() : TaskPriority.MEDIUM);
        }
        if (task.getStatus() == TaskStatus.COMPLETED && task.getCompletedAt() == null) {
            task.setCompletedAt(Instant.now());
        }
        if (task.getStatus() == TaskStatus.ACTIVE) {
            task.setCompletedAt(null);
        }
    }
}
