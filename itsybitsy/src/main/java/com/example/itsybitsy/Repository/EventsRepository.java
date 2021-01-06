package com.example.itsybitsy.Repository;

import com.example.itsybitsy.DbModels.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;

public interface EventsRepository extends JpaRepository<Event, Long> {
    Collection<Event> findByUserId(Long id);

}
