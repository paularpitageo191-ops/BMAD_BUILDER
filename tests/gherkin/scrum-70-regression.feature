@SCRUM-70 @Forensic-AEGIS-2026-MAY-B831
Feature: Negative Path Validation for DemoQA Elements Module

  Background:
    Given I navigate to the DemoQA Elements page
    And I click on the "Text Box" tab in the sidebar

  # AC1 – Email Validation
  @AC1
  Scenario Outline: Invalid email triggers validation error and no output
    When I type invalid email "<invalid_email>" into the Email field
    And I click the Submit button
    Then I should see a validation error on the Email field
    And the output section "#output" should not be displayed

    Examples:
      | invalid_email             |
      | test@domain               |
      | user@.com                 |
      | @example.com              |
      | plainaddress              |

  # AC2 – Web Tables Validation
  @AC2
  Scenario: Non-numeric Age or Salary blocks submission and modal stays open
    Given I click on the "Web Tables" tab in the sidebar
    And I click the "Add" button to open the registration form modal
    When I fill the First Name with "John"
    And I fill the Last Name with "Doe"
    And I fill the Age with "abc"
    And I fill the Salary with "12ab"
    And I click the Submit button inside the modal
    Then the registration modal should remain visible
    And the form should not be submitted (no new row in table)

  # AC3 – Radio Button Validation
  @AC3
  Scenario: Disabled "No" radio button remains disabled and unclickable
    Given I click on the "Radio Button" tab in the sidebar
    Then the "No" radio button (#noRadio) should be disabled
    When I attempt to click the "No" radio button
    Then its state should remain disabled and not change

  # AC4 – UI Stability under Obstruction
  @AC4
  Scenario: Elements remain interactable when an overlay obstructs the page
    Given I inject a fixed overlay that covers the entire viewport
    When I scroll to the Email field
    Then I can still type text into the Email field
    And I can see the validation error for invalid input if triggered
    And the overlay does not prevent interaction