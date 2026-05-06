Feature: Negative Path Validation for DemoQA Elements Module
  @SCRUM-70 @Forensic-AEGIS-2026-MAY-DABE
  Scenario: AC1 - Email validation rejects invalid email and hides output
    Given I am on the DemoQA Text Box page
    When I enter an invalid email "test@domain" into the email field
    And I click the submit button
    Then I should see a validation error on the #userEmail field
    And the output section #output should not be displayed

  Scenario: AC2 - Web Tables reject non-numeric Age/Salary
    Given I am on the DemoQA Web Tables page
    When I click the "Add" button to open registration modal
    And I enter non-numeric values in Age and Salary fields
    And I click the submit button in the modal
    Then the registration modal should remain open
    And the record should not be added to the table

  Scenario: AC3 - "No" radio button remains disabled
    Given I am on the DemoQA Radio Buttons page
    Then the "No" radio button should be disabled
    When I attempt to click the "No" radio button
    Then the "No" radio button should still be disabled
    And no state change should occur

  Scenario: AC4 - UI remains stable under overlay obstruction
    Given I am on a DemoQA page with an overlay element
    When the overlay is present
    Then elements should remain interactable via scroll or visibility handling
    And the page layout should not break