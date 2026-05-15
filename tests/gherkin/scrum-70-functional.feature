Feature: Negative Path Validation for DemoQA Elements

  Scenario: Invalid email format triggers browser validation on Text Box submit
    Given the user is on the Text Box section of the DemoQA Elements page
    When the user fills "#userEmail" with "invalid-email"
    And the user clicks the "#submit" button
    Then the browser shows a validation message on the email field
    And no output is displayed in "#output"

  Scenario: Empty email submission is blocked by validation
    Given the user is on the Text Box section of the DemoQA Elements page
    When the user clears "#userEmail"
    And the user clicks the "#submit" button
    Then the browser shows a validation message on the email field
    And the "#output" element remains empty or hidden

  Scenario: Registration modal stays open after invalid First Name submission
    Given the user is on the Web Tables section of the DemoQA Elements page
    And the registration modal is open
    When the user leaves "First Name" empty
    And the user fills "Last Name" with "Doe"
    And the user fills "Email" with "john@example.com"
    And the user fills "#age" with "30"
    And the user fills "#salary" with "50000"
    And the user clicks the Submit button in the registration modal
    Then the registration modal remains visible

  Scenario: Registration modal stays open after non-numeric Age input
    Given the user is on the Web Tables section of the DemoQA Elements page
    And the registration modal is open
    When the user fills "First Name" with "John"
    And the user fills "Last Name" with "Doe"
    And the user fills "Email" with "john@example.com"
    And the user fills "#age" with "abc"
    And the user fills "#salary" with "50000"
    And the user clicks the Submit button in the registration modal
    Then the registration modal remains visible

  Scenario: Valid email submission works correctly (regression baseline)
    Given the user is on the Text Box section of the DemoQA Elements page
    When the user fills "#userEmail" with "valid.email@example.com"
    And the user clicks the "#submit" button
    Then the "#output" element contains the submitted data

  Scenario: Valid registration submission closes modal (regression baseline)
    Given the user is on the Web Tables section of the DemoQA Elements page
    And the registration modal is open
    When the user fills "First Name" with "Jane"
    And the user fills "Last Name" with "Doe"
    And the user fills "Email" with "jane@example.com"
    And the user fills "#age" with "28"
    And the user fills "#salary" with "60000"
    And the user clicks the Submit button in the registration modal
    Then the registration modal is no longer visible
    And a new row appears in the table