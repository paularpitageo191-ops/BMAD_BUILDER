Feature: Negative Path Validation for DemoQA Elements Module
  @SCRUM-70 @Forensic-AEGIS-2026-MAY-C488
  Scenario Outline: Email Validation
    Given the email input field is empty
    When I enter an invalid email "<invalidEmail>"
    Then the validation error message should be displayed on "#userEmail"
    And the output section "#output" should not be displayed

  Examples:
    | invalidEmail |
    | test@domain  |
    | missing TLD |

  Scenario Outline: Web Tables Validation
    Given the Age and Salary fields are numeric
    When I enter non-numeric values for Age and Salary "<nonNumericValues>"
    Then submission is blocked
    And the registration modal remains open

  Examples:
    | nonNumericValues      |
    | abc                   |
    | 12ab                  |

  Scenario Outline: Radio Button Validation
    Given the "No" radio button is disabled
    When I click on the "No" radio button "<noRadio>"
    Then the state should not change

  Examples:
    | noRadio     |
    | #noRadio     |

  Scenario Outline: UI Stability
    Given the application is stable under obstruction (e.g., overlays)
    When I interact with elements using scroll and visibility handling
    Then the UI remains stable