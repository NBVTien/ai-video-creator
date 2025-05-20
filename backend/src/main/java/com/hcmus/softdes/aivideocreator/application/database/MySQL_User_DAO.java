package com.hcmus.softdes.aivideocreator.application.database;

import com.hcmus.softdes.aivideocreator.application.common.interfaces.repositories.UserRepository;

import java.util.List;
import java.util.UUID;

import com.hcmus.softdes.aivideocreator.domain.user.User;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;

@Repository
public class MySQL_User_DAO implements UserRepository {

    private static MySQL_User_DAO instance;

    private MySQL_User_DAO() {
    }

    public static synchronized MySQL_User_DAO getInstance() {
        if (instance == null) {
            instance = new MySQL_User_DAO();
        }
        return instance;
    }

    @Override
    public List<User> findAllUsers() {
        List<User> users = new ArrayList<>();
        String sql = "SELECT id, username, email, password, dateOfBirth, createdAt, updatedAt FROM User";

        try (Connection conn = DatabaseConnector.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {

            while (rs.next()) {
                users.add(mapRowToUser(rs));
            }
        } catch (SQLException e) {
            System.err.println("Error fetching all users: " + e.getMessage());
            e.printStackTrace();
        }
        return users;
    }


    @Override
    public void saveUser(User user) {
        String sql = "INSERT INTO User (id, username, email, password, dateOfBirth, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnector.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, user.getId().toString());
            pstmt.setString(2, user.getUsername());
            pstmt.setString(3, user.getEmail());
            pstmt.setString(4, user.getPassword());
            if (user.getDateOfBirth() != null) {
                pstmt.setDate(5, new java.sql.Date(user.getDateOfBirth().getTime()));
            } else {
                pstmt.setNull(5, Types.DATE);
            }
            pstmt.setTimestamp(6, Timestamp.valueOf(user.getCreatedAt()));
            pstmt.setTimestamp(7, Timestamp.valueOf(user.getUpdatedAt()));

            pstmt.executeUpdate();
        } catch (SQLException e) {
            System.err.println("Error saving user: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Override
    public User findUserById(UUID userId) {
        String sql = "SELECT id, username, email, password, dateOfBirth, createdAt, updatedAt FROM User WHERE id = ?";
        User user = null;

        try (Connection conn = DatabaseConnector.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, userId.toString());
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    user = mapRowToUser(rs);
                }
            }
        } catch (SQLException e) {
            System.err.println("Error finding user by ID ("+ userId +"): " + e.getMessage());
            e.printStackTrace();
        }
        return user;
    }

    @Override
    public User findUserByUsername(String username) {
        String sql = "SELECT id, username, email, password, dateOfBirth, createdAt, updatedAt FROM User WHERE username = ?";
        User user = null;

        try (Connection conn = DatabaseConnector.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, username);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    user = mapRowToUser(rs);
                }
            }
        } catch (SQLException e) {
            System.err.println("Error finding user by username ("+ username +"): " + e.getMessage());
            e.printStackTrace();
        }
        return user;
    }

    @Override
    public void updateUser(UUID userId, User user) {
        if (!userId.equals(user.getId())) {
            System.err.println("Mismatch between userId parameter and user object's ID. Aborting update.");
            return;
        }
        String sql = "UPDATE User SET username = ?, email = ?, password = ?, dateOfBirth = ?, updatedAt = ? WHERE id = ?";

        try (Connection conn = DatabaseConnector.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, user.getUsername());
            pstmt.setString(2, user.getEmail());
            pstmt.setString(3, user.getPassword());
            if (user.getDateOfBirth() != null) {
                pstmt.setDate(4, new java.sql.Date(user.getDateOfBirth().getTime()));
            } else {
                pstmt.setNull(4, Types.DATE);
            }
            pstmt.setTimestamp(5, Timestamp.valueOf(user.getUpdatedAt()));
            pstmt.setString(6, userId.toString());

            int affectedRows = pstmt.executeUpdate();
            if (affectedRows == 0) {
                System.err.println("No user found with ID " + userId + " to update.");
            }
        } catch (SQLException e) {
            System.err.println("Error updating user with ID ("+ userId +"): " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Override
    public void deleteUser(UUID userId) {
        String sql = "DELETE FROM User WHERE id = ?";

        try (Connection conn = DatabaseConnector.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, userId.toString());
            int affectedRows = pstmt.executeUpdate();
            if (affectedRows == 0) {
                System.err.println("No user found with ID " + userId + " to delete.");
            }
        } catch (SQLException e) {
            System.err.println("Error deleting user with ID ("+ userId +"): " + e.getMessage());
            e.printStackTrace();
        }
    }

    private User mapRowToUser(ResultSet rs) throws SQLException {
        UUID id = UUID.fromString(rs.getString("id"));
        String username = rs.getString("username");
        String email = rs.getString("email");
        String password = rs.getString("password");
        Date dateOfBirth = rs.getDate("date_of_birth") != null ? new Date(rs.getDate("date_of_birth").getTime()) : null;
        LocalDateTime createdAt = rs.getTimestamp("created_at").toLocalDateTime();
        LocalDateTime updatedAt = rs.getTimestamp("updated_at").toLocalDateTime();

        return new User(id, username, email, password, dateOfBirth, createdAt, updatedAt);
    }
}
