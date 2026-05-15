Feature: DemoQA Elements Negative Path Validation
  As a QA engineer
  I want to validate error handling for invalid input on DemoQA Elements page
  So that the application gracefully handles bad data and protects critical flows

  Background:
    Given I am on the DemoQA Elements page

  @JIRA-SCRUM-70
  @Forensic-AEGIS-SCRUM-70
  @ui-negative
  Scenario: Invalid email in Text Box shows inline validation
    When I enter an invalid email "not_an_email" into the email field "#userEmail"
    And I click the submit button "#submit"
    Then I should see an error message indicating the email is invalid
    And the form should not submit successfully

  @JIRA-SCRUM-70
  @Forensic-AEGIS-SCRUM-70
  @ui-regression
  Scenario: Valid email in Text Box submits successfully (regression)
    When I enter a valid email "user@example.com" into the email field "#userEmail"
    And I click the submit button "#submit"
    Then I should see a success indication in the output area "#output"

  @JIRA-SCRUM-70
  @Forensic-AEGIS-SCRUM-70
  @ui-negative
  Scenario: Registration modal remains open on invalid age input
    Given I open the Web Tables registration modal by clicking "#addNewRecordButton"
    When I enter an age of "123" (exceeds 2-digit maxlength) into the age field "#age"
    And I click the submit button "#submit"
    Then the registration modal should still be visible
    And no new record should appear in the table

  @JIRA-SCRUM-70
  @Forensic-AEGIS-SCRUM-70
  @ui-boundary
  Scenario: Registration modal rejects salary exceeding maximum length
    Given I open the Web Tables registration modal by clicking "#addNewRecordButton"
    When I enter a salary of "12345678901" (11 digits) into the salary field "#salary"
    And I click the submit button "#submit"
    Then the salary field should show a validation error or remain editable
    And the modal should not close

  @JIRA-SCRUM-70
  @Forensic-AEGIS-SCRUM-70
  @ui-regression
  Scenario: Registration modal rejects invalid data and stays open (regression)
    Given I open the Web Tables registration modal by clicking "#addNewRecordButton"
    When I leave the first name field empty
    And I enter an age of "0"
    And I click the submit button "#submit"
    Then the modal should remain open
    And validation errors should be displayed on the required fields