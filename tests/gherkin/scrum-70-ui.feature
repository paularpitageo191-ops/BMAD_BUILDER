@JIRA-SCRUM-70
@Forensic-AEGIS-SCRUM-70
@negative-path
Feature: DemoQA Elements Negative Path Validation
  As a user of DemoQA Elements
  I want the system to reject invalid email inputs
  So that only properly formatted email addresses are accepted

  @ui-negative
  Scenario: Text Box rejects invalid email with validation error
    Given the user is on the Text Box section of DemoQA Elements
    When they enter an invalid email "invalid-email" in the email field
    And they click the Submit button
    Then the browser shows an email validation error on the email field
    And the output area "#output" is not visible

  @ui-negative
  Scenario: Web Tables registration modal remains open on invalid email
    Given the user is on the Web Tables section of DemoQA Elements
    And they click the Add button to open the registration modal
    When they fill all required fields with valid data except email "bad.email@"
    And they click the Submit button in the modal
    Then the registration modal remains visible
    And no new record is added to the table

  @ui-regression
  Scenario: Web Tables successful registration still works (regression safeguard)
    Given the user is on the Web Tables section of DemoQA Elements
    And they click the Add button to open the registration modal
    When they fill all required fields with valid data
    And they click the Submit button in the modal
    Then the registration modal closes
    And a new record appears in the table with the submitted details