package com.hcmus.softdes.aivideocreator.api.controllers;

import com.hcmus.softdes.aivideocreator.api.contracts.auth.AuthResponse;
import com.hcmus.softdes.aivideocreator.api.contracts.auth.LoginRequest;
import com.hcmus.softdes.aivideocreator.api.services.JwtUtils;
import com.hcmus.softdes.aivideocreator.application.user.UserDto;
import com.hcmus.softdes.aivideocreator.application.user.UserService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody UserDto request) {
        var applicationUser = userService.registerUser(request);

        User user = new User(
                applicationUser.getUsername(),
                applicationUser.getPassword(),
                new ArrayList<>()
        );
        String jwtToken = JwtUtils.generateToken(user, applicationUser.getId().toString());

        HttpHeaders headers = new HttpHeaders();
        headers.add("Set-Cookie", "authorization=" + jwtToken + "; Path=/; HttpOnly");

        var response = new AuthResponse(applicationUser, jwtToken);
        return ResponseEntity.ok().headers(headers).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(request.username(), request.password());

        Authentication authentication = authenticationManager.authenticate(token);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        var user = ((User) authentication.getPrincipal());
        var applicationUser = userService.findUserByUsername(user.getUsername());

        String jwtToken = JwtUtils.generateToken(user, applicationUser.getId().toString());

        HttpHeaders headers = new HttpHeaders();
        headers.add("Set-Cookie", "authorization=" + jwtToken + "; Path=/; HttpOnly");

        var response = new AuthResponse(applicationUser, jwtToken);
        return ResponseEntity.ok().headers(headers).body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> me() {
        var user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var applicationUser = userService.findUserByUsername(user.getUsername());

        String jwtToken = JwtUtils.generateToken(user, applicationUser.getId().toString());

        HttpHeaders headers = new HttpHeaders();
        headers.add("Set-Cookie", "authorization=" + jwtToken + "; Path=/; HttpOnly");

        var response = new AuthResponse(applicationUser, jwtToken);
        return ResponseEntity.ok().headers(headers).body(response);
    }
    @PostMapping("/dashboard")
    public ResponseEntity<String> dashboard(@RequestBody LoginRequest request) {

        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(request.username(), request.password());

        Authentication authentication = authenticationManager.authenticate(token);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        var user = ((User) authentication.getPrincipal());
        var applicationUser = userService.findUserByUsername(user.getUsername());

        String jwtToken = JwtUtils.generateToken(user, applicationUser.getId().toString());

        HttpHeaders headers = new HttpHeaders();
        headers.add("Set-Cookie", "authorization=" + jwtToken + "; Path=/; HttpOnly");

        return ResponseEntity.ok().headers(headers).body("Dashboard");

    }
}
