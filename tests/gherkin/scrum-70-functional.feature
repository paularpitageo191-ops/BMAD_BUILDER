Feature: Negative Path Validation for DemoQA Elements Web Table Registration
  As a user of the DemoQA Elements page
  I want to see validation errors for invalid email input in the registration modal
  So that invalid data is not accepted and the modal remains open for correction

  Scenario: Invalid email shows validation error
    Given the user is on the Elements page and has opened the Web Table registration modal
    When the user fills the Email field with an invalid email "notanemail"
    And clicks the Submit button
    Then the email validation error message should be visible

  Scenario: Modal remains open after invalid input
    Given the user is on the Elements page and has opened the Web Table registration modal
    When the user submits the form with an invalid email
    Then the registration modal should still be displayed

  Scenario: Regression – Valid submission adds a row and closes the modal
    Given the user is on the Elements page and has opened the Web Table registration modal
    When the user fills all required fields with valid data, including a correct email "john.doe@example.com"
    And clicks the Submit button
    Then the modal should close
    And a new row with the entered data should appear in the web table