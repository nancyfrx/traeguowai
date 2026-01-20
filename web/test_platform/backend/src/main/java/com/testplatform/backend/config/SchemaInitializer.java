package com.testplatform.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Arrays;

@Component
public class SchemaInitializer implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Checking database schema...");
        
        // 1. Create case_types table if not exists
        try {
            jdbcTemplate.execute(
                "CREATE TABLE IF NOT EXISTS case_types (" +
                "id BIGINT AUTO_INCREMENT PRIMARY KEY, " +
                "name VARCHAR(50) NOT NULL UNIQUE)"
            );
            System.out.println("Table 'case_types' checked/created.");
        } catch (Exception e) {
            System.err.println("Error creating case_types table: " + e.getMessage());
        }

        // 2. Seed default types if empty
        try {
            Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM case_types", Integer.class);
            if (count != null && count == 0) {
                List<String> defaults = Arrays.asList(
                    "功能用例", "性能用例", "兼容性用例", "安全用例", "本地化用例", "合规性用例"
                );
                for (String type : defaults) {
                    jdbcTemplate.update("INSERT INTO case_types (name) VALUES (?)", type);
                }
                System.out.println("Seeded default case types.");
            }
        } catch (Exception e) {
            System.err.println("Error seeding case types: " + e.getMessage());
        }

        // 3. Add 'type' column to test_cases if not exists
        try {
            // Check if column exists
            List<String> columns = jdbcTemplate.query(
                "SHOW COLUMNS FROM test_cases LIKE 'type'",
                (rs, rowNum) -> rs.getString("Field")
            );
            
            if (columns.isEmpty()) {
                jdbcTemplate.execute("ALTER TABLE test_cases ADD COLUMN type VARCHAR(50) DEFAULT '功能用例'");
                System.out.println("Added 'type' column to 'test_cases' table.");
            } else {
                System.out.println("Column 'type' already exists in 'test_cases'.");
            }
        } catch (Exception e) {
            System.err.println("Error adding column to test_cases: " + e.getMessage());
        }

        // 4. Ensure ai_generation_record table exists and has correct columns
        try {
            jdbcTemplate.execute(
                "CREATE TABLE IF NOT EXISTS ai_generation_record (" +
                "id BIGINT AUTO_INCREMENT PRIMARY KEY, " +
                "input_content TEXT, " +
                "generated_content TEXT, " +
                "upload_file_name VARCHAR(255), " +
                "model VARCHAR(50), " +
                "operator VARCHAR(50), " +
                "created_at DATETIME)"
            );
            System.out.println("Table 'ai_generation_record' checked/created.");
            
            // Check for input_content column specifically (in case table existed but column didn't)
            List<String> aiColumns = jdbcTemplate.query(
                "SHOW COLUMNS FROM ai_generation_record LIKE 'input_content'",
                (rs, rowNum) -> rs.getString("Field")
            );
            
            if (aiColumns.isEmpty()) {
                jdbcTemplate.execute("ALTER TABLE ai_generation_record ADD COLUMN input_content TEXT");
                System.out.println("Added 'input_content' column to 'ai_generation_record' table.");
            }
        } catch (Exception e) {
             System.err.println("Error checking/creating ai_generation_record table: " + e.getMessage());
        }
    }
}
