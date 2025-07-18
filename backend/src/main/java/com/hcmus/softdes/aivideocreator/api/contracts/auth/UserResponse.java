package com.hcmus.softdes.aivideocreator.api.contracts.auth;

import lombok.Builder;

import java.util.Date;

public record UserResponse(
    String id,
    String username,
    String email,
    String fullname,
    Date dateOfBirth
) {}
