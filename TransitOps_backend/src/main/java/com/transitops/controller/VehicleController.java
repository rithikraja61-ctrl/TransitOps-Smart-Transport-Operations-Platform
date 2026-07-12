package com.transitops.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.transitops.dto.VehicleRequest;
import com.transitops.dto.VehicleResponse;
import com.transitops.service.VehicleService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('SCOPE_data:fleet')")
public class VehicleController {

	private final VehicleService vehicleService;

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public VehicleResponse create(@Valid @RequestBody VehicleRequest request) {
		return vehicleService.create(request);
	}

	@GetMapping
	public List<VehicleResponse> findAll() {
		return vehicleService.findAll();
	}

	@GetMapping("/{id}")
	public VehicleResponse findById(@PathVariable Long id) {
		return vehicleService.findById(id);
	}

	@PutMapping("/{id}")
	public VehicleResponse update(@PathVariable Long id, @Valid @RequestBody VehicleRequest request) {
		return vehicleService.update(id, request);
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(@PathVariable Long id) {
		vehicleService.delete(id);
	}
}
