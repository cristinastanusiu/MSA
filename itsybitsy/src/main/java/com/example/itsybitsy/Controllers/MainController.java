package com.example.itsybitsy.Controllers;

import com.example.itsybitsy.Services.EventsService;
import com.example.itsybitsy.Services.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.util.List;

@EnableSwagger2
@Controller
public class MainController {
    @Autowired
    private UsersService usersService;
    @Autowired
    private EventsService eventsService;

    @GetMapping("/getEvents")
    @ResponseBody
    public ResponseEntity<String> getMyContactsEvents(List<String> phoneNumbers){
        eventsService.getMyContactsEvents(phoneNumbers);
        return new ResponseEntity<>("Event1, Event2, Event3...", HttpStatus.OK);
    }

    @PostMapping("/addEvent")
    public ResponseEntity<String> addEvent(){
        return new ResponseEntity<>("event added", HttpStatus.OK);
    }

}
