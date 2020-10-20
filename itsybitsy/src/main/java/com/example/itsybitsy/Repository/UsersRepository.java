package com.example.itsybitsy.Repository;

import com.example.itsybitsy.DbModels.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsersRepository extends JpaRepository<User,Integer>{
}
