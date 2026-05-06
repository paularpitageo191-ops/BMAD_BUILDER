Feature: Customer Onboarding with KYC/KRA & SEC Compliance Validation
  As a compliance officer
  I want the system to validate customer onboarding data against KYC/KRA requirements and SEC regulatory guidelines
  So that only compliant users are successfully onboarded and regulatory risks are minimized

  @SCRUM-5 @Forensic-AEGIS-2026-MAY-04C7
  Scenario: AC1 - Successful onboarding with valid data
    Given a user submits complete and valid onboarding details
    When KYC and KRA validations pass
    And SEC compliance checks are satisfied
    Then the user should be successfully onboarded
    And a confirmation message should be displayed

  @SCRUM-5 @Forensic-AEGIS-2026-MAY-04C7
  Scenario: AC2 - KYC validation failure due to missing PAN
    Given a user submits onboarding details missing PAN
    When the system validates the KYC documents
    Then onboarding should be rejected
    And an error message should indicate the specific issue "PAN is required"

  @SCRUM-5 @Forensic-AEGIS-2026-MAY-04C7
  Scenario: AC2 - KYC validation failure due to invalid Aadhaar format
    Given a user submits onboarding details with an invalid Aadhaar number
    When the system validates the KYC documents
    Then onboarding should be rejected
    And an error message should indicate the specific issue "Invalid Aadhaar format"

  @SCRUM-5 @Forensic-AEGIS-2026-MAY-04C7
  Scenario: AC3 - KRA verification failure
    Given a user submits valid KYC details
    When the system checks the KRA registry
    And the KRA record is not found
    Then onboarding should be blocked
    And the user should be notified with "KRA verification failed"

  @SCRUM-5 @Forensic-AEGIS-2026-MAY-04C7
  Scenario: AC4 - SEC compliance rule violation (missing disclosures)
    Given a user submits onboarding details missing SEC disclosures
    When compliance checks run
    Then onboarding should be denied
    And a compliance failure reason should be logged with "Missing required disclosures"

  @SCRUM-5 @Forensic-AEGIS-2026-MAY-04C7
  Scenario: AC5 - Audit logging for successful onboarding
    Given a user submits valid onboarding details
    When validation occurs
    Then all results should be logged
    And logs should include timestamp, rule applied, and outcome

  @SCRUM-5 @Forensic-AEGIS-2026-MAY-04C7
  Scenario: AC5 - Audit logging for failed onboarding
    Given a user submits invalid onboarding details
    When validation occurs
    Then all results should be logged
    And logs should include timestamp, rule applied, and outcome

  @SCRUM-5 @Forensic-AEGIS-2026-MAY-04C7
  Scenario: Edge - Boundary values for ID formats
    Given a user submits Aadhaar with exactly 12 digits
    When the system validates the document format
    Then the validation should pass
    And the onboarding should proceed if other checks pass

  @SCRUM-5 @Forensic-AEGIS-2026-MAY-04C7
  Scenario: Edge - Partial document upload
    Given a user uploads only one of two required documents
    When the system validates the documents
    Then onboarding should be rejected
    And an error message should indicate incomplete document submission

  @SCRUM-5 @Forensic-AEGIS-2026-MAY-04C7
  Scenario: Edge - Duplicate onboarding attempt
    Given a user has already been onboarded with the same PAN
    When the system checks for duplicates
    Then the duplicate boarding attempt should be rejected
    And an error message should indicate duplicate user

  @SCRUM-5 @Forensic-AEGIS-2026-MAY-04C7
  Scenario: Edge - Timeout in KRA verification
    Given a user submits valid KYC details
    When the KRA verification service times out
    Then onboarding should be blocked
    And a timeout error should be logged and reported to the user