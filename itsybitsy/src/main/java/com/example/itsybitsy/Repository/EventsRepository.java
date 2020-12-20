package com.example.itsybitsy.Repository;

import com.example.itsybitsy.DbModels.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventsRepository extends JpaRepository<Event, Long> {
}
