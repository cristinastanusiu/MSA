package com.example.itsybitsy.Services;

import com.example.itsybitsy.Repository.EventsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventsService {
    private EventsRepository eventsRepository;

    @Autowired
    public EventsService(EventsRepository eventsRepository) {
        this.eventsRepository = eventsRepository;
    }

    public void getMyContactsEvents(List<String> phoneNumbers) {
        for (String nr: phoneNumbers){

        }
    }
}
