package com.transitops.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.transitops.dto.DashboardKpisResponse;
import com.transitops.entity.DriverStatus;
import com.transitops.entity.VehicleStatus;
import com.transitops.entity.TripStatus;
import com.transitops.repository.DriverRepository;
import com.transitops.repository.TripRepository;
import com.transitops.repository.VehicleRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardService {

	private final VehicleRepository vehicleRepository;
	private final DriverRepository driverRepository;
	private final TripRepository tripRepository;

	@Transactional(readOnly = true)
	public DashboardKpisResponse getKpis(String vehicleType, VehicleStatus vehicleStatus) {
		String type = vehicleType != null && !vehicleType.isBlank() ? vehicleType.trim() : null;

		long activeVehicles;
		long availableVehicles;
		long vehiclesInMaintenance;
		long onTripVehicles;

		if (type != null && vehicleStatus != null) {
			activeVehicles = vehicleStatus == VehicleStatus.RETIRED ? 0 : vehicleRepository.countByTypeAndStatus(type, vehicleStatus);
			availableVehicles = vehicleRepository.countByTypeAndStatus(type, VehicleStatus.AVAILABLE);
			vehiclesInMaintenance = vehicleRepository.countByTypeAndStatus(type, VehicleStatus.IN_SHOP);
			onTripVehicles = vehicleRepository.countByTypeAndStatus(type, VehicleStatus.ON_TRIP);
		} else if (type != null) {
			activeVehicles = vehicleRepository.countByTypeAndStatusNot(type, VehicleStatus.RETIRED);
			availableVehicles = vehicleRepository.countByTypeAndStatus(type, VehicleStatus.AVAILABLE);
			vehiclesInMaintenance = vehicleRepository.countByTypeAndStatus(type, VehicleStatus.IN_SHOP);
			onTripVehicles = vehicleRepository.countByTypeAndStatus(type, VehicleStatus.ON_TRIP);
		} else if (vehicleStatus != null) {
			activeVehicles = vehicleStatus == VehicleStatus.RETIRED ? 0 : vehicleRepository.countByStatus(vehicleStatus);
			availableVehicles = vehicleRepository.countByStatus(VehicleStatus.AVAILABLE);
			vehiclesInMaintenance = vehicleRepository.countByStatus(VehicleStatus.IN_SHOP);
			onTripVehicles = vehicleRepository.countByStatus(VehicleStatus.ON_TRIP);
		} else {
			activeVehicles = vehicleRepository.countByStatusNot(VehicleStatus.RETIRED);
			availableVehicles = vehicleRepository.countByStatus(VehicleStatus.AVAILABLE);
			vehiclesInMaintenance = vehicleRepository.countByStatus(VehicleStatus.IN_SHOP);
			onTripVehicles = vehicleRepository.countByStatus(VehicleStatus.ON_TRIP);
		}

		double fleetUtilizationPercent = activeVehicles == 0
			? 0.0
			: (onTripVehicles * 100.0) / activeVehicles;

		long driversOnDuty = driverRepository.countByStatusIn(
			List.of(DriverStatus.AVAILABLE, DriverStatus.ON_TRIP)
		);

		long activeTrips = tripRepository.countByStatus(TripStatus.DISPATCHED);
		long pendingTrips = tripRepository.countByStatus(TripStatus.DRAFT);

		return DashboardKpisResponse.builder()
			.activeVehicles(activeVehicles)
			.availableVehicles(availableVehicles)
			.vehiclesInMaintenance(vehiclesInMaintenance)
			.activeTrips(activeTrips)
			.pendingTrips(pendingTrips)
			.driversOnDuty(driversOnDuty)
			.fleetUtilizationPercent(fleetUtilizationPercent)
			.build();
	}
}
