@SCRUM-70 @Forensic-AEGIS-2026-MAY-5252
Feature: Negative Path Validation for DemoQA Elements Module

  As a QA Engineer
  I want to validate negative scenarios in the Elements module
  So that invalid inputs are handled correctly and the UI remains stable under edge conditions

  Background:
    Given I am on the DemoQA homepage
    And I navigate to the Elements section

  @SCRUM-70
  Scenario: AC1 - Email Validation on Text Box
    Given I am on the DemoQA Text Box page
    When I enter invalid email "test@domain" into the email field
    And I click the submit button
    Then a validation error is displayed on #userEmail
    And the output section (#output) is not displayed

  @SCRUM-70
  Scenario: AC2 - Web Tables Validation with non-numeric age
    Given I am on the DemoQA Web Tables page
    When I click the "Add" button to open registration modal
    And I enter valid First Name, Last Name, Email, and invalid Age "abc" and Salary "12ab"
    And I click the "Submit" button in the registration modal
    Then the registration modal remains open
    And error indications are shown on the Age and Salary fields

  @SCRUM-70
  Scenario: AC3 - Radio Button No option remains disabled
    Given I am on the DemoQA Radio Button page
    Then the "No" radio button (#noRadio) is disabled
    When I attempt to click the "No" radio button
    Then the "No" radio button remains disabled
    And no visible state change occurs (selection indicator unchanged)

  @SCRUM-70
  Scenario: AC4 - UI Stability under overlay obstruction
    Given I am on the DemoQA Elements page
    When an obstruction overlay is present
    Then I can scroll to and interact with elements behind the overlay
    And elements remain visibly stable and functional