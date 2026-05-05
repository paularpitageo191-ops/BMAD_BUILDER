@SCRUM-70 @Forensic-AEGIS-2026-MAY-5252
Feature: Negative Path Validation for DemoQA Elements Module

  As a QA Engineer
  I want to validate negative scenarios in the Elements module
  So that invalid inputs are handled correctly and the UI remains stable under edge conditions

  Background:
    Given I am on the DemoQA Elements page

  @AC1 @EmailValidation
  Scenario Outline: Invalid email triggers validation error and no output
    When I fill the "userEmail" field with "<invalid_email>"
    And I submit the form
    Then I should see a validation error on "#userEmail"
    And the output section "#output" should not be displayed

    Examples:
      | invalid_email      |
      | "test@domain"      |
      | "user@.com"        |
      | "@domain.com"      |
      | "plainaddress"     |
      | ""                 |

  @AC2 @WebTablesValidation
  Scenario Outline: Non-numeric Age/Salary values block submission and keep modal open
    Given I click the "Add" button to open the registration modal
    When I fill the "Age" field with "<age>" and the "Salary" field with "<salary>"
    And I click "Submit" in the modal
    Then the modal should remain open
    And I should see a validation message for the invalid fields

    Examples:
      | age  | salary |
      | "abc"| "123"  |
      | ""   | "45.6" |
      | "12ab"| "abc" |
      | "null"| "50000"|

  @AC3 @RadioButtonValidation
  Scenario: "No" radio button remains disabled and does not toggle
    Given I am on the Radio Button section
    When I try to click the "#noRadio" element
    Then the "#noRadio" element should remain disabled
    And no state change should be observed on the radio button group

  @AC4 @UIStability
  Scenario: UI remains stable under obstruction and elements remain interactable
    Given an overlay or obstruction is present on the page
    When I scroll to the "#userEmail" field
    Then the "#userEmail" field should be interactable
    And I should be able to fill and submit without errors