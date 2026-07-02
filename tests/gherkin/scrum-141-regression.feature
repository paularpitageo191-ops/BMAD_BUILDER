# Traceability
Feature: GIFT City Mutual Fund Guide – Regression Guardrails

  Scenario: Page loads successfully with valid HTTP status and content length
    Given the investor opens https://iventures.in/feeds/blog/gift-city-mutual-fund
    When the page finishes loading
    Then the page returns HTTP 200 and has a non‑empty title containing "GIFT City"
    And the body text exceeds 100 characters

  Scenario: Core educational keywords remain present in the article
    Given the investment guide page is fully loaded
    When the investor scans the main content
    Then the visible article text contains "GIFT City"
    And the visible article text contains "mutual fund"
    And the visible article text contains at least one of "IFSC", "global", "international"

  Scenario: All visible outbound and reference links have non‑empty href values
    Given the investor is on the guide page
    When the investor reviews all visible anchor elements
    Then every link’s href attribute is present and not empty
    And no link triggers page‑crashing behavior upon hover or scroll

  Scenario: Desktop viewport (1440×900) – no overlapping or hidden content sections
    Given the guide page is loaded at a desktop viewport size of 1440×900 pixels
    When the investor scrolls through the entire article
    Then no two distinct content elements overlap
    And at least three paragraphs have positive bounding box heights

  Scenario: Mobile viewport (390×844) – article remains readable without overlap
    Given the guide page is loaded at a mobile viewport size of 390×844 pixels
    When the investor scrolls through the entire article
    Then no two distinct content elements overlap
    And headings (h1–h3) are fully visible within the viewport

  Scenario: Page failure is captured with evidence for defect reporting
    Given the target page returns a non‑200 status or fails to load
    When the test observes the failure
    Then the test captures the page title, URL, HTTP status, browser console logs, and a screenshot
    And the test reports a descriptive error with the captured evidence