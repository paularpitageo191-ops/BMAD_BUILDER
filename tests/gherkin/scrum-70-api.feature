Feature: Negative Path Validation for DemoQA Elements Module

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-E8F8
  Scenario: Email validation rejects invalid input
    Given the user is on the Text Box page
    When the user enters an invalid email format "test@domain" in the email field
    And clicks the submit button
    Then the email field should show a validation error
    And the output section should not be displayed

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-E8F8
  Scenario: Web Tables blocks non-numeric values for Age and Salary
    Given the user is on the Web Tables page
    When the user clicks the "Add" button to open registration form
    And enters non-numeric values in the Age and Salary fields
    And clicks the "Submit" button
    Then the registration modal should remain open
    And the Age and Salary fields should show validation errors

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-E8F8
  Scenario: Radio Button 'No' option remains disabled
    Given the user is on the Radio Button page
    When the user attempts to click the "No" radio button
    Then the "No" radio button should remain disabled
    And its state should not change

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-E8F8
  Scenario: UI remains stable under overlay obstruction
    Given the user is on the Text Box page
    When an overlay is placed over the page
    Then the user should be able to scroll the email field into view and interact with it