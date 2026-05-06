Feature: Negative Path Validation for DemoQA Elements Module
  @SCRUM-70 @Forensic-AEGIS-2026-MAY-D03C
  Scenario: AC1 – Email Validation triggers error for invalid email
    Given I am on the DemoQA Elements page
    When I enter the invalid email "test@domain" in the #userEmail field
    And I click the #submit button in the Text Box section
    Then the #userEmail field shows a validation error
    And the #output section is not displayed

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-D03C
  Scenario: AC2 – Web Tables validation blocks submission for non-numeric Age
    Given I am on the DemoQA Elements page
    When I click the #addNewRecordButton to open the registration modal
    And I enter "abc" in the #age field
    And I click the #submit button in the registration modal
    Then the registration modal remains open
    And the submission is blocked

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-D03C
  Scenario: AC3 – Radio Button disabled "No" option remains unchanged
    Given I am on the DemoQA Elements page
    When I click the #noRadio button
    Then the #noRadio button remains disabled
    And no state change occurs

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-D03C
  Scenario: AC4 – UI Stability under overlay obstruction
    Given I am on the DemoQA Elements page
    When an overlay obstructs the Text Box form
    And I scroll the #userEmail field into view
    And I interact with the field using visibility handling
    Then the UI remains stable and the field is interactable