# Traceability
Feature: Negative Path Validation for DemoQA Elements Module

  @negative @AC1
  Scenario: Email invalid – missing TLD blocks submission and hides output
    Given the Text Box page is loaded
    When the user enters "test@domain" in the email field
    And clicks the Submit button
    Then the #output section is not displayed
    And the form submission is blocked (URL unchanged)

  @boundary @AC1
  Scenario: Email invalid – missing @ symbol blocks submission
    Given the Text Box page is loaded
    When the user enters "testdomain.com" in the email field
    And clicks the Submit button
    Then the #output section is not displayed
    And the form submission is blocked

  @positive @regression @AC1
  Scenario: Valid email renders output section with correct data
    Given the Text Box page is loaded
    And all fields are empty
    When the user enters valid full name, email, current address, and permanent address
    And clicks the Submit button
    Then the #output section is displayed with the submitted data
    And no validation errors are present

  @negative @AC2
  Scenario: Non-numeric age ('abc') blocks Web Table registration
    Given the Web Tables page is loaded
    And the registration modal is opened
    When the user fills all fields except age with valid data
    And enters "abc" in the Age field
    And clicks Submit in the modal
    Then the registration modal remains open
    And no new row is added to the table

  @negative @AC2
  Scenario: Non-numeric salary ('12ab') blocks Web Table registration
    Given the Web Tables page is loaded
    And the registration modal is opened
    When the user fills all fields except salary with valid data
    And enters "12ab" in the Salary field
    And clicks Submit in the modal
    Then the registration modal remains open
    And no new row is added to the table

  @boundary @AC2
  Scenario: Empty age and salary fields block Web Table registration
    Given the Web Tables page is loaded
    And the registration modal is opened
    When the user fills only non-numeric required fields (First Name, Last Name, Email, Department) with valid data
    And leaves Age and Salary empty
    And clicks Submit in the modal
    Then the registration modal remains open
    And no new row is added to the table

  @negative @AC3
  Scenario: 'No' radio button is disabled and unclickable
    Given the Radio Button page is loaded
    Then the #noRadio element should have the disabled attribute
    When the user attempts to click #noRadio with a standard click
    Then the #noRadio remains disabled
    And no selection indicator appears (no success message)

  @negative @AC3
  Scenario: No state change after force-clicking disabled 'No' radio button
    Given the Radio Button page is loaded
    And no radio button is initially selected
    When the user force-clicks the #noRadio element
    Then the #noRadio remains disabled
    And no success message (e.g., "You have selected No") appears