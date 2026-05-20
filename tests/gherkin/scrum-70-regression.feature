# Traceability
Feature: Regression Guardrails – Elements Module Negative Path Validation
  As a regression safety check,
  I want to revalidate the positive email submission path
  so that the negative validation changes do not break the existing happy path.

  Scenario: Valid email produces output section with correct data
    Given the user navigates to the DemoQA Elements > Text Box page
    And the Text Box form is loaded
    When the user enters a valid full name in the "fullName" field
    And enters a valid email "test@example.com" in the "userEmail" field
    And enters a valid current address in the "currentAddress" field
    And clicks the "Submit" button
    Then the email field should not show any validation error
    And the output section "#output" should be visible
    And the output section should display the submitted name, email, and address