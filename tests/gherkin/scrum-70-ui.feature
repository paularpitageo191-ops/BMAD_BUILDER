Feature: Negative Path Validation for DemoQA Elements Module
  As a QA Engineer
  I want to validate negative scenarios in the Elements module
  So that invalid inputs are handled correctly and the UI remains stable under edge conditions

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-E63D
  Scenario: Email Validation - Invalid email blocks output display
    Given I am on the Text Box page
    When I enter an invalid email "test@domain" into #userEmail
    And I click the submit button
    Then a validation error appears on #userEmail
    And the output section #output is not displayed

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-E63D
  Scenario: Web Tables - Non-numeric Age/Salary blocks submission
    Given I am on the Web Tables page
    When I click the Add button to open the registration modal
    And I fill the registration form with non-numeric Age "abc" and Salary "12ab"
    And I click the Submit button
    Then the registration modal remains open
    And no new row is added to the table

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-E63D
  Scenario: Radio Button - Disabled "No" option remains unchanged
    Given I am on the Radio Button page
    When I locate #noRadio
    Then #noRadio should be disabled
    When I click #noRadio
    Then #noRadio remains disabled
    And no change in state is observed

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-E63D
  Scenario: UI Stability - Elements remain interactable under obstruction
    Given I am on the Text Box page
    When a fixed overlay is placed over the page
    Then I can scroll to and click the submit button
    And the page remains stable and interactable