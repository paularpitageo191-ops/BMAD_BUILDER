# Traceability
Feature: Regression Guardrails – DemoQA Elements Positive Behaviors
  As a QA regression agent
  I want to revalidate that positive flows still work after negative validation testing
  So that the application remains stable and no regressions are introduced.

  Background: Navigate to DemoQA Elements hub
    Given I am on the DemoQA Elements page

  Scenario: Positive email submission shows output section
    Given I navigate to the Text Box page
    When I enter a valid email "user@example.com" in #userEmail
    And I click #submit
    Then #output should be visible
    And #output should contain the submitted email

  Scenario: Valid web table entry creates a new row and modal closes
    Given I navigate to the Web Tables page
    When I click #addNewRecordButton
    And I fill the registration modal with valid data (First Name, Last Name, valid email, numeric age 30, numeric salary 50000, Department)
    And I click #submit inside the modal
    Then the registration modal should close
    And I should see a new row with the email "newuser@example.com" in the table

  Scenario: Positive radio button selection shows success message
    Given I navigate to the Radio Button page
    When I click #yesRadio
    Then I should see the text "Yes" highlighted with class .text-success

  Scenario: UI remains interactable under overlay obstruction
    Given I navigate to the Text Box page
    When I inject an overlay covering 30% of the viewport over the form
    Then I can scroll to #userEmail and it becomes visible
    When I type a valid email and click #submit using force click
    Then #output should be displayed

  Scenario: Scrolling to elements across the hub works
    Given I set viewport to 800x600
    And I navigate to the Elements hub
    When I scroll to the "Text Box" section and interact
    And I scroll to the "Radio Button" section and click "Yes"
    Then all interactions succeed without console errors