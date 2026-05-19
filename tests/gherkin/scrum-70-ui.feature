# Traceability
# Functional Areas: Radio Button, Text Box, Web Tables
# Source References: AC1, AC2, AC3, Screenshots: Disabled option, Screenshots: Invalid numeric input, Screenshots: Text Box Validation, Screenshots: Valid input, Test Data: empty/null inputs, Test Data: invalid email formats, Test Data: non-numeric values
# Execution Readiness: strong
# Readiness Rationale: UI/DOM evidence is concrete enough for executable UI generation.
Feature: DemoQA Elements – Negative Path Validation
  As a QA engineer
  I want to validate negative scenarios in the Elements module
  So that invalid inputs are handled correctly and the UI remains stable.

  Background:
    Given the user is on the DemoQA Elements page

  @SCRUM-70 @AC1 @negative @ui
  Scenario: Email validation rejects missing TLD
    When the user clicks "Text Box" in the left menu
    And enters "test@domain" into the email field
    And clicks the Submit button
    Then the email field should show a validation error
    And the output section should not be displayed

  @SCRUM-70 @AC1 @negative @ui
  Scenario: Email validation rejects empty input
    When the user clicks "Text Box" in the left menu
    And leaves the email field empty
    And clicks the Submit button
    Then the email field should show a validation error
    And the output section should not be displayed

  @SCRUM-70 @AC1 @regression @ui
  Scenario: Positive email path – output section appears
    When the user clicks "Text Box" in the left menu
    And enters "test@example.com" into the email field
    And clicks the Submit button
    Then the email field should not show any validation error
    And the output section should be displayed with the entered email

  @SCRUM-70 @AC2 @negative @ui
  Scenario: Web tables – invalid age field blocks submission
    When the user clicks "Web Tables" in the left menu
    And clicks the Add button to open the registration modal
    And enters "abc" into the age field
    And fills other required fields with valid data
    And clicks the Submit button in the modal
    Then the registration modal should remain open
    And the age field should show a validation error
    And no new row should be added to the table

  @SCRUM-70 @AC2 @negative @ui
  Scenario: Web tables – invalid salary field blocks submission
    When the user clicks "Web Tables" in the left menu
    And clicks the Add button to open the registration modal
    And enters "12ab" into the salary field
    And fills other required fields with valid data
    And clicks the Submit button in the modal
    Then the registration modal should remain open
    And the salary field should show a validation error
    And no new row should be added to the table

  @SCRUM-70 @AC2 @regression @ui
  Scenario: Web tables – positive submission
    When the user clicks "Web Tables" in the left menu
    And clicks the Add button to open the registration modal
    And enters valid data into all fields
    And clicks the Submit button in the modal
    Then the registration modal should close
    And a new row with the entered data should appear in the table

  @SCRUM-70 @AC3 @negative @ui
  Scenario: Radio button – "No" option is disabled
    When the user clicks "Radio Button" in the left menu
    Then the "No" radio option should be disabled
    And clicking it should not change the selection state

  @SCRUM-70 @AC3 @negative @ui
  Scenario: Radio button – click disabled "No" does nothing
    When the user clicks "Radio Button" in the left menu
    And ensures the "Yes" radio is not selected
    And clicks on the "No" radio option
    Then the "No" radio should remain disabled
    And no selection feedback text should change

  @SCRUM-70 @AC3 @regression @ui
  Scenario: Radio button – positive path for "Yes"
    When the user clicks "Radio Button" in the left menu
    And clicks the "Yes" radio option
    Then the "Yes" radio should become selected
    And feedback text indicating "Yes" selection should appear

  @SCRUM-70 @AC2 @boundary @ui
  Scenario: Web tables – empty age and salary fields
    When the user clicks "Web Tables" in the left menu
    And clicks the Add button to open the registration modal
    And leaves age and salary fields empty
    And fills other required fields with valid data
    And clicks the Submit button in the modal
    Then the registration modal should remain open
    And the age and salary fields should show validation errors
    And no new row should be added to the table

  @SCRUM-70 @AC1 @negative @ui
  Scenario: Email validation rejects special characters
    When the user clicks "Text Box" in the left menu
    And enters "test!@example.com" into the email field
    And clicks the Submit button
    Then the email field should show a validation error
    And the output section should not be displayed