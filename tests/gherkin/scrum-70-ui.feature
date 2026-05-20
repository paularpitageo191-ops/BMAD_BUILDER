# Traceability
Feature: DemoQA Elements – Negative Path Validation

  Scenario: TC01 – Text Box: Valid email displays output
    Given the user is on the Text Box page at "/text-box"
    When the user enters "valid.email@example.com" into the email field
    And the user clicks the Submit button
    Then the output section "#output" becomes visible and contains the submitted email

  Scenario: TC02 – Text Box: Invalid email formats trigger validation error
    Given the user is on the Text Box page at "/text-box"
    When the user enters "test@domain" into the email field
    And the user clicks the Submit button
    Then the email field shows a validation error (HTML5 validation message)
    And the output section "#output" remains hidden
    When the user clears the field and enters "missingatsymbol.com"
    And the user clicks the Submit button
    Then the email field again shows a validation error
    And "#output" remains hidden

  Scenario: TC03 – Web Tables: Non-numeric Age blocks submission
    Given the user is on the Web Tables page at "/webtables"
    When the user clicks the "Add New Record" button
    And fills First Name "John", Last Name "Doe", Email "j@d.com"
    And fills Age with "abc"
    And clicks the Submit button in the modal
    Then the registration modal remains open
    And no new row appears in the table
    And a validation error is indicated on the Age field (browser validity)

  Scenario: TC04 – Web Tables: Non-numeric Salary blocks submission
    Given the user is on the Web Tables page at "/webtables"
    When the user clicks the "Add New Record" button
    And fills First Name "John", Last Name "Doe", Email "j@d.com", Age "25"
    And fills Salary with "abc"
    And clicks the Submit button in the modal
    Then the registration modal remains open
    And no new row appears in the table
    And a validation error is indicated on the Salary field

  Scenario: TC05 – Web Tables: Both Age and Salary non-numeric blocks submission
    Given the user is on the Web Tables page at "/webtables"
    When the user clicks the "Add New Record" button
    And fills First Name "John", Last Name "Doe", Email "j@d.com"
    And fills Age with "abc", Salary with "12xy"
    And clicks the Submit button in the modal
    Then the registration modal remains open
    And no new row appears
    And validation errors appear on both Age and Salary fields

  Scenario: TC06 – Radio Button: Disabled 'No' option does not change state on click
    Given the user is on the Radio Button page at "/radio-button"
    Then the "No" radio button (#noRadio) is disabled
    When the user attempts to click the disabled "No" radio button (using force action)
    Then the radio button remains disabled
    And no "selected" indicator appears
    And no success message is displayed

  Scenario: TC07 – Radio Button: Select 'Yes' option works (positive baseline)
    Given the user is on the Radio Button page at "/radio-button"
    When the user clicks the "Yes" radio button
    Then the "Yes" radio button becomes selected
    And the success message "You have selected Yes" is displayed below the buttons

  Scenario: TC09 – UI Stability: Web Tables remain interactable under scroll after page resize
    Given the user is on the Web Tables page at "/webtables"
    When the viewport is set to 800x600
    And the user scrolls until the "Add New Record" button is visible
    And the user clicks that button
    Then the registration modal opens successfully
    And no JavaScript errors or scroll jump occur