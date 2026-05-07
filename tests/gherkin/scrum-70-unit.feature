@SCRUM-70 @Forensic-AEGIS-2026-MAY-13AF
Feature: Negative Path Validation for DemoQA Elements Module

  Scenario: AC1 – Invalid email validation in Text Box
    Given the user navigates to the DemoQA Text Box page
    When the user enters an invalid email (e.g., "test@domain") into #userEmail
    And clicks the Submit button
    Then a validation error (e.g., red border or HTML5 message) appears on #userEmail
    And the output section #output is not displayed

  Scenario: AC2 – Non-numeric Age/Salary blocks submission in Web Tables
    Given the user navigates to the DemoQA Web Tables page
    When the user clicks the Add button to open the registration modal
    And fills First Name and Last Name with valid data
    And fills the Age field with a non-numeric value (e.g., "abc")
    And fills the Salary field with a non-numeric value (e.g., "12ab")
    And clicks the Submit button
    Then the registration modal remains open (visible)
    And no new row is added to the table

  Scenario: AC3 – Disabled Radio Button "No" remains non-interactable
    Given the user navigates to the DemoQA Radio Button page
    Then the radio option #noRadio is disabled
    When the user attempts to click #noRadio
    Then the disabled state of #noRadio is unchanged
    And no change in the selected radio state is reflected on the page

  Scenario: AC4 – UI stability under obstruction (e.g., overlays)
    Given the user navigates to any DemoQA Elements page
    When an overlay (e.g., ad or injected element) partially blocks the view
    Then all interactive elements can still be scrolled into view
    And the user can interact with elements using Playwright's scrollIntoViewIfNeeded and force click
    And no crash or unhandled exception occurs