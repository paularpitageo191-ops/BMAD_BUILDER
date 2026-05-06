@SCRUM-5 @Forensic-AEGIS-2026-MAY-04C7
Feature: Customer Onboarding with KYC/KRA & SEC Compliance Validation

  Background:
    Given the user is on the onboarding form page

  @AC1 @positive
  Scenario: Successful onboarding with valid data
    Given the user enters valid PAN "ABCDE1234F"
    And the user enters valid Aadhaar "1234 5678 9012"
    And the user uploads all required KYC documents
    And the system successfully verifies KYC
    And the system successfully verifies KRA
    And the system passes all SEC compliance checks
    When the user submits the onboarding form
    Then the onboarding is successful
    And a confirmation message "Onboarding complete. Welcome!" is displayed
    And the audit log records a "PASS" for all validation rules

  @AC2 @negative
  Scenario: KYC validation failure due to missing PAN
    Given the user leaves the PAN field empty
    And the user enters valid Aadhaar "1234 5678 9012"
    And the user uploads all required KYC documents
    When the user submits the onboarding form
    Then the onboarding is rejected
    And an error message indicates "PAN is required"

  @AC2 @negative
  Scenario: KYC validation failure due to invalid Aadhaar format
    Given the user enters valid PAN "ABCDE1234F"
    And the user enters invalid Aadhaar "1111 2222 3333"
    And the user uploads all required KYC documents
    When the user submits the onboarding form
    Then the onboarding is rejected
    And an error message indicates "Invalid Aadhaar format"

  @AC3 @negative
  Scenario: KRA verification failure
    Given the user enters valid PAN "ABCDE1234F"
    And the user enters valid Aadhaar "1234 5678 9012"
    And the user uploads all required KYC documents
    And KYC verification passes
    But the KRA registry does not find the user
    When the user submits the onboarding form
    Then the onboarding is blocked
    And a notification "KRA verification failed. User not found in KRA registry." is displayed

  @AC4 @negative
  Scenario: SEC compliance rule violation - missing disclosure
    Given the user enters valid PAN "ABCDE1234F"
    And the user enters valid Aadhaar "1234 5678 9012"
    And the user uploads all required KYC documents
    And KYC and KRA verifications pass
    But the user has not provided the required SEC disclosure statement
    When the user submits the onboarding form
    Then the onboarding is denied
    And a compliance failure reason "SEC disclosure missing" is logged

  @AC5 @audit
  Scenario: Audit logging for a failed onboarding attempt
    Given the user enters invalid PAN "12345"
    When the user submits the onboarding form
    Then the audit log contains an entry with timestamp, rule "PAN validation", and outcome "FAIL"

  @edge @boundary
  Scenario: Boundary value for PAN - exactly 10 characters
    Given the user enters PAN "ABCDE1234F"
    When the system validates the PAN format
    Then the PAN is accepted

  @edge @boundary
  Scenario: Boundary value for PAN - less than 10 characters
    Given the user enters PAN "ABCDE123"
    When the system validates the PAN format
    Then an error indicates "PAN must be 10 characters"

  @edge @partial
  Scenario: Partial document upload
    Given the user uploads only one of the two required KYC documents
    When the user submits the onboarding form
    Then the onboarding is rejected
    And an error message indicates "Please upload all required documents"

  @edge @duplicate
  Scenario: Duplicate onboarding attempt
    Given the user has already been onboarded with PAN "ABCDE1234F"
    And the user attempts to submit the same PAN again
    When the user submits the onboarding form
    Then the onboarding is rejected
    And an error message indicates "User already onboarded"

  @edge @timeout
  Scenario: Timeout in KRA verification
    Given the user enters valid PAN "ABCDE1234F"
    And the user enters valid Aadhaar "1234 5678 9012"
    And KYC verification passes
    But the KRA verification service times out
    When the user submits the onboarding form
    Then the onboarding is blocked
    And a notification "KRA verification service unavailable. Please try again later." is displayed