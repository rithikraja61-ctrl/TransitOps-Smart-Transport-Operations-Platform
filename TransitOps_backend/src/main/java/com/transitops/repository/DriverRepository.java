package com.transitops.repository;

import java.util.Collection;

import org.springframework.data.jpa.repository.JpaRepository;

import com.transitops.entity.Driver;
import com.transitops.entity.DriverStatus;

public interface DriverRepository extends JpaRepository<Driver, Long> {

	boolean existsByLicenseNumber(String licenseNumber);

	boolean existsByLicenseNumberAndIdNot(String licenseNumber, Long id);

	long countByStatus(DriverStatus status);

	long countByStatusIn(Collection<DriverStatus> statuses);
}
