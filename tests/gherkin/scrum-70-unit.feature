@SCRUM-70 @Forensic-AEGIS-2026-MAY-E63D
Feature: Negative Path Validation for DemoQA Elements Module

  Background:
    Given the user navigates to the DemoQA Elements page

  Scenario: AC1 – Email Validation for invalid email
    Given the user is on the Text Box page
    When the user enters an invalid email "test@domain" in the #userEmail field
    And clicks the Submit button
    Then the #userEmail field shows a validation error
    And the #output section is not visible

  Scenario: AC2 – Web Tables Validation with non-numeric age and salary
    Given the user is on the Web Tables page
    When the user clicks the Add button to open the registration modal
    And enters "abc" in the Age field and "12ab" in the Salary field
    And clicks the Submit button in the modal
    Then the registration modal remains open
    And no new row is added to the table

  Scenario: AC3 – Radio Button Validation for disabled option
    Given the user is on the Radio Button page
    When the user locates the "#noRadio" element
    Then the element is disabled
    When the user clicks the "#noRadio" element
    Then the element remains unchecked and no state change occurs

  Scenario: AC4 – UI Stability under overlay obstruction
    Given the user is on the Web Tables page
    When the user opens the registration modal
    And the modal overlays the table
    When the user closes the modal by clicking the Cancel button
    Then the table is still displayed and the page remains interactable
    And the user can click the "Add" button again to open a new modal