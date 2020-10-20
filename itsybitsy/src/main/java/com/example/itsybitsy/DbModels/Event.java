package com.example.itsybitsy.DbModels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Data
@Entity
@Table (name = "events", schema = "msa")
@AllArgsConstructor
@NoArgsConstructor
public class Event {
    @Id
    private Integer id;
    @ManyToOne
    private User host;
}
