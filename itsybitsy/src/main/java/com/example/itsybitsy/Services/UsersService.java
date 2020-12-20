package com.example.itsybitsy.Services;

import com.example.itsybitsy.DbModels.*;
import com.example.itsybitsy.Repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Service
public class UsersService {
    private UsersRepository usersRepository;

    @Autowired
    public UsersService(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    public Collection<User> getUsers() {
        return usersRepository.findAll();
    }

    public Optional<User> getUser(String phoneNumber){
        return  usersRepository.findByPhoneNumber(phoneNumber);
    }

    public User addUser(User user){
        return usersRepository.save(user);
    }
}
