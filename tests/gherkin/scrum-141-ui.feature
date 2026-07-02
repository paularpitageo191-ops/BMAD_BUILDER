# Traceability
Feature: GIFT City Mutual Fund Investment Guide Validation
  As an investor exploring global diversification
  I want to view the GIFT City mutual fund investment guide
  So that I can understand how GIFT City/IFSC mutual funds provide exposure to global securities

  Scenario: P0-AC1 Page loads successfully without errors
    Given the investor opens "https://iventures.in/feeds/blog/gift-city-mutual-fund"
    When the page finishes loading
    Then the page title contains "GIFT City Mutual Fund"
    And the page URL matches the target
    And the main article element is visible

  Scenario: P0-AC2 Core GIFT City and mutual fund content is visible
    Given the guide page is fully loaded
    When the investor scans the main article body
    Then the article text contains "GIFT City"
    And the article text contains "mutual fund" (case‑insensitive)
    And the article text references "international" or "global" investment

  Scenario: P1-AC3 NSE IFSC / global securities context is discoverable
    Given the guide page is fully loaded
    When the investor searches the article body for key terms
    Then the page contains at least one of: "NSE IFSC", "IFSC", "global securities", "GIFT City route", "international exposure"

  Scenario: P1-AC4 Desktop readability – content sections visible and not overlapped
    Given the browser viewport is set to 1440×900
    When the investor opens the guide and scrolls through the entire page
    Then all major heading elements (h2, h3) are visible when scrolled to
    And no two visible text elements have overlapping bounding boxes

  Scenario: P1-AC4 Mobile readability – content responsive and readable
    Given the browser viewport is set to 390×844
    When the investor opens the guide
    Then there is no horizontal scrollbar
    And all major headings are visible when scrolled to
    And body text font size is at least 14px
    And images are responsive (max‑width: 100%)

  Scenario: P2-AC5 CTA/reference links have valid hrefs
    Given the guide page is fully loaded
    When the investor inspects all visible anchor elements
    Then every visible link has a non‑empty href
    And no link uses "#" or "javascript:void(0)"
    And links are not disabled

  Scenario: P2-AC6 Graceful handling when content is unavailable
    Given network interception blocks the target page and returns a 500 status
    When the investor opens the guide URL
    Then the test captures the failure with page title, URL, response status, and a screenshot
    And no unhandled exception occurs

  Scenario: Page title and main heading reflect guide content
    Given the guide page is loaded
    When the investor reads the page title and the main h1 element
    Then the page title contains "GIFT City" and "mutual fund"
    And the h1 text contains "GIFT City" and "mutual fund"

  Scenario: Regression – all page resources load successfully
    Given the guide page is loaded with network interception enabled
    When the page requests images, stylesheets, and fonts
    Then each resource returns a 200 or 304 status
    And no resource returns 404 or 500