Feature: Negative Path Validation for DemoQA Elements Module
  As a QA Engineer
  I want to validate negative scenarios in the Elements module
  So that invalid inputs are handled correctly and the UI remains stable

  Background: User navigates to DemoQA Elements pages

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-4F8A
  Scenario: AC1 – Email Validation – Invalid email shows validation error and no output
    Given I am on the Text Box page
    When I enter an invalid email "test@domain" into the email field
    And I click the Submit button
    Then I should see a validation error on the email field
    And the output section should not be displayed

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-4F8A
  Scenario: AC2 – Web Tables Validation – Non-numeric Age/Salary blocks submission
    Given I am on the Web Tables page
    When I click the Add button to open the registration modal
    And I enter "abc" in the Age field and "12ab" in the Salary field
    And I click the Submit button in the modal
    Then the registration modal should remain open
    And validation should block the submission

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-4F8A
  Scenario: AC3 – Radio Button Validation – Disabled "No" option remains unclickable
    Given I am on the Radio Button page
    When I attempt to click the "No" radio button
    Then the "No" radio button should remain disabled
    And no state change should occur

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-4F8A
  Scenario: AC4 – UI Stability – Overlay does not break element interactability
    Given I am on a DemoQA Elements page
    When an overlay is present
    Then I can still interact with the underlying elements via scroll and visibility handling