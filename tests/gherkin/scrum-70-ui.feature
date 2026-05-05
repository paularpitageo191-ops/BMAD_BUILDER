Feature: Negative Path Validation for DemoQA Elements Module
  As a QA Engineer
  I want to validate negative scenarios in the Elements module
  So that invalid inputs are handled correctly and the UI remains stable under edge conditions.

  Background:
    Given I open the DemoQA Elements application base URL

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-C711
  Scenario: AC1 – Email validation rejects invalid input and hides output
    Given I am on the "Text Box" page
    When I fill the "Full Name" field with "John Doe"
    And I fill the "Email" field with "test@domain"
    And I submit the form
    Then the email input field should show a validation error
    And the output section should not be displayed

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-C711
  Scenario: AC2 – Web Tables blocks non-numeric age and salary
    Given I am on the "Web Tables" page
    When I click the "Add" button to open the registration modal
    And I fill "First Name" with "Jane"
    And I fill "Last Name" with "Doe"
    And I fill "Email" with "jane@example.com"
    And I fill "Age" with "abc"
    And I fill "Salary" with "12ab"
    And I fill "Department" with "QA"
    And I submit the registration form
    Then the registration modal should remain open
    And no new row should appear in the web table

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-C711
  Scenario: AC3 – Radio Button "No" option remains disabled and unresponsive
    Given I am on the "Radio Button" page
    When I inspect the "No" radio button
    Then the "No" radio button should be disabled
    When I attempt to click the "No" radio button using force
    Then the button should still be disabled
    And no success message should appear
    And no other radio button should become selected

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-C711
  Scenario: AC4 – UI remains stable under overlay obstruction
    Given I am on the "Web Tables" page
    When I artificially obstruct the page with a full-screen overlay
    And I wait briefly for the obstruction
    Then the "Add" button should be clickable via scrolling and forced visibility
    And the registration modal should open after clicking the "Add" button