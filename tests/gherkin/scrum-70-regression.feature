Feature: Negative Path Validation for DemoQA Elements Module
  As a QA Engineer,
  I want to validate negative scenarios in the Elements module,
  so that invalid inputs are handled correctly and the UI remains stable under edge conditions.

Scenario: Email Validation Failure - Invalid Email Input Triggers Validation Error #userEmail (AC1)
  Given I am on the "Elements" page
  When I enter an invalid email address "#userEmail"
  Then the validation error is displayed for "#userEmail"
  And the output section "#output" is not displayed

Scenario: Web Tables Validation Failure - Non-Numeric Values in Age/Salary Fields Block Submission (AC2)
  Given I am on the "Elements" page
  When I enter non-numeric values in the "Age" and "Salary" fields
  Then the submission is blocked
  And the registration modal remains open

Scenario: Radio Button Validation Failure - "No" Option Remains Disabled, No State Change (AC3)
  Given I am on the "Elements" page
  When I select the "No" radio button
  Then the radio button remains disabled
  And there is no state change

Scenario: UI Stability Under Obstruction (AC4)
  Given I am on the "Elements" page with obstruction (e.g., overlays)
  When I interact with the elements
  Then the UI remains stable and interactive