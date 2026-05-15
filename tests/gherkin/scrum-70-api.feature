Feature: Web Table Registration - Email Validation

  @regression @negative
  Scenario: Invalid email format shows validation error
    Given the user is on the Web Tables page
    When the user clicks "Add" to open the registration modal
    And the user enters invalid email "invalid-email"
    And the user submits the form
    Then the modal remains open
    And the email field shows a validation error

  @regression @negative
  Scenario: Empty email field shows validation error
    Given the user is on the Web Tables page
    When the user opens the registration modal
    And the user leaves the email field empty
    And the user submits the form
    Then the modal remains open
    And the email field shows a validation error