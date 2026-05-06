@SCRUM-70 @Forensic-AEGIS-2026-MAY-DABE
Feature: Negative Path Validation for DemoQA Elements Module
  As a QA Engineer
  I want to validate negative scenarios in the Elements module
  so that invalid inputs are handled correctly and the UI remains stable under edge conditions.

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-DABE
  Scenario: Email Validation rejects invalid format and hides output
    Given the user is on the "Text Box" page
    When the user enters "<invalidEmail>" in the email field
    And the user clicks the "Submit" button
    Then the email field shows a validation error
    And the output section is not displayed

    Examples:
      | invalidEmail         |
      | test@domain          |
      | user@.com            |
      | @example.com         |
      | 123@456              |
      |                      |

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-DABE
  Scenario: Web Tables rejects non-numeric values in Age/Salary
    Given the user is on the "Web Tables" page
    When the user opens the registration modal
    And the user fills the Age field with "<invalidAge>"
    And the user fills the Salary field with "<invalidSalary>"
    And the user clicks the "Submit" button in the modal
    Then the registration modal remains open
    And the Age or Salary field shows a validation error

    Examples:
      | invalidAge | invalidSalary |
      | abc        | 12ab          |
      | 12.5       | $1000         |
      | -5         | 0             |

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-DABE
  Scenario: Radio Button "No" option remains disabled
    Given the user is on the "Radio Button" page
    Then the "No" radio button is disabled
    When the user clicks the "No" radio button
    Then the "No" radio button remains disabled
    And no radio state change occurs

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-DABE
  Scenario: UI remains stable under overlay obstruction
    Given the user is on the "Web Tables" page
    When the user opens the registration modal
    Then the modal overlay is displayed
    And the user can scroll the page behind the overlay
    And the registration modal remains open and interactable