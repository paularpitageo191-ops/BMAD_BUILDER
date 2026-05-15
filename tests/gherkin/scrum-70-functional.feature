Feature: DemoQA Elements Negative Path Validation
  As a user, I want to see proper validation when entering invalid data
  And ensure modals remain open on invalid input
  So that the application handles negative paths correctly

  Scenario: Invalid email displays validation error on Text Box
    Given I am on the Text Box tab
    When I enter an invalid email "invalid-email"
    And I click the Submit button
    Then I should see a validation error on the email field

  Scenario: Valid email submission succeeds (Regression)
    Given I am on the Text Box tab
    When I enter a valid email "test@example.com"
    And I click the Submit button
    Then the output section should display the submitted email

  Scenario: Modal remains open when invalid age is entered
    Given I am on the Web Tables tab
    When I click the "Add" button to open the registration modal
    And I enter an invalid age "abc"
    And I click "Submit" in the modal
    Then the registration modal should remain open

  Scenario: Modal remains open when invalid salary is entered
    Given I am on the Web Tables tab
    When I click the "Add" button to open the registration modal
    And I enter an invalid salary "xyz"
    And I click "Submit" in the modal
    Then the registration modal should remain open

  Scenario: Disabled radio button cannot be selected
    Given I am on the Radio Button tab
    When I click on the "No" radio button
    Then the "No" radio button should remain unchecked