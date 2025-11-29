package com.isquareinfo.portal.service;

import com.isquareinfo.portal.model.User;
import com.isquareinfo.portal.repository.UserRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User u = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: "+username));
        return org.springframework.security.core.userdetails.User.builder()
            .username(u.getUsername())
            .password(u.getPassword())
            .authorities(u.getRoles().stream().map(r->r).collect(Collectors.toList()).toArray(new String[0]))
            .accountExpired(false).accountLocked(false).credentialsExpired(false).disabled(false)
            .build();
    }
}
