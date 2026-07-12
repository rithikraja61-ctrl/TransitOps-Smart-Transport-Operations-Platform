package com.transitops.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.transitops.entity.Role;
import com.transitops.entity.RoleName;
import com.transitops.repository.RoleRepository;

@Configuration
public class RoleSeeder {

	@Bean
	CommandLineRunner seedRoles(RoleRepository roleRepository) {
		return args -> {
			if (roleRepository.count() > 0) {
				return;
			}

			roleRepository.saveAll(List.of(
				new Role(RoleName.FLEET_MANAGER, List.of("data:fleet", "data:maintenance")),
				new Role(RoleName.DISPATCHER, List.of("data:dashboard", "data:trips")),
				new Role(RoleName.SAFETY_OFFICER, List.of("data:drivers", "data:compliance")),
				new Role(RoleName.FINANCIAL_ANALYST, List.of("data:fuel_expenses", "data:analytics"))
			));
		};
	}
}
