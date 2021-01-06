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

    public String loginUser(String phoneNumber, String password){
        Optional<User> user = this.getUser(phoneNumber);
        if(!user.isPresent())
            return "0";
        User existingUser = user.get();
        if (!existingUser.getPassword().equals(password))
            return "-1";
        return "1";
    }

    public Long getUserId(String phoneNumber){
        Optional<User> user = usersRepository.findByPhoneNumber(phoneNumber);
        Long id=0L;
        if(user.isPresent()){
            id = user.get().getId();
        }
        return id;
    }
}
