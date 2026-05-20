# Traceability
Feature: Negative Path Validation for DemoQA Elements Module
  As a QA Engineer
  I want to validate negative scenarios in the Elements module
  So that invalid inputs are handled correctly and the UI remains stable under edge conditions

  Background:
    Given the user is on the DemoQA home page
    And the Elements section is accessible from the left sidebar

  @SCRUM-70 @AC1 @Text-Box @negative
  Scenario: Invalid email (no TLD) triggers validation error and no output
    Given the user navigates to the Text Box section
    When the user enters "test@domain" in the #userEmail field
    And clicks the #submit button
    Then a validation error appears on the #userEmail field
    And the #output section is not displayed

  @SCRUM-70 @AC1 @Text-Box @negative
  Scenario: Invalid email (no @ symbol) triggers validation error and no output
    Given the user navigates to the Text Box section
    When the user enters "testdomain.com" in the #userEmail field
    And clicks the #submit button
    Then a validation error appears on the #userEmail field
    And the #output section is not displayed

  @SCRUM-70 @AC1 @Text-Box @negative
  Scenario: Empty email field triggers validation error and no output
    Given the user navigates to the Text Box section
    When the user leaves the #userEmail field empty
    And clicks the #submit button
    Then a validation error appears on the #userEmail field
    And the #output section is not displayed

  @SCRUM-70 @AC1 @Text-Box @regression
  Scenario: Valid email produces output section with correct data
    Given the user navigates to the Text Box section
    When the user enters "test@example.com" in the #userEmail field
    And enters a valid full name and current address
    And clicks the #submit button
    Then the #userEmail field shows no validation error
    And the #output section is visible and contains the submitted data

  @SCRUM-70 @AC2 @Web-Tables @negative
  Scenario: Non-numeric age blocks submission and modal stays open
    Given the user navigates to the Web Tables section
    When the user clicks the "Add" button to open the registration modal
    And enters valid first name, last name, email, salary (50000), and department
    And enters "abc" in the Age field
    And clicks the "Submit" button
    Then the registration modal does not close
    And the Age field shows a validation error
    And no new row is added to the table

  @SCRUM-70 @AC2 @Web-Tables @negative
  Scenario: Non-numeric salary blocks submission and modal stays open
    Given the user navigates to the Web Tables section
    When the user clicks the "Add" button to open the registration modal
    And enters valid first name, last name, email, age (30), and department
    And enters "12ab" in the Salary field
    And clicks the "Submit" button
    Then the registration modal remains open
    And the Salary field shows a validation error
    And no new row is added to the table

  @SCRUM-70 @AC3 @Radio-Button @negative
  Scenario: Disabled “No” radio button remains disabled and unclickable
    Given the user navigates to the Radio Button section
    When the user locates the #noRadio element
    Then the #noRadio element should have a disabled attribute
    When the user attempts to click the #noRadio element
    Then the radio button group remains unchanged
    And no state change occurs (no selected class, no output message)

  @SCRUM-70 @AC3 @Radio-Button @negative
  Scenario: Force click on disabled “No” radio button does not change state
    Given the user navigates to the Radio Button section
    When the user attempts a force click on the #noRadio element
    Then the #noRadio element remains disabled
    And no other radio button selection is lost
    And the output message (if any) remains unchanged