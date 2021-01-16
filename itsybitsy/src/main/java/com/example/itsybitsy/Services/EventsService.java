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
        event.setPhone(user.getPhoneNumber());
        event.setHostName(user.getFirstName() + " " + user.getLastName());
        return eventsRepository.save(event);
    }
    
    public Collection<Event> getUserEvents(Long id){
       return eventsRepository.findByUserId(id);
    }

    public Event joinEvent(Event event, User user) {
        event.setUser(user);
        event.setPhone(user.getPhoneNumber());
        event.setHostName(user.getFirstName() + " " + user.getLastName());
        return eventsRepository.save(event);
    }
}
