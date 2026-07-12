package com.transitops.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.transitops.entity.Trip;
import com.transitops.entity.TripStatus;

public interface TripRepository extends JpaRepository<Trip, Long> {

	long countByStatus(TripStatus status);
}
