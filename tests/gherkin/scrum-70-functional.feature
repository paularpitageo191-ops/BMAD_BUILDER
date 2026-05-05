Feature: Negative Path Validation for DemoQA Elements Module
  As a QA Engineer, I want to validate negative scenarios so that invalid inputs are handled correctly.

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-F97F
  Scenario: AC1 – Email validation blocks invalid input
    Given the user is on the Text Box page
    When the user enters invalid email "test@domain" and clicks Submit
    Then the output section #output is not displayed
    And the error styling is applied on #userEmail

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-F97F
  Scenario: AC2 – Web Tables rejects non-numeric Age/Salary
    Given the user is on the Web Tables page
    When the user opens the registration modal and fills Age with "abc" and Salary with "12x"
    And clicks the modal Submit button
    Then the registration modal remains open
    And the form values are not cleared

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-F97F
  Scenario: AC3 – Radio Button "No" remains disabled
    Given the user is on the Radio Button page
    Then the #noRadio button is disabled
    When the user clicks the #noRadio element
    Then the #noRadio remains disabled
    And the #noRadio is not checked

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-F97F
  Scenario: AC4 – UI stability under obstruction – Web Tables validation with overlay
    Given the user is on the Web Tables page with an overlay present
    When the user closes the overlay and opens the registration modal
    And fills Age with "abc" and clicks Submit
    Then the registration modal remains open
    And the user can still interact with the form