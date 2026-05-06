Feature: Negative Path Validation for DemoQA Elements Module

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-C488
  Scenario: AC1 – Invalid email triggers validation error and output section hidden
    Given the user is on the DemoQA Elements page
    When the user enters an invalid email "test@domain" in the #userEmail field
    And clicks the #submit button for the Text Box
    Then a validation error is shown on #userEmail (field is invalid)
    And the #output section is not displayed

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-C488
  Scenario: AC2 – Non-numeric Age/Salary blocks submission and modal remains open
    Given the user is on the Web Tables section of DemoQA Elements
    When the user clicks the #addNewRecordButton to open the registration modal
    And fills the Age field with "abc"
    And fills the Salary field with "12ab"
    And clicks the #submit button inside the modal
    Then the registration modal (class .modal-content) is still visible
    And the modal is not dismissed

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-C488
  Scenario: AC3 – Disabled "No" radio button does not change state
    Given the user is on the Radio Button section of DemoQA Elements
    Then the #noRadio element is disabled
    When the user clicks on the #noRadio element
    Then the #noRadio element remains disabled
    And no success message appears

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-C488
  Scenario: AC4 – UI stability under overlay obstruction
    Given the user is on the DemoQA Elements page
    When the user scrolls to the #userEmail field using scrollIntoViewIfNeeded
    And interacts with the field (fills it)
    Then no JavaScript errors occur and the field remains visible and interactable
    And the page layout does not become unstable