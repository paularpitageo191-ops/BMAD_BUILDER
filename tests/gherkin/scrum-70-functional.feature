@SCRUM-70 @Forensic-AEGIS-2026-MAY-E84D
Feature: Negative Path Validation for DemoQA Elements Module

  Background:
    Given the user navigates to the DemoQA application

  @AC1
  Scenario: Validate email validation on text box
    Given the user is on the Text Box page
    When the user enters an invalid email "<invalid_email>" into the email field
    And clicks the Submit button
    Then the validation error class is present on the #userEmail element
    And the #output section is not displayed

    Examples:
      | invalid_email       |
      | test@domain         |
      | test@.com           |
      | @example.com        |
      | test@domain.        |
      | abc                 |
      |                     |

  @AC2
  Scenario: Validate non-numeric values in age/salary block submission
    Given the user is on the Web Tables page
    When the user clicks the Add button to open the registration modal
    And enters "<non_numeric>" in the Age field
    And enters "<non_numeric>" in the Salary field
    And clicks Submit in the modal
    Then the registration modal remains open
    And the new record is not added to the table

    Examples:
      | non_numeric |
      | abc         |
      | 12ab        |
      | @#$%        |
      |             |

  @AC3
  Scenario: Validate radio button disabled state for "No" option
    Given the user is on the Radio Button page
    When the user attempts to click the "No" radio button (#noRadio)
    Then the #noRadio element remains disabled
    And no success message is displayed for the "No" option

  @AC4
  Scenario: Verify UI stability under overlay obstruction
    Given the user is on the Buttons page
    When an overlay is placed over the page
    And the user attempts to click the "Click Me" button using scroll and force click
    Then the button click succeeds and the dynamic click message appears
    And the page remains stable without errors