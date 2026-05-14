Feature: Negative Path Validation for DemoQA Elements

  Scenario: Invalid email shows validation message
    Given the user is on the "Elements" page of DemoQA
    And the user sees a form with a email input field
    When the user enters an invalid email address (e.g., "notanemail")
    And the user attempts to submit the form
    Then the form should display a validation error indicating the email is invalid

  Scenario: Modal remains open on invalid input submission
    Given the user is on the DemoQA modal dialog
    And the modal contains a text input field
    When the user enters invalid data into the field
    And the user clicks the modal's submit button
    Then the modal should remain open
    And the modal should display an appropriate error message

  Scenario: Regression – valid email submission still works after negative changes
    Given the user is on the "Elements" page of DemoQA
    And the user has previously entered an invalid email that triggered validation
    When the user corrects the email to a valid address (e.g., "user@example.com")
    And the user submits the form
    Then the form should close or navigate to a success state without errors
    And no validation error message should be visible