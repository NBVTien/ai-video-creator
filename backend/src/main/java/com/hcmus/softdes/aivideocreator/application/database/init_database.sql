CREATE TABLE User (
                      id BINARY(16) PRIMARY KEY,
                      username VARCHAR(255) NOT NULL,
                      email VARCHAR(255) NOT NULL UNIQUE,
                      password VARCHAR(255) NOT NULL, -- In a real app, store hashed passwords!
                      dateOfBirth DATE,
                      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                      updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO User (id, username, email, password, dateOfBirth, createdAt, updatedAt) VALUES
                                                                                        (UUID_TO_BIN(UUID()), 'user_alpha', 'alpha@example.com', 'pass123!', '1990-05-15', '2023-01-10 10:00:00', '2023-01-10 10:00:00'),
                                                                                        (UUID_TO_BIN(UUID()), 'beta_user', 'beta@example.com', 'secureP@ss', '1985-11-20', '2023-01-15 11:30:00', '2023-01-18 09:45:00'),
                                                                                        (UUID_TO_BIN(UUID()), 'gamma_ray', 'gamma@example.com', 'g@mm@Rulez', '1992-08-01', '2023-02-01 14:20:00', '2023-02-05 16:00:00'),
                                                                                        (UUID_TO_BIN(UUID()), 'delta_force', 'delta@example.com', 'delta12345', '1988-03-25', '2023-02-10 08:00:00', '2023-02-10 08:00:00'),
                                                                                        (UUID_TO_BIN(UUID()), 'epsilon_joy', 'epsilon@example.com', 'joyfulPass', '1995-07-12', '2023-03-05 18:00:00', '2023-03-10 12:10:00'),
                                                                                        (UUID_TO_BIN(UUID()), 'zeta_code', 'zeta@example.com', 'c0derZeta', '1991-12-30', '2023-03-12 09:15:00', '2023-03-12 09:15:00'),
                                                                                        (UUID_TO_BIN(UUID()), 'eta_star', 'eta@example.com', 'starLight99', '1982-09-05', '2023-04-01 20:00:00', '2023-04-03 21:30:00'),
                                                                                        (UUID_TO_BIN(UUID()), 'theta_wave', 'theta@example.com', 'w@veRider', '1998-02-18', '2023-04-10 13:45:00', '2023-04-15 14:00:00'),
                                                                                        (UUID_TO_BIN(UUID()), 'iota_bit', 'iota@example.com', 'bitByBit101', '1993-06-22', '2023-05-01 07:30:00', '2023-05-01 07:30:00'),
                                                                                        (UUID_TO_BIN(UUID()), 'kappa_sys', 'kappa@example.com', 'systemK@p', '1987-10-10', '2023-05-15 16:50:00', '2023-05-20 10:05:00'),
                                                                                        (UUID_TO_BIN(UUID()), 'lambda_func', 'lambda@example.com', 'functi0nL', '1996-04-03', '2023-06-02 11:00:00', '2023-06-02 11:00:00'),
                                                                                        (UUID_TO_BIN(UUID()), 'mu_data', 'mu@example.com', 'd@t@Mu22', '1989-08-14', '2023-06-10 22:00:00', '2023-06-12 23:15:00'),
                                                                                        (UUID_TO_BIN(UUID()), 'nu_net', 'nu@example.com', 'netw0rkNu', '1994-01-28', '2023-07-01 09:25:00', '2023-07-05 10:30:00'),
                                                                                        (UUID_TO_BIN(UUID()), 'xi_stream', 'xi@example.com', 'str3@mX!', '1999-07-07', '2023-07-15 12:12:12', '2023-07-15 12:12:12'),
                                                                                        (UUID_TO_BIN(UUID()), 'omicron_prime', 'omicron@example.com', 'primeOmi7', '1984-03-09', '2023-08-03 17:30:00', '2023-08-08 18:00:00'),
                                                                                        (UUID_TO_BIN(UUID()), 'pi_value', 'pi@example.com', 'value314', '1990-09-19', '2023-08-11 06:00:00', '2023-08-11 06:00:00'),
                                                                                        (UUID_TO_BIN(UUID()), 'rho_dynamic', 'rho@example.com', 'dyn@Rho1', '1997-05-29', '2023-09-01 19:45:00', '2023-09-06 20:00:00'),
                                                                                        (UUID_TO_BIN(UUID()), 'sigma_sum', 'sigma@example.com', 'sumTotal!', '1986-11-02', '2023-09-15 10:10:10', '2023-09-20 11:11:11'),
                                                                                        (UUID_TO_BIN(UUID()), 'tau_time', 'tau@example.com', 'timelyT@u', '1992-10-23', '2023-10-04 14:30:00', '2023-10-04 14:30:00'),
                                                                                        (UUID_TO_BIN(UUID()), 'upsilon_unit', 'upsilon@example.com', 'unitUp5ilon', '1983-12-12', '2023-10-20 23:59:59', '2023-10-25 00:30:00');