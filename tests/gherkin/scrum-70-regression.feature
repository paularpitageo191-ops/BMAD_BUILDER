@SCRUM-70 @Forensic-AEGIS-2026-MAY-2ACD
Feature: Negative Path Validation for DemoQA Elements Module
  As a QA Engineer
  I want to validate negative scenarios in the Elements module
  so that invalid inputs are handled correctly and the UI remains stable under edge conditions

  Background:
    Given I am on the DemoQA Elements page

  @SCRUM-70 @AC1
  Scenario: Email validation rejects invalid input and hides output section
    Given I am on the Text Box section
    When I enter an invalid email "<invalid_email>" in the #userEmail field
    And I click the submit button
    Then a validation error is visible on the #userEmail field
    And the #output section is not displayed

    Examples:
      | invalid_email       |
      | test@domain         |
      | test@domain.        |
      | test@               |
      | @domain.com         |
      | plainaddress        |

  @SCRUM-70 @AC2
  Scenario: Web Tables blocks submission on non-numeric Age or Salary
    Given I am on the Web Tables section
    When I click the Add button to open the registration modal
    And I enter "<age>" in the Age field and "<salary>" in the Salary field
    And I click the Submit button in the modal
    Then the registration modal remains open
    And the form is not submitted

    Examples:
      | age  | salary |
      | abc  | 50000  |
      | 30   | 12ab   |
      |      | 50000  |
      | 30   |        |

  @SCRUM-70 @AC3
  Scenario: Radio Button "No" option is disabled and non-interactable
    Given I am on the Radio Button section
    Then the #noRadio element is disabled
    When I click on the #noRadio option
    Then the #noRadio element remains disabled
    And no change in radio button state occurs

  @SCRUM-70 @AC4
  Scenario: UI remains stable and elements interactable under overlay obstruction
    Given I am on the Text Box section
    When an overlay is placed covering the form
    And I scroll to the #userEmail field
    Then the #userEmail field is interactable via visibility handling
    When I enter a valid email address in the #userEmail field
    And I click the submit button
    Then the #output section is displayed with the entered data