package com.hcmus.softdes.aivideocreator.application.database;

import com.hcmus.softdes.aivideocreator.domain.user.User;
import org.junit.jupiter.api.*;

import static org.junit.jupiter.api.Assertions.*;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.sql.SQLException;
import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;
import java.util.Date;

class mySQLUserDAOTest {

    private Connection connection;

    private MySQL_User_DAO dao;

    @BeforeAll
    static void setUpClass() throws Exception {
        Class.forName("org.h2.Driver");
    }

    @BeforeEach
    void setUp() throws Exception {
        // Connect to an in-memory H2 database in MySQL compatibility mode.
        connection = DriverManager.getConnection(
                "jdbc:h2:mem:aivideocreator;MODE=MySQL;DB_CLOSE_DELAY=-1", "sa", ""
        );

        dao = MySQL_User_DAO.getInstance();
    }

    @AfterEach
    void tearDown() throws Exception {
        try (Statement stmt = connection.createStatement()) {
            stmt.executeUpdate("DROP TABLE IF EXISTS User");
        }
        connection.close();
    }

    @Test
    void getInstance() {
        MySQL_User_DAO instance1 = MySQL_User_DAO.getInstance();
        MySQL_User_DAO instance2 = MySQL_User_DAO.getInstance();
        assertSame(instance1, instance2, "Both instances should be the same (singleton).");
    }

    @Test
    void findAllUsers() {
        List<User> users = dao.findAllUsers();
        assertNotNull(users, "User list should not be null.");
        assertEquals(16, users.size(), "There should be 16 users in the test database.");
    }

    @Test
    void saveUser() {
        // Create and save a new user.
        User user = new User(UUID.randomUUID(), "test_save", "save_test@example.com", "testPass",
                new Date(), LocalDateTime.now(), LocalDateTime.now());
        dao.saveUser(user);
        // Verify the user by fetching via the id.
        User fetchedUser = dao.findUserById(user.getId());
        assertNotNull(fetchedUser, "The saved user should be found.");
        assertEquals(user.getUsername(), fetchedUser.getUsername(), "Usernames must match.");
    }

    @Test
    void findUserById() {
        // Use one of the inserted IDs from the SQL provided.
        UUID userId = UUID.fromString("a1b2c3d4-e5f6-7890-1234-567890abcdef");
        User user = dao.findUserById(userId);
        assertNotNull(user, "The user with the given ID should be found.");
        assertEquals("user_alpha", user.getUsername(), "The username should be 'user_alpha'.");

        // Check for a non-existing user.
        User nonExistent = dao.findUserById(UUID.randomUUID());
        assertNull(nonExistent, "Non-existent user should return null.");
    }

    @Test
    void findUserByUsername() {
        // Retrieve using one of the usernames in the test data.
        User user = dao.findUserByUsername("gamma_ray");
        assertNotNull(user, "User should be found by username.");
        assertEquals("gamma@example.com", user.getEmail(), "Emails should match.");

        User nonExistent = dao.findUserByUsername("non_existing");
        assertNull(nonExistent, "Non-existent username should return null.");
    }

//    @Test
//    void updateUser() {
//        UUID userId = UUID.fromString("b2c3d4e5-f6a7-8901-2345-67890abcdeff");
//        User user = dao.findUserById(userId);
//        assertNotNull(user, "User should exist before update.");
//
//        // Update some fields.
//        user.setUsername("updated_beta_user");
//        user.setEmail("updated_beta@example.com");
//        user.setUpdatedAt(LocalDateTime.now());
//        dao.updateUser(userId, user);
//
//        User updated = dao.findUserById(userId);
//        assertNotNull(updated, "Updated user should be found.");
//        assertEquals("updated_beta_user", updated.getUsername(), "Username should be updated.");
//    }

    @Test
    void deleteUser() {
        UUID userId = UUID.fromString("c3d4e5f6-a7b8-9012-3456-7890abcdef01");
        User user = dao.findUserById(userId);
        assertNotNull(user, "User should exist before deletion.");

        dao.deleteUser(userId);
        User deleted = dao.findUserById(userId);
        assertNull(deleted, "User should be null after deletion.");
    }
}
