# Traceability
Feature: Negative Path Validation for DemoQA Elements Module
  As a QA Engineer
  I want to validate negative scenarios in the Elements module
  So that invalid inputs are handled correctly and the UI remains stable under edge conditions

  Background:
    Given I am on the DemoQA Elements page

  # -- Email Validation (AC1) --

  Scenario: Email Validation - Invalid format (missing TLD) blocks submission and hides output
    Given I am on the Text Box page
    When I enter invalid email "test@domain" into #userEmail
    And I click #submit
    Then #userEmail should show validation error (red border/error message)
    And #output should not be visible in the DOM

  Scenario: Email Validation - Valid format displays output
    Given I am on the Text Box page
    When I enter valid email "test@example.com" into #userEmail
    And I click #submit
    Then #userEmail should have no validation error
    And #output should be visible with the submitted email displayed

  # -- Web Tables Validation (AC2) --

  Scenario: Web Tables - Non-numeric Age blocks submission and modal stays open
    Given I am on the Web Tables page
    And I open the registration modal via Add button
    When I fill all required fields with valid data except Age
    And I enter "abc" into #age
    And I click Submit in the modal
    Then the registration modal should remain open
    And #age should show a validation error "Please enter a number"
    And no new row should be added to the table

  Scenario: Web Tables - Non-numeric Salary blocks submission and modal stays open
    Given I am on the Web Tables page
    And I open the registration modal via Add button
    When I fill all required fields with valid data except Salary
    And I enter "12ab" into #salary
    And I click Submit in the modal
    Then the registration modal should remain open
    And #salary should show a validation error "Please enter a number"
    And no new row should be added to the table

  Scenario: Web Tables - Empty Age and Salary block submission
    Given I am on the Web Tables page
    And I open the registration modal via Add button
    When I fill all required fields with valid data but leave Age and Salary empty
    And I click Submit in the modal
    Then the registration modal should remain open
    And #age and #salary should show required-field validation errors
    And no new row should be added to the table

  Scenario: Web Tables - Valid Age and Salary submit successfully
    Given I am on the Web Tables page
    And I open the registration modal via Add button
    When I fill all required fields with valid data: First Name "John", Last Name "Doe", Email "john@example.com", Age "30", Salary "50000", Department "QA"
    And I click Submit in the modal
    Then the registration modal should close
    And a new row containing the submitted data should appear in the table

  # -- Radio Button Validation (AC3) --

  Scenario: Radio Button - Disabled "No" option remains non-interactable
    Given I am on the Radio Button page
    When I verify #noRadio has disabled attribute
    And I attempt to click #noRadio
    Then #noRadio should remain disabled
    And no success message for "No" should appear

  Scenario: Radio Button - Enabled "Yes" option can be selected
    Given I am on the Radio Button page
    When I click "Yes" radio button
    Then the "Yes" radio button should become selected
    And confirmation text "You have selected Yes" should appear

  # -- UI Stability (AC4) --

  Scenario: UI Stability - Overlay obstruction does not break interaction on Text Box page
    Given I am on the Text Box page
    When I inject a fixed overlay covering the top half of the page
    And I scroll #userEmail into view and click it
    And I enter text "test@example.com" into #userEmail
    And I click #submit
    Then no JavaScript errors occur
    And email validation still works as expected (valid input shows #output)
    And after removing the overlay, the page is in normal state