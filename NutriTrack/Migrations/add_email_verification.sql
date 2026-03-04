-- Email verification oszlopok hozzáadása a users táblához
ALTER TABLE users
    ADD COLUMN email_verification_token VARCHAR(255) NULL DEFAULT NULL,
    ADD COLUMN verification_token_expiry DATETIME NULL DEFAULT NULL;
