package com.example.itsybitsy.Services;

import com.example.itsybitsy.DbModels.*;
import com.example.itsybitsy.Repository.EventsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;

@Service
public class EventsService {
    private EventsRepository eventsRepository;
    @Autowired
    public EventsService(EventsRepository eventsRepository) {
        this.eventsRepository = eventsRepository;
    }

    public Collection<Event> getMyContactsEvents() {
        return eventsRepository.findAll();
    }

    public Event addEvent(Event event, User user){
        event.setUser(user);
        return eventsRepository.save(event);
    }
}
