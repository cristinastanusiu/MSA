package com.example.itsybitsy.Repository;

import com.example.itsybitsy.DbModels.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsersRepository extends JpaRepository<User,Long>{
    Optional<User> findByPhoneNumber(String phoneNumber);
}
