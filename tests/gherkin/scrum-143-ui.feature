# Traceability
Feature: GIFT City Mutual Fund Investor Journey
  As an investor
  I want to view the GIFT City mutual fund guide and interact with available CTAs
  So that I can understand global securities exposure and proceed with investment

  Scenario: Guide page loads with GIFT City MF content (AC1)
    Given an investor opens the target URL https://iventures.in/feeds/blog/gift-city-mutual-fund
    When the page finishes loading
    Then the page title or body should contain references to "GIFT City", "IFSC", or "global securities"
    And the page should load without HTTP errors or console errors

  Scenario: CTA is discoverable and navigates correctly (AC2)
    Given the guide page is loaded
    When the user scans for visible links or buttons with text containing "Invest", "Enquiry", "Contact", "Get Started", or "Next Step"
    Then at least one such CTA should be visible
    When the user clicks the first visible CTA
    Then the destination page should load successfully (HTTP 200) and not be a broken link

  Scenario: Eligible investor INV-001 can submit a form (AC3)
    Given the user navigates to the CTA destination from AC2
    When the user fills all visible form fields with valid data derived from eligible investor INV-001
    And submits the form
    Then the form should submit successfully without JavaScript errors
    And a success or next-step page should be displayed

  Scenario: Ineligible investor INV-003 is blocked (AC4, negative)
    Given the user navigates to the CTA destination
    When the user fills form fields with data from ineligible investor INV-003 (e.g., incomplete PAN, non-resident status)
    And attempts to submit the form
    Then the form should remain on the same page or show an error message indicating ineligibility
    And no server error or timeout should occur

  Scenario: Minimum investment amount 1000 is accepted (AMT-004, boundary)
    Given the user is on the CTA form page
    When the user enters an amount of 1000 (from AMT-004) with otherwise valid data
    And submits the form
    Then no amount-specific validation error should appear
    And the submission should proceed to a success or next step (if applicable)

  Scenario: Maximum investment amount 500000 is accepted (AMT-005, boundary)
    Given the user is on the CTA form page
    When the user enters an amount of 500000 (from AMT-005) with otherwise valid data
    And submits the form
    Then no amount-specific validation error should appear
    And the submission should proceed to a success or next step (if applicable)

  Scenario: Negative amount -1000 is rejected (AMT-008, boundary/negative)
    Given the user is on the CTA form page
    When the user enters an amount of -1000 (from AMT-008) with otherwise valid data
    And tries to submit the form
    Then an error message indicating invalid amount should appear
    And the form submission should be blocked

  Scenario: Required disclosure DISC-002 is present (AC4, compliance)
    Given the user is on the guide page
    When the page is fully loaded
    Then the text "subject to market risk" or equivalent from DISC-002 should be visible in the page body

  @automation-validation
  Scenario: Full executable automation validation (AC6)
    Given the Playwright test suite is configured
    When all the scenarios above are executed
    Then all tests pass with zero failures