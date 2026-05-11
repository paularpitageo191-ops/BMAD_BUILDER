@SCRUM-70 @Forensic-AEGIS-2026-MAY-0E05
Feature: Negative Path Validation for DemoQA Elements Module
  As a QA Engineer
  I want to validate negative scenarios in the Elements module
  So that invalid inputs are handled correctly and the UI remains stable under edge conditions

  @SCRUM-70
  Scenario: AC1 – Invalid email shows validation error and no output
    Given I am on the Text Box page of DemoQA
    When I enter an invalid email "<invalidEmail>" into the email field
    And I click the Submit button
    Then I should see a validation error on the email field
    And the output section should not be displayed
    Examples:
      | invalidEmail        |
      | test@domain         |
      | user@.com           |
      | @domain.com         |
      | email@domain,com    |

  @SCRUM-70
  Scenario: AC2 – Non-numeric Age/Salary blocks submission and modal stays open
    Given I am on the Web Tables page of DemoQA
    When I click the Add button to open the registration modal
    And I fill the form with non-numeric Age "<age>" and Salary "<salary>"
    And I click the Submit button in the modal
    Then the registration modal should remain open
    And the form should not be submitted
    Examples:
      | age   | salary |
      | abc   | 12ab   |
      | 12ab  | 50000  |
      | 25    | abc    |

  @SCRUM-70
  Scenario: AC3 – Disabled "No" radio button does not change state when clicked
    Given I am on the Radio Button page of DemoQA
    Then the "No" option should be disabled
    When I attempt to click the "No" radio button
    Then its state should remain unchanged (still disabled and not selected)

  @SCRUM-70
  Scenario: AC4 – UI remains stable and elements interactable under overlay obstruction
    Given I am on the Text Box page of DemoQA
    When I create a fixed overlay covering the page
    And I scroll to the full name input field and click it
    Then the input field should receive focus and I can type into it
    And the page should not crash or freeze