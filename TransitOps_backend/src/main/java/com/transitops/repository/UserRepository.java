package com.transitops.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.transitops.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

	boolean existsByEmail(String email);

	boolean existsByUsername(String username);
}
