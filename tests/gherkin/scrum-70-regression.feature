# Traceability
Feature: Regression Guardrails for DemoQA Elements – SCRUM-70
  As a QA regression safeguard
  I want to revalidate key existing behaviors that could be disrupted by negative‑path validation changes
  So that core functionality remains stable after introducing new validation rules

Scenario: Regression – Valid email input still renders output section
  Given the user navigates to the DemoQA Elements Text Box page
    And the #userEmail field is visible and enabled
  When the user enters a valid email "user@example.com" into #userEmail
    And clicks the #submit button
  Then the #output section becomes visible
    And the submitted email is displayed in the output

Scenario: Regression – Web Tables accepts valid numeric inputs and adds row
  Given the user navigates to the DemoQA Elements Web Tables page
    And clicks the "Add" button to open the registration modal
  When the user enters valid data including Age "25" and Salary "50000"
    And clicks the modal "Submit" button
  Then the registration modal closes
    And a new row with the entered data appears in the table

Scenario: Regression – Text Box submission remains functional under overlay obstruction
  Given the user navigates to the DemoQA Elements Text Box page
    And a fixed overlay is injected covering the form area
  When the user enters a valid email "user@example.com" into #userEmail
    And scrolls #submit into view and clicks it
  Then the #output section appears with the submitted email
    And no JavaScript errors are thrown

Scenario: Regression – Radio button selection works via scrolling under overlay obstruction
  Given the user navigates to the DemoQA Elements Radio Button page
    And a fixed overlay covers the radio options
  When the user scrolls the "Yes" radio button into view
    And clicks the "Yes" radio option
  Then the output message displays "You have selected Yes"
    And the "Yes" radio remains selected