Feature: Negative Path Validation for DemoQA Elements

  Scenario: Invalid email shows validation error on Text Box submission
    Given I am on the DemoQA Elements page
    When I enter an invalid email "invalid-email" in the email field
    And I click the submit button
    Then the email field should show a validation error

  Scenario: Registration modal remains open on invalid age input
    Given I am on the DemoQA Elements page
    When I click the "Add New Record" button to open the registration modal
    And I enter invalid text "abc" in the age field
    And I click the modal submit button
    Then the registration modal should remain visible
    And the age field should show a validation error

  Scenario: Disabled radio button is non-interactable
    Given I am on the DemoQA Elements page
    When I view the radio button group
    Then the "No" radio button should be disabled
    And clicking it should not change its state

  Scenario: Overlay obstruction does not break UI stability
    Given I am on the DemoQA Elements page
    When an overlay is present over the page
    Then the overlay should be dismissable
    And the underlying page elements should remain unchanged