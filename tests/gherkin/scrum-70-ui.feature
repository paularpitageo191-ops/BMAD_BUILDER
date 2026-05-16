# Traceability
# Functional Areas: Radio Button, Text Box, UI Stability, Web Tables
# Source References: AC1, AC2, AC3, AC4, Screenshot: Invalid numeric input behavior (baseline), Screenshot: Valid input → output section rendered, Test Data: Empty/null inputs, Test Data: Invalid email formats, Test Data: Non-numeric values, Test Data: Non-numeric values (e.g., abc, 12ab)
# Execution Readiness: strong
# Readiness Rationale: UI/DOM evidence is concrete enough for executable UI generation.
@SCRUM-70 @Forensic-AEGIS-SCRUM-70
Feature: Text Box Email Validation
  As a QA engineer
  I want to validate email input handling
  So that invalid emails are rejected and valid ones show output

  Background:
    Given the user is on the DemoQA Elements page
    And the Text Box section is visible

  @ui-negative @high
  Scenario: Invalid email missing TLD triggers validation error and no output
    When the user enters "test@domain" into #userEmail
    And clicks the #submit button
    Then #userEmail should display a validation error (e.g., red border, "Please enter a valid email")
    And #output should not be visible

  @ui-negative @high
  Scenario: Empty email input shows validation error and no output
    When the user leaves #userEmail empty
    And clicks the #submit button
    Then #userEmail should display a validation error (e.g., "Please fill out this field")
    And #output should not be visible

  @ui-positive @high
  Scenario: Valid email displays output section
    When the user enters "test@domain.com" into #userEmail
    And fills Full Name, Current Address, Permanent Address with any value
    And clicks the #submit button
    Then #userEmail should not show a validation error
    And #output should be visible and contain the entered email

@SCRUM-70 @Forensic-AEGIS-SCRUM-70
Feature: Web Tables Registration Validation
  As a QA engineer
  I want to validate numeric field constraints in registration
  So that only valid entries are accepted

  Background:
    Given the user is on the DemoQA Elements page
    And the Web Tables section is visible

  @ui-negative @high
  Scenario: Non-numeric Age blocks submission and modal stays open
    When the user clicks #addNewRecordButton to open the registration modal
    And enters valid data in First Name, Last Name, Email, Salary, Department
    And enters "abc" into #age
    And clicks the Submit button in the modal
    Then the registration modal should remain open
    And #age should show a validation error (e.g., red border)
    And no new row should be added to the table

  @ui-negative @high
  Scenario: Non-numeric Salary blocks submission and modal stays open
    When the user clicks #addNewRecordButton to open the registration modal
    And enters valid data in First Name, Last Name, Email, Age, Department
    And enters "12ab" into #salary
    And clicks the Submit button in the modal
    Then the registration modal should remain open
    And #salary should show a validation error
    And no new row should be added to the table

  @ui-positive @medium
  Scenario: Valid Age and Salary submits successfully
    When the user clicks #addNewRecordButton to open the registration modal
    And enters "John" in First Name, "Doe" in Last Name, "j@d.com" in Email, "30" in Age, "50000" in Salary, "QA" in Department
    And clicks the Submit button in the modal
    Then the registration modal should close
    And a new row with the entered values should appear in the table
    And no validation errors should be present

@SCRUM-70 @Forensic-AEGIS-SCRUM-70
Feature: Radio Button Disabled Option Behavior
  As a QA engineer
  I want to verify that the disabled "No" option cannot be interacted with
  So that the UI remains stable

  Background:
    Given the user is on the DemoQA Elements page
    And the Radio Button section is visible

  @ui-negative @high
  Scenario: "No" radio button is disabled in the DOM
    When the user locates #noRadio
    Then #noRadio should have attribute disabled or aria-disabled="true"
    And clicking #noRadio should not change the radio group selection
    And #noRadio should remain unchecked

  @ui-negative @high
  Scenario: Clicking disabled "No" does not trigger state change
    Given the "Yes" radio button is selected (output shows "You have selected Yes")
    When the user attempts to click #noRadio with force
    Then the radio button selection should remain unchanged (Yes still selected)
    And the output text should not update to indicate "No"
    And #noRadio should remain disabled and unchecked

@SCRUM-70 @Forensic-AEGIS-SCRUM-70
Feature: UI Stability under Viewport Constraints
  As a QA engineer
  I want to ensure elements are interactable after scrolling
  So that the UI remains usable under limited viewports

  Background:
    Given the user sets viewport to 800x600
    And navigates to the DemoQA Elements page

  @ui @medium
  Scenario: Elements interactable via scroll handling when partially visible
    When the user scrolls to the bottom of the page
    And scrolls #userEmail into view
    And clicks #userEmail
    And types "test@domain.com"
    Then the input should be focusable and typed text should appear
    And no errors should occur