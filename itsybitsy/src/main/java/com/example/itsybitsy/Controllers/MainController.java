package com.example.itsybitsy.Controllers;

import com.example.itsybitsy.DbModels.*;
import com.example.itsybitsy.Services.EventsService;
import com.example.itsybitsy.Services.UsersService;
import com.example.itsybitsy.utils.LoginCredentials;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.util.Collection;
import java.util.Optional;

import static java.lang.String.format;

@EnableSwagger2
@Controller
public class MainController {
    @Autowired
    private UsersService usersService;
    @Autowired
    private EventsService eventsService;

    @GetMapping("/getEvents")
    @ResponseBody
    public ResponseEntity<Collection<Event>> getEvents(){
        return new ResponseEntity<>(eventsService.getMyContactsEvents(), HttpStatus.OK);
    }

    @GetMapping("/getUsers")
    @ResponseBody
    public ResponseEntity<Collection<User>> getUsers(){
        return new ResponseEntity<>(usersService.getUsers(), HttpStatus.OK);
    }

    @GetMapping("/getUser/{phoneNumber}")
    @ResponseBody
    public ResponseEntity<Object> getUser(@PathVariable (value = "phoneNumber") String phoneNumber){
        Optional<User> user = usersService.getUser(phoneNumber);
        if(user.isPresent())
            return new ResponseEntity<>(user.get(), HttpStatus.OK);
        return new ResponseEntity<>(format("User with phone number %s not found", phoneNumber), HttpStatus.NOT_FOUND);
    }

    @GetMapping("/getEvents/{phoneNumber}")
    public ResponseEntity<Collection<Event>> getUserEvents(@PathVariable (value = "phoneNumber") String phoneNumber){
        Collection<Event> events = eventsService.getUserEvents(usersService.getUserId(phoneNumber));
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @GetMapping("/getParticipants/{eventId}")
    @ResponseBody
    public ResponseEntity<Object> getParticipants(@PathVariable (value = "eventId") Long eventId){
        Optional<Event> event = eventsService.getEvent(eventId);
        if(!event.isPresent())
            return new ResponseEntity<>(format("Event with %id not found!", eventId), HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(eventsService.getParticipants(event.get()),HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginCredentials loginCredentials){
        String response = usersService.loginUser(loginCredentials.phoneNumber, loginCredentials.password);
        switch(response){
            case "-1":
                return new ResponseEntity<>("Incorrect password. Try again!", HttpStatus.UNAUTHORIZED);
            case "0":
                return new ResponseEntity<>("Phone number not registered. Signup!", HttpStatus.NOT_FOUND);
            default:
                return new ResponseEntity<>("Successfully logged in.", HttpStatus.OK);
        }
    }

    @PostMapping("/addEvent/{phoneNumber}")
    public ResponseEntity<String> addEvent(@PathVariable (value = "phoneNumber") String phoneNumber, @RequestBody Event event){
        Optional<User> user = usersService.getUser(phoneNumber);
        if(!user.isPresent())
            return new ResponseEntity<>("Can't add event! User not registered.", HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(eventsService.addEvent(event, user.get()).toString() + " was added!", HttpStatus.CREATED);
    }

    @PostMapping("/addUser")
    public ResponseEntity<String> addUser(@RequestBody User user){
        User savedUser = usersService.addUser(user);
        return new ResponseEntity<>(savedUser.getFirstName() + " " + savedUser.getLastName() + " succesfully registered!", HttpStatus.CREATED);
    }

    @DeleteMapping("/deleteEvent")
    public ResponseEntity<String> deleteEvent(@RequestParam Long eventId){
        Optional<Event> event = eventsService.getEvent(eventId);
        if(!event.isPresent())
            return new ResponseEntity<>("Event not found!", HttpStatus.NOT_FOUND);
        eventsService.deleteEvent(event.get());
        return new ResponseEntity<>( format("Event with id %d removed", eventId), HttpStatus.OK);
    }

    @PutMapping("/joinEvent/{phoneNumber}")
    @ResponseBody
    public ResponseEntity<String> joinEvent(@RequestParam String participantPhoneNumber, @PathVariable (value = "phoneNumber") String phoneNumber, @RequestBody Event event){
        Optional<User> participant = usersService.getUser(participantPhoneNumber);
        Optional<User> user = usersService.getUser(phoneNumber);
        if(!user.isPresent() || !participant.isPresent())
            return new ResponseEntity<>( "User not found.",HttpStatus.NOT_FOUND);
        Event modifiedEvent = eventsService.joinEvent(event, user.get(), participant.get());
        return new ResponseEntity<>( modifiedEvent.getTitle() + " was modified.",HttpStatus.OK);
    }
}
