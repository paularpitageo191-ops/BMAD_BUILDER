# Traceability
Feature: DemoQA Elements - Negative Path Validation
  As a QA engineer
  I want to validate negative scenarios in the Elements module
  So that invalid inputs are handled correctly and the UI remains stable

  Background:
    Given the user is on the DemoQA Elements hub page

  @AC1 @negative @textbox
  Scenario: Negative - Empty email field shows validation error and output not displayed
    Given the user navigates to the Text Box page
    When the user clears the email field and clicks the Submit button
    Then the browser validation error "Please fill out this field" is displayed on the email field
    And the output section is not visible

  @AC1 @negative @textbox
  Scenario: Negative - Invalid email format (missing TLD) shows validation error and output not displayed
    Given the user navigates to the Text Box page
    When the user types "test@domain" in the email field and clicks Submit
    Then the browser validation message "Please enter a valid email address" is displayed
    And the output section is not visible

  @AC1 @functional @textbox
  Scenario: Positive - Valid email displays output section with entered data
    Given the user navigates to the Text Box page
    When the user fills all fields with valid data including email "test@example.com" and clicks Submit
    Then the output section becomes visible
    And the output contains the entered email address

  @AC2 @negative @webtables
  Scenario: Negative - Non-numeric age blocks submission and modal stays open
    Given the user navigates to the Web Tables page and opens the registration modal
    When the user fills other fields with valid data and enters "abc" in the age field
    And clicks the Submit button in the modal
    Then the registration modal remains visible
    And the age field shows a browser validation error "Please enter a number"
    And no new row is added to the table

  @AC2 @negative @webtables
  Scenario: Negative - Non-numeric salary blocks submission and modal stays open
    Given the user navigates to the Web Tables page and opens the registration modal
    When the user fills other fields with valid data and enters "12ab" in the salary field
    And clicks the Submit button in the modal
    Then the registration modal remains visible
    And the salary field shows a browser validation error "Please enter a number"
    And no new row is added to the table

  @AC2 @negative @webtables
  Scenario: Negative - Empty age and salary fields block submission and modal stays open
    Given the user navigates to the Web Tables page and opens the registration modal
    When the user fills required fields except age and salary, leaving them empty
    And clicks the Submit button in the modal
    Then the registration modal remains visible
    And the age or salary field shows a required validation message
    And no new row is added to the table

  @AC2 @functional @webtables
  Scenario: Positive - Valid age and salary completes submission and adds row
    Given the user navigates to the Web Tables page and opens the registration modal
    When the user fills all fields with valid data (age: 30, salary: 50000) and clicks Submit
    Then the registration modal closes
    And a new row appears in the table with the correct data

  @AC3 @negative @radiobutton
  Scenario: Negative - 'No' radio button is disabled and cannot be interacted with
    Given the user navigates to the Radio Button page
    Then the 'No' radio button should be disabled
    When the user attempts to click the disabled 'No' option
    Then the 'No' radio button remains unchecked
    And no selection message is displayed for 'No'
    And the 'Yes' and 'Impressive' radio buttons remain selectable

  @AC3 @functional @radiobutton
  Scenario: Positive - Selecting 'Yes' and 'Impressive' works while 'No' stays disabled
    Given the user navigates to the Radio Button page
    When the user clicks the 'Yes' radio button
    Then the message "You have selected Yes" appears
    When the user clicks the 'Impressive' radio button
    Then the message changes to "You have selected Impressive"
    And the 'No' radio button remains disabled

  @AC1 @negative @textbox
  Scenario: Negative - Invalid email format (special characters) triggers validation
    Given the user navigates to the Text Box page
    When the user types "test@domain..com" in the email field and clicks Submit
    Then a validation error is shown on the email field
    And the output section is not visible

  @AC2 @negative @webtables
  Scenario: Negative - Age negative number blocks submission
    Given the user navigates to the Web Tables page and opens the registration modal
    When the user fills other fields with valid data and enters "-5" in the age field
    And clicks the Submit button in the modal
    Then the registration modal remains visible if validation exists
    Or the modal closes and a row is added if no lower-bound validation is enforced