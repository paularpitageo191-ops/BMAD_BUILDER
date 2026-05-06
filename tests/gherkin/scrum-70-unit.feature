Feature: Negative Path Validation for DemoQA Elements Module
  As a QA Engineer
  I want to validate negative scenarios in the Elements module
  So that invalid inputs are handled correctly and the UI remains stable under edge conditions

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-C488
  Scenario: AC1 - Invalid email triggers validation error and no output section
    Given the user navigates to the Text Box page on DemoQA
    When the user enters an invalid email "test@domain" in the email field
    And the user clicks the Submit button
    Then a validation error is displayed on the #userEmail field
    And the #output section is not visible

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-C488
  Scenario: AC2 - Non-numeric Age/Salary blocks submission in Web Tables
    Given the user navigates to the Web Tables page on DemoQA
    When the user clicks the Add button to open the registration modal
    And the user enters invalid data: First Name "John", Last Name "Doe", Email "john@example.com", Age "abc", Salary "12ab", Department "QA"
    And the user clicks the Submit button in the modal
    Then the registration modal remains open
    And the Age and Salary fields show validation failure (no row added)

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-C488
  Scenario: AC3 - Disabled "No" radio button does not change state on click
    Given the user navigates to the Radio Button page on DemoQA
    When the user attempts to click the "No" radio button identified by #noRadio
    Then the #noRadio button remains disabled
    And no success message or state change occurs

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-C488
  Scenario: AC4 - UI remains stable under obstruction and elements are interactable
    Given the user navigates to the Text Box page on DemoQA
    When an overlay (e.g., an ad or iframe) obstructs part of the page
    Then the user can scroll to the #userEmail field and interact with it
    And the field remains focusable and editable