@SCRUM-70 @Forensic-AEGIS-2026-MAY-B831
Feature: Negative Path Validation for DemoQA Elements Module

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-B831 @AC1
  Scenario: Invalid email submission shows validation error and hides output section
    Given I am on the Text Box page of the Elements module
    When I enter invalid email "test@domain" into the email field
    And I click the submit button
    Then the email field shows a validation error
    And the output section #output is not visible

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-B831 @AC2
  Scenario: Non-numeric Age and Salary block Web Tables submission and modal remains open
    Given I am on the Web Tables page of the Elements module
    When I click the "Add" button to open the registration modal
    And I enter non-numeric values in the Age field ("abc") and Salary field ("12ab")
    And I fill mandatory text fields with valid data
    And I click the Submit button in the modal
    Then the registration modal remains visible
    And the form is still open for correction

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-B831 @AC3
  Scenario: Disabled "No" radio button cannot be clicked and remains disabled
    Given I am on the Radio Button page of the Elements module
    Then the "No" radio button (#noRadio) is disabled
    When I attempt to click the disabled "No" radio button
    Then the radio button remains disabled
    And no state change occurs (e.g., selected option text does not update)

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-B831 @AC4
  Scenario: UI elements remain interactable under overlay obstruction
    Given I am on the Radio Button page of the Elements module
    And an overlay covers the entire page
    When I scroll the "Yes" radio button into view and click it
    Then the "Yes" radio button becomes selected
    And the page content remains stable