@SCRUM-5 @Forensic-AEGIS-2026-MAY-04C7
Feature: Customer Onboarding with KYC/KRA & SEC Compliance Validation
  As a compliance officer
  I want the system to validate customer onboarding data against KYC/KRA requirements and SEC regulatory guidelines
  So that only compliant users are successfully onboarded

  Background:
    Given the user is on the customer onboarding page

  @SCRUM-5 @AC1 @positive
  Scenario: Successful onboarding with valid data
    When the user fills all mandatory fields with valid data:
      | field         | value            |
      | PAN           | ABCDE1234F       |
      | Aadhaar       | 123456789012     |
      | Full Name     | John Doe         |
      | Document File | valid_doc.pdf    |
    And the user agrees to SEC disclosure terms
    And the system validates KYC documents successfully
    And the KRA verification succeeds
    And the SEC compliance checks pass
    Then the user should be successfully onboarded
    And a confirmation message "Onboarding successful" should be displayed

  @SCRUM-5 @AC2 @negative
  Scenario: Missing PAN causes KYC validation failure
    When the user fills mandatory fields except PAN
      | field         | value        |
      | Aadhaar       | 123456789012 |
      | Full Name     | Jane Roe     |
    And the user attempts to submit
    Then the onboarding request should be rejected
    And an error message "PAN is required" should be displayed

  @SCRUM-5 @AC2 @negative
  Scenario: Invalid Aadhaar format causes KYC validation failure
    When the user fills all mandatory fields with invalid Aadhaar
      | field         | value        |
      | PAN           | ABCDE1234F   |
      | Aadhaar       | ABCD123456   |
      | Full Name     | Jane Roe     |
    And the user attempts to submit
    Then the onboarding request should be rejected
    And an error message "Invalid Aadhaar format" should be displayed

  @SCRUM-5 @AC3 @negative
  Scenario: KRA verification failure blocks onboarding
    When the user fills all mandatory fields with valid data
      | field         | value         |
      | PAN           | ABCDE1234F    |
      | Aadhaar       | 123456789012  |
      | Full Name     | Jim Brown     |
    And the user agrees to SEC disclosure terms
    And the KYC validation succeeds
    But the KRA verification fails with no record found
    Then the onboarding should be blocked
    And a notification "KRA verification failed: user not found in registry" should be shown

  @SCRUM-5 @AC4 @negative
  Scenario: SEC compliance rule violation due to missing disclosures
    When the user fills all mandatory fields with valid data
      | field         | value         |
      | PAN           | ABCDE1234F    |
      | Aadhaar       | 123456789012  |
      | Full Name     | Alice Smith   |
    And the user does not agree to SEC disclosure terms
    And the KYC validation succeeds
    And the KRA verification succeeds
    But the SEC compliance check fails
    Then the onboarding should be denied
    And a compliance failure reason "SEC disclosure not accepted" should be logged and displayed

  @SCRUM-5 @AC5 @audit
  Scenario: All validations are logged for audit
    When the user submits any onboarding attempt
    Then an audit log entry should be created with timestamp, rule applied, and outcome

  @SCRUM-5 @edge @boundary
  Scenario: Boundary values for PAN length
    When the user fills PAN with exactly 10 characters "ABCDE1234F"
    And all other data is valid
    Then the validation should pass

  @SCRUM-5 @edge @boundary
  Scenario: Boundary values for Aadhaar length
    When the user fills Aadhaar with exactly 12 digits "123456789012"
    And all other data is valid
    Then the validation should pass

  @SCRUM-5 @edge @partial-upload
  Scenario: Partial document upload leads to rejection
    When the user does not upload any mandatory document
    And attempts to submit
    Then the onboarding should be rejected
    And an error message "Mandatory document missing" should be displayed

  @SCRUM-5 @edge @duplicate
  Scenario: Duplicate onboarding attempt is rejected
    When the user submits a duplicate onboarding request with the same PAN
    Then the system should reject the attempt
    And display a message "Duplicate onboarding detected"

  @SCRUM-5 @edge @timeout
  Scenario: Timeout in KRA verification is handled gracefully
    When the KRA verification service takes longer than the timeout threshold
    Then the system should show a timeout error and allow retry
    And the user should not be onboarded