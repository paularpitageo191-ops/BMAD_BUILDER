Feature: Negative Path Validation for DemoQA Elements
  User story SCRUM-70 enforces robust rejection of invalid inputs and modal persistence.

  Scenario: Invalid email triggers client-side validation on Text Box
    Given the user is on the DemoQA Elements page
    When the user enters an invalid email "not-an-email" into the "Full Name" field
    And the user clicks the "Submit" button
    Then the "Email" input field shows a validation error message

  Scenario: Registration modal remains open after submitting invalid data
    Given the user is on the DemoQA Elements page
    When the user clicks the "Add" button to open the registration modal
    And the user enters invalid data (e.g., non-numeric age "abc", missing salary)
    And the user clicks the "Submit" button inside the modal
    Then the modal remains visible and does not close
    And the invalid fields show validation errors

  Scenario: Regression – modal blocking still works after code changes
    Given the user is on the DemoQA Elements page
    When the user opens the registration modal
    And the user submits an empty form
    Then the modal stays open with validation prompts on required fields