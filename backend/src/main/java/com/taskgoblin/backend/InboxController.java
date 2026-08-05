package com.taskgoblin.backend;

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
@RequestMapping("/api/inbox")
@CrossOrigin(origins = "${app.cors.allowed-origin:http://localhost:5173}")
public class InboxController {
    private final InboxRepository inboxRepository;

    public InboxController(InboxRepository inboxRepository) {
        this.inboxRepository = inboxRepository;
    }

    @GetMapping
    public List<InboxItem> getInboxItems() {
        return inboxRepository.findByProcessedOrderByCreatedAtDesc(false);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InboxItem createInboxItem(@RequestBody InboxItem item) {
        item.setId(null);
        if (item.getContent() == null || item.getContent().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Content is required");
        }
        item.setContent(item.getContent().trim());
        item.setProcessed(false);
        return inboxRepository.save(item);
    }

    @GetMapping("/{id}")
    public InboxItem getInboxItem(@PathVariable Long id) {
        return inboxRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Inbox item not found"));
    }

    @PutMapping("/{id}/process")
    public InboxItem processInboxItem(@PathVariable Long id) {
        InboxItem item = getInboxItem(id);
        item.setProcessed(true);
        return inboxRepository.save(item);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteInboxItem(@PathVariable Long id) {
        if (!inboxRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Inbox item not found");
        }
        inboxRepository.deleteById(id);
    }
}
