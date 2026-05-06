Feature: Negative Path Validation for DemoQA Elements Module

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-7EA9
  Scenario Outline: AC1 – Email Validation rejects invalid email
    Given I am on the DemoQA Text Box page
    When I enter "<email>" in the email field
    And I click the submit button
    Then I should see a validation error on the email field
    And the output section should not be displayed

    Examples:
      | email               |
      | test@domain         |
      | invalid.email@      |
      | @domain.com         |
      | user@.com           |
      |                     |

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-7EA9
  Scenario Outline: AC2 – Web Tables blocks non-numeric Age or Salary
    Given I am on the DemoQA Web Tables page
    When I click the Add button
    And I fill all required fields with valid data except "<field>" set to "<value>"
    And I submit the form
    Then the registration modal should remain open
    And an error should be indicated on the "<field>" input

    Examples:
      | field | value |
      | age   | abc   |
      | age   | 12ab  |
      | salary| xyz   |
      | salary| ab12  |

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-7EA9
  Scenario: AC3 – Radio Button "No" remains disabled and unclickable
    Given I am on the DemoQA Radio Button page
    Then the "No" radio button should be disabled
    When I click the "No" radio button
    Then the "No" radio button should still be disabled
    And clicking it should not change its state

  @SCRUM-70 @Forensic-AEGIS-2026-MAY-7EA9
  Scenario: AC4 – UI remains stable after overlay interaction
    Given I am on the DemoQA Web Tables page
    When I open the registration modal
    And I close the registration modal
    Then the Add button should be clickable
    And the table should still be visible