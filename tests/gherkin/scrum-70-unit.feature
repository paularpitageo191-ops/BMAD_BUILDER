@SCRUM-70 @Forensic-AEGIS-2026-MAY-4F8A
Feature: Negative Path Validation for DemoQA Elements Module

  As a QA Engineer
  I want to validate negative scenarios in the Elements module
  So that invalid inputs are handled correctly and the UI remains stable under edge conditions

  Background:
    Given I open the DemoQA Elements page

  @SCRUM-70 @AC1
  Scenario: Email validation rejects invalid email and hides output
    Given I am on the Text Box section
    When I enter an invalid email "test@domain" into the email field
    And I click the submit button
    Then the email field shows a validation error
    And the output section is not displayed

  @SCRUM-70 @AC2a
  Scenario: Web Tables blocks registration with non-numeric age
    Given I am on the Web Tables section
    When I click the Add button to open the registration modal
    And I fill in the form with non-numeric "abc" in the age field
    And I click the Submit button in the modal
    Then the registration modal remains visible
    And the record is not added

  @SCRUM-70 @AC2b
  Scenario: Web Tables blocks registration with non-numeric salary
    Given I am on the Web Tables section
    When I click the Add button to open the registration modal
    And I fill in the form with non-numeric "12ab" in the salary field
    And I click the Submit button in the modal
    Then the registration modal remains visible
    And the record is not added

  @SCRUM-70 @AC3
  Scenario: Radio button "No" remains disabled
    Given I am on the Radio Button section
    Then the "No" radio option is disabled
    When I click on the "No" radio option
    Then the "No" radio option remains disabled

  @SCRUM-70 @AC4
  Scenario: UI remains stable under overlay obstruction
    Given I am on the Text Box section
    When I inject an overlay that covers the top of the page
    And I scroll the submit button into view
    Then I can click the submit button without error
    And the page remains responsive