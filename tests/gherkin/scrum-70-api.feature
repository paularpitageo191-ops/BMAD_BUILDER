Feature: Negative Path Validation for DemoQA Elements – Practice Form

  Background: The user is on the Practice Form page

  Scenario: Invalid email format triggers inline validation and blocks form submission
    Given the user is on the Practice Form
    And the user fills in "First Name" with "Test"
    And the user fills in "Last Name" with "User"
    And the user fills in "Email" with "invalid-email"
    When the user clicks the "Submit" button
    Then the email field shows a validation error indicating an invalid email format
    And the submission modal does not appear
    And the form remains visible

  Scenario: Valid email enables successful submission (regression guard)
    Given the user is on the Practice Form
    And the user fills in "First Name" with "Test"
    And the user fills in "Last Name" with "User"
    And the user fills in "Email" with "valid@example.com"
    When the user clicks the "Submit" button
    Then the submission modal appears with a success message
    And the modal can be dismissed

  Scenario: Boundary – empty email field triggers required validation
    Given the user is on the Practice Form
    And the user fills in "First Name" with "Test"
    And the user fills in "Last Name" with "User"
    And the email field is left empty
    When the user clicks the "Submit" button
    Then the email field shows a validation error indicating it is required
    And the submission modal does not appear

  Scenario: Boundary – email with special characters induces validation failure
    Given the user is on the Practice Form
    And the user fills in "First Name" with "Test"
    And the user fills in "Last Name" with "User"
    And the user fills in "Email" with "user@domain..com"
    When the user clicks the "Submit" button
    Then the email field shows a validation error indicating invalid format
    And the submission modal does not appear