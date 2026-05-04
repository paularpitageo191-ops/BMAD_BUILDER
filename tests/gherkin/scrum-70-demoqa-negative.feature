@JIRA-SCRUM-70
@Forensic-pilot-seed
@negative
Feature: Negative Path Validation for DemoQA Elements Module
  Scenario: Invalid email should not submit Text Box data
    Given the user opens the Text Box form
    When the user enters an invalid email without an at-sign
    And submits the form
    Then the output container should not render
    And the email field should remain invalid

  Scenario: Disabled radio button should remain non-interactive
    Given the user opens the Radio Button page
    Then the "No" option should remain disabled
