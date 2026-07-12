package com.transitops.security;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.transitops.service.TokenBlacklistService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtService jwtService;
	private final TokenBlacklistService tokenBlacklistService;

	@Override
	protected void doFilterInternal(
		HttpServletRequest request,
		HttpServletResponse response,
		FilterChain filterChain
	) throws ServletException, IOException {
		String header = request.getHeader("Authorization");
		if (header != null && header.startsWith("Bearer ")) {
			String token = header.substring(7);
			try {
				Claims claims = jwtService.parseToken(token);
				String jti = JwtService.getJti(claims);
				if (jti == null || jti.isBlank() || tokenBlacklistService.isRevoked(jti)) {
					SecurityContextHolder.clearContext();
				} else {
					String email = claims.get("email", String.class);
					List<SimpleGrantedAuthority> authorities = JwtService.scopesFromClaims(claims).stream()
						.map(scope -> new SimpleGrantedAuthority("SCOPE_" + scope))
						.collect(Collectors.toList());

					UsernamePasswordAuthenticationToken authentication =
						new UsernamePasswordAuthenticationToken(email, null, authorities);
					SecurityContextHolder.getContext().setAuthentication(authentication);
				}
			} catch (JwtException | IllegalArgumentException ex) {
				SecurityContextHolder.clearContext();
			}
		}

		filterChain.doFilter(request, response);
	}
}
