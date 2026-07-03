# Traceability
Feature: Regression Guardrails for GIFT City Mutual Fund Guide Page  
  As a regression agent  
  I want to revalidate that core guide page behaviors remain stable  
  So that any content or navigational changes are detected before they affect test data traceability

  Scenario: Regression – Guide page loads without HTTP errors and displays key terms  
    Given the investor opens the target URL "https://iventures.in/feeds/blog/gift-city-mutual-fund"  
    When the page finishes loading  
    Then the page should not report any 4xx or 5xx HTTP errors in the console  
    And the page text should contain at least one of the terms: "GIFT City", "IFSC", "global securities"  
    And the page title should be non-empty and contain a mutual fund or GIFT City reference

  Scenario: Regression – FUND-GC-001 fund name remains present on the page  
    Given the guide page is fully loaded  
    When the user inspects all visible text content  
    Then the page should display the fund name associated with FUND-GC-001 from the test data (e.g., "GIFT City Mutual Fund")  
    And the asset class or fund type mentioned in the same section should match the Excel row description (e.g., "Equity" or "Debt")  
    (Assumption: the guide page lists specific fund names; if not, the test will log a warning)

  Scenario: Regression – Primary CTA element is still discoverable and navigates correctly  
    Given the guide page is loaded  
    When the user scans the page for buttons or links with text like "Invest", "Enquire", "Contact", or "Get Started"  
    Then at least one such CTA should be visible and enabled  
    When the user clicks the first discovered CTA  
    Then the resulting page should load without a 404 or 500 error  
    And the navigation should not produce a network failure

  Scenario: Regression – Number of visible fund listing items remains consistent  
    Given a baseline count of fund listing items (e.g., 3) is available  
    When the guide page is loaded  
    Then the counted fund listing items (using a common container selector) should match the baseline count  
    (If no baseline is available, the test will record the current count and pass)