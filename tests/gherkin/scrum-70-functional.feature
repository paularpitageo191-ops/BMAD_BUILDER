Feature: Negative Path Validation for DemoQA Elements Module

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-DABE
  Scenario: AC1 - Email validation rejects invalid input
    Given I am on the Text Box page
    When I enter an invalid email "test@domain" into the "#userEmail" field
    And I click outside the field to trigger validation
    Then a validation error is visible on the "#userEmail" field
    And the "#output" section is not displayed

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-DABE
  Scenario: AC2 - Web Tables blocks non-numeric Age and Salary
    Given I am on the Web Tables page
    When I click the "Add" button to open the registration modal
    And I enter the following invalid data:
      | First Name | Last Name | Email | Age | Salary | Department |
      | John | Doe | j@doe.com | abc | 12ab | Engineering |
    And I click the "Submit" button inside the modal
    Then the registration modal remains open
    And the Age field shows a validation error
    And the Salary field shows a validation error

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-DABE
  Scenario: AC3 - "No" radio button is disabled and non-interactive
    Given I am on the Radio Button page
    Then the "#noRadio" option should be disabled
    When I attempt to click the "#noRadio" option
    Then the "#noRadio" option remains disabled and unselected

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-DABE
  Scenario: AC4 - UI remains interactable under an overlay obstruction
    Given I am on the Text Box page
    When an overlay covers the top half of the form
    Then I can scroll to the "Full Name" field and type into it
    And I can still type into the "#userEmail" field
    And the overlay does not affect element availability