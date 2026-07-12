package com.transitops.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.transitops.dto.SignupRequest;
import com.transitops.dto.SignupResponse;
import com.transitops.entity.Role;
import com.transitops.entity.User;
import com.transitops.exception.DuplicateResourceException;
import com.transitops.exception.ResourceNotFoundException;
import com.transitops.repository.RoleRepository;
import com.transitops.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

	private final UserRepository userRepository;
	private final RoleRepository roleRepository;
	private final PasswordEncoder passwordEncoder;

	@Transactional
	public SignupResponse signup(SignupRequest request) {
		String email = request.getEmail().trim().toLowerCase();
		String username = request.getUsername().trim().toLowerCase();

		if (userRepository.existsByEmail(email)) {
			throw new DuplicateResourceException("email", "Email already registered");
		}
		if (userRepository.existsByUsername(username)) {
			throw new DuplicateResourceException("username", "Username already taken");
		}

		Role role = roleRepository.findByName(request.getRole())
			.orElseThrow(() -> new ResourceNotFoundException("Role not found: " + request.getRole()));

		User user = new User();
		user.setUsername(username);
		user.setEmail(email);
		user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
		user.setRole(role);

		User saved = userRepository.save(user);

		return SignupResponse.builder()
			.id(saved.getId())
			.username(saved.getUsername())
			.email(saved.getEmail())
			.role(saved.getRole().getName())
			.scopes(saved.getRole().getScopes())
			.build();
	}
}
