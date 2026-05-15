Feature: Negative Path Validation for DemoQA Elements – Web Tables Add Modal
  As a user interacting with the Add record modal on the Web Tables page
  I want clear validation feedback for invalid email input
  So that I can correct errors before submission and the modal remains open until a valid record is submitted

  Scenario: Invalid email prevents submission and shows validation error
    Given the user is on the "Web Tables" page
    And the "Add" modal is open
    When the user enters an invalid email address "invalid-email" in the Email field
    And the user clicks the Submit button in the modal
    Then a validation error message "Invalid email" should be displayed near the Email field
    And the modal should remain open

  Scenario: Modal stays open on invalid input
    Given the "Add" modal is open
    When the user submits the form with an invalid email address
    Then the modal should not close
    And the validation error should still be visible

  Scenario: Regression – valid email after invalid attempt allows successful submission
    Given the "Add" modal is open
    And the user has previously attempted to submit with an invalid email and seen a validation error
    When the user corrects the Email field to a valid address "user@example.com"
    And the user clicks the Submit button
    Then the modal should close
    And the new record should appear in the web table