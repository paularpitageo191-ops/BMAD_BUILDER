Feature: Negative Path Validation for DemoQA Elements Module

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-B831
  Scenario Outline: Email Validation - Invalid email formats
    Given the user is on the Text Box page
    When the user enters an invalid email "<email>" and clicks Submit
    Then the email field shows a validation error
    And the output section is not displayed

    Examples:
      | email           |
      | test@domain     |
      | test@.com       |
      | @domain.com     |
      | test@domain,com |

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-B831
  Scenario Outline: Web Tables - Non-numeric Age/Salary values
    Given the user is on the Web Tables page
    When the user opens the registration form and enters "<field>" value "<value>"
    And clicks Submit
    Then the registration form remains open
    And no new record is added to the table

    Examples:
      | field  | value |
      | Age    | abc   |
      | Age    | 12ab  |
      | Salary | abc   |
      | Salary | 12ab  |

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-B831
  Scenario: Radio Button - Disabled "No" option
    Given the user is on the Radio Button page
    When the user attempts to click the "No" radio button
    Then the "No" radio button remains disabled
    And no selection change occurs

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-B831
  Scenario: UI Stability under overlay obstruction
    Given the user is on the Text Box page
    When an overlay is placed over the page
    And the user scrolls to the Submit button and clicks it
    Then the page remains stable and no error state is triggered
    And elements remain interactable without breakage