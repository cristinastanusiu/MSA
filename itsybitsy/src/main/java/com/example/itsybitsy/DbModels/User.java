package com.example.itsybitsy.DbModels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "users", schema = "msa")
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    private Integer id;
    private String FirstName;
    private String LastName;
    private String phoneNumber;
    @OneToMany(cascade = CascadeType.ALL,
            mappedBy = "host", orphanRemoval = true)
    private List<Event> events = new ArrayList<>();
}
