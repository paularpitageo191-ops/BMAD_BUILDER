Feature: Negative Path Validation for DemoQA Elements Module

@SCRUM-70 @Forensic-AEGIS-2026-MAY-D03C
Scenario: AC1 – Invalid email triggers validation error and hides output
  Given the user is on the Text Box page at "/text-box"
  When the user enters the invalid email "test@domain" into the email field #userEmail
  And clicks the Submit button
  Then the email field should have the CSS class "field-error"
  And the output section #output should not be visible

@SCRUM-70 @Forensic-AEGIS-2026-MAY-D03C
Scenario: AC2 – Non-numeric Age in Web Tables blocks submission and modal stays open
  Given the user is on the Web Tables page at "/webtables"
  When the user clicks the Add button to open the registration modal
  And enters "abc" into the Age field
  And clicks the Submit button in the modal
  Then the registration modal should remain visible
  And the Age field should have the CSS class "invalid"

@SCRUM-70 @Forensic-AEGIS-2026-MAY-D03C
Scenario: AC3 – Disabled "No" radio button remains disabled and unclickable
  Given the user is on the Radio Button page at "/radio-button"
  Then the #noRadio element should have the disabled attribute
  When the user attempts to click the disabled radio button
  Then the #noRadio element should remain unchecked
  And no success message should appear

@SCRUM-70 @Forensic-AEGIS-2026-MAY-D03C
Scenario: AC4 – UI remains interactable under overlay obstruction
  Given the user is on the Text Box page at "/text-box"
  When an overlay is added that covers the Submit button
  Then the Submit button can be clicked after scrolling it into view
  And the page remains stable without layout shifts