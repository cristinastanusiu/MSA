package com.example.itsybitsy.Controllers;

import com.example.itsybitsy.Services.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@EnableSwagger2
@Controller
public class MainController {
    @Autowired
    private UsersService usersService;

    @GetMapping("/getEvents")
    public ResponseEntity<String> getEvents(){
        return new ResponseEntity<>("Event1, Event2, Event3...", HttpStatus.OK);
    }
}
