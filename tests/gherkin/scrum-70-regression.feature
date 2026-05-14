Feature: Negative path validation for DemoQA Elements Web Table email field

  Scenario: Invalid email keeps modal open with validation error
    Given the user is on the DemoQA Elements page and navigates to Web Tables
    When the user clicks the "Add" button to open the registration modal
    And enters valid first name, last name, age, salary, and department
    And enters an invalid email "invalid-email"
    And clicks the "Submit" button
    Then the modal should remain visible
    And the email field should show a browser validation error

  Scenario: Boundary – email with no @ symbol triggers validation
    Given the user is on the DemoQA Elements page and navigates to Web Tables
    When the user clicks the "Add" button to open the registration modal
    And enters valid first name, last name, age, salary, and department
    And enters email "userexample.com" (missing @)
    And clicks the "Submit" button
    Then the modal should remain visible
    And the email field should display a validation message

  Scenario: Regression – modal does not close on invalid email submission
    Given the user is on the DemoQA Elements page and navigates to Web Tables
    When the user clicks the "Add" button to open the registration modal
    And enters valid first name, last name, age, salary, and department
    And enters email "user@.com"
    And clicks the "Submit" button
    Then the modal should still be displayed
    And the form should not be submitted (no success indicator)
    And the email input should remain invalid