Feature: DemoQA Elements Negative Validation

  Scenario: Invalid email on Text Box shows validation error
    Given the user is on the Text Box page
    When the user enters an invalid email "invalid-email" into the email field
    And the user clicks the Submit button
    Then the output area should not be visible
    And the email field should have a validation error state

  Scenario: Invalid email in Web Tables modal keeps modal open and shows validation
    Given the user is on the Web Tables page
    When the user clicks the Add button to open the registration modal
    And the user enters an invalid email "bad-email@" into the email field
    And the user clicks the Submit button in the modal
    Then the modal should remain open
    And the email field should show a validation error

  Scenario: Disabled radio button remains non-interactable (regression)
    Given the user is on the Radio Button page
    When the user attempts to click the "No" radio button
    Then the button should remain unselected and disabled
    And no change in selected option occurs