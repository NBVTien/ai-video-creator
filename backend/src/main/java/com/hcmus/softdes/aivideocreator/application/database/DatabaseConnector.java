package com.hcmus.softdes.aivideocreator.application.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import org.springframework.jdbc.core.JdbcTemplate;

public class DatabaseConnector {
    private static final String DB_URL_ENV = System.getenv("DB_URL");
    private static final String DB_USERNAME_ENV = System.getenv("DB_USERNAME");
    private static final String DB_PASSWORD_ENV = System.getenv("DB_PASSWORD");

    private static final String DEFAULT_DB_URL = "jdbc:mysql://localhost:3307/aivideocreator?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true";
    private static final String DEFAULT_DB_USERNAME = "root";
    private static final String DEFAULT_DB_PASSWORD = "root";

    private static final String URL = (DB_URL_ENV != null && !DB_URL_ENV.isEmpty()) ? DB_URL_ENV : DEFAULT_DB_URL;
    private static final String USER = (DB_USERNAME_ENV != null && !DB_USERNAME_ENV.isEmpty()) ? DB_USERNAME_ENV : DEFAULT_DB_USERNAME;
    private static final String PASSWORD = (DB_PASSWORD_ENV != null && !DB_PASSWORD_ENV.isEmpty()) ? DB_PASSWORD_ENV : DEFAULT_DB_PASSWORD;

    static {
        try {
            // Load the MySQL JDBC driver
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            // Log this error properly in a real application
            System.err.println("MySQL JDBC Driver not found. Add it to your classpath.");
            throw new RuntimeException("MySQL JDBC Driver not found", e);
        }
    }

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}
