# Traceability
Feature: GIFT City Mutual Fund Investment Guide Page Validation
  As an investor exploring global diversification
  I want to verify the GIFT City mutual fund guide content
  So that I can trust the educational information before making decisions

  Scenario: Positive - Page loads successfully without errors (AC1)
    Given the investor opens the GIFT City mutual fund guide at "https://iventures.in/feeds/blog/gift-city-mutual-fund"
    When the page finishes loading
    Then the page should display an article about GIFT City mutual fund investments
    And the page title should contain "GIFT City Mutual Fund"
    And no browser error or network error should appear

  Scenario: Positive - Core GIFT City mutual fund content is visible (AC2)
    Given the investment guide page is loaded
    When the investor scans the main article content
    Then the page should contain visible text mentioning "GIFT City"
    And the page should contain visible text mentioning "mutual fund"
    And the page should contain at least one term indicating international or global exposure such as "international", "global", or "worldwide"

  Scenario: Positive - NSE IFSC / global securities context is discoverable (AC3)
    Given the investment guide page is loaded
    When the investor searches the article body for IFSC-related context
    Then the page should contain visible text mentioning "NSE IFSC" or "IFSC"
    And the page should contain visible text referencing global securities or international investments

  Scenario: Visual - Desktop viewport readability (AC4)
    Given the investor opens the guide on a desktop viewport of 1440x900 pixels
    When the investor scrolls through the entire page
    Then the article content should remain fully visible without overlapping elements
    And no text should be clipped or hidden behind other sections
    And scrolling reveals all content without abrupt layout shifts

  Scenario: Visual - Mobile viewport readability (AC4)
    Given the investor opens the guide on a mobile viewport of 390x844 pixels
    When the investor scrolls through the entire page
    Then no horizontal scrollbar should appear
    And all text should be readable without truncation
    And images should fit within the viewport width
    And no elements should overlap

  Scenario: Positive - CTA / reference links are visible and have valid href (AC5)
    Given the investment guide page is loaded
    When the investor reviews all visible links inside the article
    Then each link should have a non-empty href attribute that is not "#" or "javascript:void(0)"
    And clicking a representative link should not cause the page to crash or show console errors

  Scenario: Negative - Graceful evidence capture when content is unavailable (AC6 route interception)
    Given the page or a key content section cannot be loaded (simulated 404 via route interception)
    When the investor opens the URL
    Then the test should capture the page title, current URL, and a screenshot
    And the test should not crash; it should record a failure with evidence

  Scenario: Negative - Page returns 404 or server error when resource missing (AC6 broken URL)
    Given the investor opens a non-existent URL "https://iventures.in/feeds/blog/gift-city-mutual-fund-broken"
    When the page response is received
    Then the HTTP status should be 404 or 5xx
    And the page title and screenshot should be captured without a browser-level error

  Scenario: Regression - Expected content sections are present (heading, date, author)
    Given the investment guide page is loaded
    When the investor examines the blog structure
    Then there should be an H1 heading element that is not empty
    And there should be a visible date reference (e.g., "January 5, 2025")
    And there should be an author name or byline visible