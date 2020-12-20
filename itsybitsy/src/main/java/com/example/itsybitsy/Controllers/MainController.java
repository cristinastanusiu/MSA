package com.example.itsybitsy.Controllers;

import com.example.itsybitsy.DbModels.*;
import com.example.itsybitsy.Services.EventsService;
import com.example.itsybitsy.Services.UsersService;
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
    public ResponseEntity<Collection<Event>> getMyContactsEvents(){
        return new ResponseEntity<>(eventsService.getMyContactsEvents(), HttpStatus.OK);
    }

    @GetMapping("/getUsers")
    @ResponseBody
    public ResponseEntity<Collection<User>> getUsersForContacts(){
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

    @PostMapping("/addEvent/{phoneNumber}")
    public ResponseEntity<String> addEvent(@PathVariable (value = "phoneNumber") String phoneNumber, @RequestBody Event event){
        Optional<User> user = usersService.getUser(phoneNumber);
        if(!user.isPresent())
            return new ResponseEntity<>("Can't add event! User not registered.", HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(eventsService.addEvent(event, user.get()).toString() + " was added!", HttpStatus.CREATED);
    }

    @PostMapping("/addUser")
    public ResponseEntity<String> addUser(@RequestBody User user){
        return new ResponseEntity<>(usersService.addUser(user).toString() + " was added!", HttpStatus.CREATED);
    }

}
