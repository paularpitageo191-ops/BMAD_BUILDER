Feature: Negative Path Validation for DemoQA Elements

  Scenario: Invalid email shows validation error
    Given the user navigates to the Text Box section on DemoQA Elements
    When the user enters "invalid" in the #userEmail field
    And the user clicks the #submit button
    Then the #userEmail field displays a validation error
    And the #output element is not populated

  Scenario: Registration modal stays open after invalid age input (non-numeric)
    Given the user navigates to the Web Tables section on DemoQA Elements
    And the user opens the Add Record modal by clicking #addNewRecordButton
    When the user enters "abc" in the #age field
    And the user clicks the modal's submit button
    Then the modal dialog remains visible
    And the #age field shows a validation error

  Scenario: Registration modal stays open after salary exceeding maxlength
    Given the user navigates to the Web Tables section on DemoQA Elements
    And the user opens the Add Record modal by clicking #addNewRecordButton
    When the user enters "12345678901" in the #salary field
    And the user clicks the modal's submit button
    Then the modal dialog remains visible
    And the #salary field shows a validation error

  Scenario: Disabled No radio button remains non-interactable
    Given the user navigates to the Radio Button section on DemoQA Elements
    When the user attempts to click the #noRadio element
    Then the #noRadio element remains unselected
    And no state change occurs