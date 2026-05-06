Feature: Negative Path Validation for DemoQA Elements Module
  As a QA Engineer
  I want to validate negative scenarios in the Elements module
  so that invalid inputs are handled correctly and the UI remains stable under edge conditions.

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-7EA9
  Scenario: AC1 – Email validation rejects invalid inputs
    Given I navigate to the Text Box page
    When I fill "Email" with "test@domain" and submit
    Then I see a validation error on the email input
    And the output section is not displayed

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-7EA9
  Scenario: AC2 – Web Tables blocks non-numeric Age and Salary
    Given I navigate to the Web Tables page
    And I open the registration modal
    When I fill "Age" with "abc" and "Salary" with "12ab"
    And I attempt to submit the registration form
    Then the registration modal remains open
    And no new record is added to the table

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-7EA9
  Scenario: AC3 – Radio Button "No" remains disabled
    Given I navigate to the Radio Button page
    Then the "No" radio button is disabled
    When I click on the "No" radio button
    Then the button remains disabled
    And no feedback message appears

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-7EA9
  Scenario: AC4 – UI remains stable under overlay obstruction
    Given I navigate to the Text Box page
    When I inject an overlay element covering the page
    And I scroll the "Full Name" input into view
    Then I can interact with the "Full Name" input
    And the page does not crash