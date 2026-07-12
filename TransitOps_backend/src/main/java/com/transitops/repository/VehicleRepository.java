package com.transitops.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.transitops.entity.Vehicle;
import com.transitops.entity.VehicleStatus;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

	boolean existsByRegistrationNumber(String registrationNumber);

	boolean existsByRegistrationNumberAndIdNot(String registrationNumber, Long id);

	long countByStatus(VehicleStatus status);

	long countByStatusNot(VehicleStatus status);

	long countByTypeAndStatus(String type, VehicleStatus status);

	long countByTypeAndStatusNot(String type, VehicleStatus status);

	Optional<Vehicle> findByRegistrationNumber(String registrationNumber);

	List<Vehicle> findByStatus(VehicleStatus status);

	List<Vehicle> findByStatusNot(VehicleStatus status);
}

