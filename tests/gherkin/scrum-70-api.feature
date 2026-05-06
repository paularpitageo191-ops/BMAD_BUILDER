Feature: Negative Path Validation for DemoQA Elements Module
  As a QA Engineer
  I want to validate negative scenarios in the Elements module
  So that invalid inputs are handled correctly and the UI remains stable under edge conditions

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-7EA9 @AC1
  Scenario: Invalid email input triggers validation error and no output section
    Given the Text Box page is loaded
    When the user enters an invalid email format "test@domain" into the "userEmail" field
    And presses the "Submit" button
    Then the "userEmail" field should have validation error styling (e.g., class "is-invalid")
    And the output section with id "output" should not be visible

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-7EA9 @AC2
  Scenario Outline: Non-numeric values in Age or Salary fields block registration submission
    Given the Web Tables page is loaded
    When the user clicks the "Add" button to open the registration modal
    And enters "<input>" into the "<field>" field in the registration modal
    And clicks the "Submit" button in the modal
    Then the registration modal should remain open
    And the registration table should not contain the new record with "<input>" in the "<field>" column

    Examples:
      | field  | input        |
      | age    | abc          |
      | age    | 12ab         |
      | salary | xyz          |
      | salary | 45$          |

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-7EA9 @AC3
  Scenario: "No" radio button remains disabled and does not change state on click
    Given the Radio Button page is loaded
    When the user attempts to click the "No" radio button identified by "#noRadio"
    Then the "#noRadio" element should remain disabled
    And the "#noRadio" element should not have the "selected" visual state (e.g., class "active")

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-7EA9 @AC4
  Scenario: UI remains stable under obstruction (overlay) and elements remain interactable
    Given the Radio Button page is loaded
    And an overlay covering the entire page is added
    When the user scrolls to the "Yes" radio button and waits for it to be visible
    And clicks the "Yes" radio button
    Then the click should succeed without visible errors
    And the page layout should remain stable (no overlapping of elements)