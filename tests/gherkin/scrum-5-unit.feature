Feature: Customer Onboarding Compliance Validation
  As a compliance officer
  I want to validate customer onboarding data against KYC/KRA and SEC requirements
  So that only compliant users are onboarded

  @SCRUM-5 @Forensic-AEGIS-2026-MAY-04C7
  Scenario: Successful onboarding with valid data (AC1)
    Given the user submits complete and valid onboarding details
    When KYC and KRA validations pass
    And SEC compliance checks are satisfied
    Then the user should be successfully onboarded
    And a confirmation message should be displayed

  @SCRUM-5 @Forensic-AEGIS-2026-MAY-04C7
  Scenario: KYC validation failure - missing PAN (AC2)
    Given the user submits onboarding details with missing PAN
    When the system validates the documents
    Then onboarding should be rejected
    And an error message should indicate "PAN is required"

  @SCRUM-5 @Forensic-AEGIS-2026-MAY-04C7
  Scenario: KYC validation failure - invalid Aadhaar format (AC2 boundary)
    Given the user submits onboarding details with Aadhaar "1234-5678-9012"
    When the system validates the documents
    Then onboarding should be rejected
    And an error message should indicate "Invalid Aadhaar format"

  @SCRUM-5 @Forensic-AEGIS-2026-MAY-04C7
  Scenario: KRA verification failure (AC3)
    Given the user submits valid KYC but KRA registry returns no match
    When the system checks KRA registry
    Then onboarding should be blocked
    And the user should be notified "KRA verification failed"

  @SCRUM-5 @Forensic-AEGIS-2026-MAY-04C7
  Scenario: SEC compliance rule violation (AC4)
    Given the user violates SEC regulatory conditions by missing disclosures
    When compliance checks run
    Then onboarding should be denied
    And a compliance failure reason should be logged

  @SCRUM-5 @Forensic-AEGIS-2026-MAY-04C7
  Scenario: Audit logging of onboarding attempt (AC5)
    Given any onboarding attempt
    When validation occurs
    Then all results (pass/fail) should be logged
    And logs should include timestamp, rule applied, and outcome

  @SCRUM-5 @Forensic-AEGIS-2026-MAY-04C7
  Scenario: Duplicate onboarding attempt (edge case)
    Given a user has already been onboarded with the same PAN
    When a duplicate onboarding attempt is made
    Then onboarding should be rejected
    And an error message should indicate "Duplicate onboarding detected"