CREATE TABLE User (
                      id VARCHAR(36) PRIMARY KEY,
                      username VARCHAR(255) NOT NULL,
                      email VARCHAR(255) NOT NULL UNIQUE,
                      password VARCHAR(255) NOT NULL,
                      dateOfBirth DATE,
                      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                      updatedAt TIMESTAMP NOT NULL DEFAULT  CURRENT_TIMESTAMP
);

INSERT INTO User (id, username, email, password, dateOfBirth, createdAt, updatedAt) VALUES
                                                                                        ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'user_alpha', 'alpha@example.com', 'pass123!', '1990-05-15', '2023-01-10 10:00:00', '2023-01-10 10:00:00'),
                                                                                        ('b2c3d4e5-f6a7-8901-2345-67890abcdeff', 'beta_user', 'beta@example.com', 'secureP@ss', '1985-11-20', '2023-01-15 11:30:00', '2023-01-18 09:45:00'),
                                                                                        ('c3d4e5f6-a7b8-9012-3456-7890abcdef01', 'gamma_ray', 'gamma@example.com', 'g@mm@Rulez', '1992-08-01', '2023-02-01 14:20:00', '2023-02-05 16:00:00'),
                                                                                        ('d4e5f6a7-b8c9-0123-4567-890abcdef012', 'delta_force', 'delta@example.com', 'delta12345', '1988-03-25', '2023-02-10 08:00:00', '2023-02-10 08:00:00'),
                                                                                        ('e5f6a7b8-c9d0-1234-5678-90abcdef0123', 'epsilon_joy', 'epsilon@example.com', 'joyfulPass', '1995-07-12', '2023-03-05 18:00:00', '2023-03-10 12:10:00'),
                                                                                        ('f6a7b8c9-d0e1-2345-6789-0abcdef01234', 'zeta_code', 'zeta@example.com', 'c0derZeta', '1991-12-30', '2023-03-12 09:15:00', '2023-03-12 09:15:00'),
                                                                                        ('a7b8c9d0-e1f2-3456-7890-abcdef012345', 'eta_star', 'eta@example.com', 'starLight99', '1982-09-05', '2023-04-01 20:00:00', '2023-04-03 21:30:00'),
                                                                                        ('b8c9d0e1-f2a3-4567-8901-bcdef0123456', 'theta_wave', 'theta@example.com', 'w@veRider', '1998-02-18', '2023-04-10 13:45:00', '2023-04-15 14:00:00'),
                                                                                        ('c9d0e1f2-a3b4-5678-9012-cdef01234567', 'iota_bit', 'iota@example.com', 'bitByBit101', '1993-06-22', '2023-05-01 07:30:00', '2023-05-01 07:30:00'),
                                                                                        ('d0e1f2a3-b4c5-6789-0123-def012345678', 'kappa_sys', 'kappa@example.com', 'systemK@p', '1987-10-10', '2023-05-15 16:50:00', '2023-05-20 10:05:00'),
                                                                                        ('e1f2a3b4-c5d6-7890-1234-ef0123456789', 'lambda_func', 'lambda@example.com', 'functi0nL', '1996-04-03', '2023-06-02 11:00:00', '2023-06-02 11:00:00'),
                                                                                        ('f2a3b4c5-d6e7-8901-2345-f0123456789a', 'mu_data', 'mu@example.com', 'd@t@Mu22', '1989-08-14', '2023-06-10 22:00:00', '2023-06-12 23:15:00'),
                                                                                        ('a3b4c5d6-e7f8-9012-3456-0123456789ab', 'nu_net', 'nu@example.com', 'netw0rkNu', '1994-01-28', '2023-07-01 09:25:00', '2023-07-05 10:30:00'),
                                                                                        ('b4c5d6e7-f8a9-0123-4567-123456789abc', 'xi_stream', 'xi@example.com', 'str3@mX!', '1999-07-07', '2023-07-15 12:12:12', '2023-07-15 12:12:12'),
                                                                                        ('c5d6e7f8-a9b0-1234-5678-23456789abcd', 'omicron_prime', 'omicron@example.com', 'primeOmi7', '1984-03-09', '2023-08-03 17:30:00', '2023-08-08 18:00:00'),
                                                                                        ('d6e7f8a9-b0c1-2345-6789-3456789abcde', 'pi_value', 'pi@example.com', 'value314', '1990-09-19', '2023-08-11 06:00:00', '2023-08-11 06:00:00'),
                                                                                        ('e7f8a9b0-c1d2-3456-7890-456789abcdef', 'rho_dynamic', 'rho@example.com', 'dyn@Rho1', '1997-05-29', '2023-09-01 19:45:00', '2023-09-06 20:00:00'),
                                                                                        ('f8a9b0c1-d2e3-4567-8901-56789abcdef0', 'sigma_sum', 'sigma@example.com', 'sumTotal!', '1986-11-02', '2023-09-15 10:10:10', '2023-09-20 11:11:11'),
                                                                                        ('a9b0c1d2-e3f4-5678-9012-6789abcdef01', 'tau_time', 'tau@example.com', 'timelyT@u', '1992-10-23', '2023-10-04 14:30:00', '2023-10-04 14:30:00'),
                                                                                        ('b0c1d2e3-f4a5-6789-0123-789abcdef012', 'upsilon_unit', 'upsilon@example.com', 'unitUp5ilon', '1983-12-12', '2023-10-20 23:59:59', '2023-10-25 00:30:00');