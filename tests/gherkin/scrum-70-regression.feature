# Traceability
# Functional Areas: Radio Button, Text Box, UI Stability, Web Tables
# Source References: AC1, AC2, AC3, AC4, Screenshot: Invalid numeric input behavior (baseline), Screenshot: Valid input → output section rendered, Test Data: Empty/null inputs, Test Data: Invalid email formats, Test Data: Non-numeric values, Test Data: Non-numeric values (e.g., abc, 12ab)
# Execution Readiness: strong
# Readiness Rationale: There is enough technical context to support executable coverage where the approved scope requires it.
Feature: Regression Protection — DemoQA Elements Negative Paths

  Background:
    Given the user is on the DemoQA Elements page

  Scenario: Text Box email validation persists after rebuild
    Given the Text Box section is visible
    When the user enters an invalid email "test@domain" in the #userEmail field
    And clicks the Submit button
    Then the #userEmail field shows a validation error
    And the #output section is not displayed

  Scenario: Web Tables modal rejects non-numeric Age and remains open
    Given the Registration modal is open
    When the user enters non-numeric text "abc" in the Age field
    And submits the form
    Then the modal stays open
    And no new row is added to the table
    And the Age field indicates an error

  Scenario: Radio Button "No" remains disabled and unclickable
    Given the Radio Button section is visible
    When the user inspects the #noRadio element
    Then it has the disabled attribute
    And clicking it does not change the radio group selection
    And no "No" output text appears

  Scenario: UI remains interactable under viewport obstruction
    Given the browser viewport is set to 800x600
    When the user scrolls to the Text Box section
    And types a valid email in #userEmail
    Then the input is accepted without errors
    And the element is interactable

  Scenario: Historical fragile area — Web Tables Salary field validation
    Given the Registration modal is open
    When the user enters mixed input "12ab" in the Salary field
    And submits the form
    Then the modal remains open
    And the Salary field shows validation error
    And no new row is added
    (Regression justification: Salary field has repeated regressions in prior builds)