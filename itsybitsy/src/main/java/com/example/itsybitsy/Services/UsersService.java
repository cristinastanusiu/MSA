package com.example.itsybitsy.Services;

import com.example.itsybitsy.DbModels.User;
import com.example.itsybitsy.Repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsersService {
    private UsersRepository usersRepository;

    @Autowired
    public UsersService(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    public void getUsers(List<String> phoneNumbers) {
//        List<User> users=usersRepository.findAll();
//        users.stream()
//                .map(user -> user.phoneNumber)
//                .
    }
}
