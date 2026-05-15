@JIRA-SCRUM-70
@Forensic-AEGIS-SCRUM-70
Feature: Negative path validation for DemoQA Elements
  As a user
  I want to see proper error handling
  So that invalid input does not break the workflow

  Background:
    Given the user is on the DemoQA Elements page

  @ui-negative
  Scenario: Invalid email in Text Box shows validation error
    When the user enters an invalid email "notanemail" in the email field
    And clicks the submit button
    Then the email field shows a validation error

  @ui-negative
  Scenario: Modal remains open on invalid email in Web Tables registration
    When the user clicks the "Add" button to open the registration modal
    And enters an invalid email "bad@format" in the email field of the modal
    And clicks the submit button in the modal
    Then the modal remains visible
    And an error message is displayed in the modal

  @ui-regression
  Scenario: Valid submission still works after changes
    When the user enters a valid email "test@example.com" in the email field
    And clicks the submit button
    Then the page shows the output with the submitted email