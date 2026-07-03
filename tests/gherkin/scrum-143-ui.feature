# Traceability
Feature: GIFT City Mutual Fund Investment Guide

  Scenario: TC01 - Guide page loads with core GIFT City MF content (AC1)
    Given an investor opens the target URL
    When the page finishes loading
    Then the page should display GIFT City mutual fund investment guide content
    And the page should contain references to "GIFT City", "IFSC", or "global securities"
    And no HTTP errors should appear in the console

  Scenario: TC02 - Discover and interact with visible CTAs (AC2)
    Given the guide page is loaded
    When the user scans the page for investment, enquiry, contact, or next-step CTAs
    Then at least one visible CTA or next-step link should be present
    And clicking the first such CTA should not lead to a 404 error

  Scenario: TC03 - Eligible investor INV-001 accesses guide and discovers CTA (AC3/AC5)
    Given the investor has eligibility per test data INV-001 (KYC verified, resident)
    When the user navigates to the guide page
    Then the page should contain GIFT City content and at least one investment/enquiry CTA
    And the confirmation expectation CONF-001 is noted but not executable on this public page

  Scenario: TC04 - Eligible investor INV-002 accesses guide (AC3/AC5)
    Given the investor has eligibility per test data INV-002 (different KYC/residency variation)
    When the user opens the guide page
    Then the page should load with GIFT City content and available CTAs
    And the confirmation expectation CONF-001 is noted but not executable

  Scenario: TC05 - Ineligible investor INV-003 sees eligibility information (AC4)
    Given the investor's profile matches INV-003 (ineligible status)
    When the user reads the guide page
    Then the page should reference eligibility criteria or restrictions for GIFT City investments

  Scenario: TC06 - Boundary amount AMT-004 minimum investment (AC4)
    Given the guide page contains investment information
    When the user reviews the amount section
    Then the page should mention minimum investment amounts or guidelines
    (Note: automated submission validation not possible on this public page)

  Scenario: TC07 - Disclosure acceptance failure DISC-002 (AC4)
    Given the guide page is loaded
    When the user scans for compliance and disclosure information
    Then the page should include mandatory disclosure references or risk disclaimers
    (Note: interactive submission validation not possible)

  Scenario: TC08 - Fund display references FUND-GC-001 on guide page (AC5)
    Given the guide page is loaded
    When the user views the fund listing or mention section
    Then the page should display the fund name matching FUND-GC-001
    And asset class or fund type should be present

  Scenario: TC09 - Regression: Guide page content stability (AC1/AC2)
    Given a baseline of expected page content (e.g., key paragraphs, fund items, CTA text)
    When the page is loaded
    Then the number of fund items and key text phrases should remain unchanged from baseline