@SCRUM-70 @Forensic-AEGIS-2026-MAY-2ACD
Feature: Negative Path Validation for DemoQA Elements Module
  As a QA engineer, I want to validate negative scenarios in the Elements module
  So that invalid inputs are handled correctly and the UI remains stable under edge conditions

Background:
  Given I open the DemoQA Elements page
  And I accept any cookie or consent dialogs if present

Scenario: AC1 – Invalid email triggers validation error and output not displayed
  Given I navigate to the Text Box section
  When I fill the email field with "test@domain"
  And I click the submit button
  Then the email field should have a CSS validation pseudo-class ":invalid"
  And the output section "#output" should not be visible

Scenario: AC2 – Non-numeric Age/Salary blocks submission
  Given I navigate to the Web Tables section
  When I click the "Add" button to open the registration modal
  And I fill all required fields with valid data except Age set to "abc"
  And I click the "Submit" button in the modal
  Then the registration modal should remain open
  And no new row should appear in the table

Scenario: AC3 – "No" radio button is disabled and non-interactable
  Given I navigate to the Radio Button section
  When I attempt to click the "#noRadio" element
  Then the "#noRadio" should remain disabled
  And the radio button should not become checked

Scenario: AC4 – UI remains interactable under an overlay obstruction
  Given I have an overlay covering part of the page
  When I scroll to the "Buttons" section
  Then I can click the "Click Me" button without error
  And the click action is processed successfully