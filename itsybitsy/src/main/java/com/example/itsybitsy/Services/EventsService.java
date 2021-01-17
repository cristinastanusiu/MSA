package com.example.itsybitsy.Services;

import com.example.itsybitsy.DbModels.*;
import com.example.itsybitsy.Repository.EventsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Optional;
import java.util.Set;

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

    public Optional<Event> getEvent(Long id){
        return eventsRepository.findById(id);
    }

    public Collection<Event> getUserEvents(Long id){
       return eventsRepository.findByUserId(id);
    }

    public Event joinEvent(Event event, User user, User participant) {
        //pot fi sterse toate astea si apelata addEvent() in schimb
        Optional<Event> persistedEvent = eventsRepository.findById(event.getId());
        if(!persistedEvent.isPresent())
            return null;
        event.setParticipants(persistedEvent.get().getParticipants());
        event.setUser(user);
        event.setPhone(user.getPhoneNumber());
        event.setHostName(user.getFirstName() + " " + user.getLastName());
        event.getParticipants().add(participant);
        participant.getJoinedEvents().add(event);
        return eventsRepository.save(event);
    }

    public void deleteEvent(Event event) {
        eventsRepository.delete(event);
    }

    public Set<User> getParticipants(Event event) {
        return event.getParticipants();
    }
}
