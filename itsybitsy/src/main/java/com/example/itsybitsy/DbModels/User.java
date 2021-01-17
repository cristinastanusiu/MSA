package com.example.itsybitsy.DbModels;


import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.*;


@Entity(name = "User")
@Table(name = "users", schema = "msa")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonIgnore
    private Long id;
    private String firstName;
    private String lastName;
    private String password;

    @JsonIgnore
    @ManyToMany(mappedBy = "participants")
    private Set<Event> joinedEvents = new HashSet<>();

    @Column(unique = true)
    private String phoneNumber;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<Event> getJoinedEvents() {
        return joinedEvents;
    }

    public void setJoinedEvents(Set<Event> joinedEvents) {
        this.joinedEvents = joinedEvents;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public User() {
    }
}
