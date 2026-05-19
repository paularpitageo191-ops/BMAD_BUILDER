# Traceability
Feature: Negative Path Validation for DemoQA Elements Module
  Stories: SCRUM-70
  Tags: demoqa elements tc-negative
  Acceptance Criteria: AC1 (Email validation), AC2 (Web Tables validation), AC3 (Radio Button validation), AC4 (UI stability)

  Background:
    Given the user is on the DemoQA Elements page
    And the user has navigated to the relevant sub-module per scenario

  @AC1 @negative @email
  Scenario: Invalid email – missing domain name blocks submission (AC1)
    Given the user is on the Text Box page
    When the user enters "test@.com" into the #userEmail field
    And clicks the #submit button
    Then the #userEmail field shows a validation error (browser-level "Please enter a valid email")
    And the #output section remains hidden

  @AC1 @negative @email
  Scenario: Invalid email – missing top-level domain blocks submission (AC1)
    Given the user is on the Text Box page
    When the user enters "test@domain" into the #userEmail field
    And clicks the #submit button
    Then the #userEmail field shows a validation error
    And the #output section remains hidden

  @AC1 @functional @regression
  Scenario: Valid email – positive control for baseline (AC1)
    Given the user is on the Text Box page
    When the user enters "user@example.com" into the #userEmail field
    And clicks the #submit button
    Then no validation error appears on #userEmail
    And the #output section becomes visible containing the submitted email

  @AC2 @negative @webtables
  Scenario: Non-numeric Age blocks Web Tables submission (AC2)
    Given the user is on the Web Tables page
    When the user clicks the #addNewRecordButton to open the registration modal
    And enters valid data for all fields except Age
    And enters "abc" into the #age field
    And clicks the modal's Submit button
    Then the registration modal remains open
    And no new row is added to the table
    And the #age field indicates a validation error

  @AC2 @negative @webtables
  Scenario: Non-numeric Salary blocks Web Tables submission (AC2)
    Given the user is on the Web Tables page
    When the user opens the registration modal
    And enters valid data for all fields except Salary
    And enters "12ab" into the #salary field
    And clicks the modal's Submit button
    Then the registration modal remains open
    And no new row is added to the table
    And the #salary field indicates a validation error

  @AC2 @boundary @webtables
  Scenario: Empty Age field blocks Web Tables submission (AC2)
    Given the user is on the Web Tables page
    When the user opens the registration modal
    And enters valid data for all fields except Age, leaving Age blank
    And clicks the modal's Submit button
    Then the registration modal remains open
    And the #age field shows a required validation error
    And no new row is added to the table

  @AC2 @functional @regression
  Scenario: Valid numeric inputs for Web Tables submission – positive regression (AC2)
    Given the user is on the Web Tables page
    When the user opens the registration modal
    And enters valid data including Age 25 and Salary 50000
    And clicks the modal's Submit button
    Then the registration modal closes
    And a new row with the entered data appears in the table

  @AC3 @negative @radio
  Scenario: "No" radio button remains disabled and non-interactable (AC3)
    Given the user is on the Radio Button page
    Then the #noRadio element has a disabled attribute
    When the user attempts to click #noRadio
    Then #noRadio remains disabled
    And no output message appears stating "You have selected No"
    And any previously selected radio button (e.g., "Yes") remains selected

  @AC4 @regression @uistability
  Scenario: Overlay does not block Text Box submission (AC4)
    Given the user is on the Text Box page
    When an overlay is injected covering the form
    And the user scrolls the #submit button into view
    And enters a valid email into #userEmail
    And clicks the #submit button
    Then the #output section appears with the submitted email
    And no JavaScript errors occur

  @AC4 @regression @uistability
  Scenario: Elements remain interactable via scroll under overlay (AC4)
    Given the user is on the Radio Button page
    When an overlay is injected covering the radio options
    And the user scrolls the radio button container into view
    And clicks the "Yes" radio option
    Then the "Yes" radio becomes selected
    And the output message displays "You have selected Yes"
    And the overlay does not cause any blocking error

  @AC1 @boundary @email
  Scenario: Empty email input – edge case (Test Data)
    Given the user is on the Text Box page
    When the #userEmail field is empty
    And the user clicks the #submit button
    Then the #output section does not appear
    And a validation error may appear on #userEmail (e.g., "Please fill out this field")
    And the form is not submitted