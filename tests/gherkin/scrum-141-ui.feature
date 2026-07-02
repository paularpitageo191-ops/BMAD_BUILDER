# Traceability
Feature: GIFT City Mutual Fund Investment Guide

  @positive @high @demo
  Scenario: Page loads successfully without errors
    Given the investor opens "https://iventures.in/feeds/blog/gift-city-mutual-fund"
    When the page finishes loading (networkidle)
    Then the HTTP response status is 200
    And the page title contains "GIFT City" or "Mutual Fund"
    And the body text has at least 100 characters
    And there are no console errors (404, syntax errors)

  @positive @high @demo
  Scenario: Guide contains visible references to GIFT City and mutual funds
    Given the page has loaded successfully
    When the investor scans the main article content
    Then the visible text includes "GIFT City" (case‑insensitive)
    And the visible text includes "mutual fund" or "mutual funds"
    And the content references international or global investment exposure

  @positive @medium @demo
  Scenario: NSE IFSC / global securities context is discoverable
    Given the guide page is loaded
    When the investor searches the article body for investment route details
    Then the visible text contains at least one of "NSE IFSC", "IFSC", "global securities", "SEZ"

  @positive @medium @responsive
  Scenario: Desktop viewport (1440×900) – article content is readable
    Given the page is loaded in a 1440×900 viewport
    When the investor scrolls through the entire article
    Then no two visible content elements from different sections overlap
    And at least three paragraphs have positive height
    And headings (h1–h3) are visible

  @positive @medium @responsive
  Scenario: Mobile viewport (390×844) – article content is readable without horizontal scroll
    Given the page is loaded in a 390×844 viewport
    When the investor scrolls through the article
    Then the body width is less than or equal to the viewport width (no horizontal overflow)
    And at least two headings and three paragraphs are visible with non‑zero dimensions

  @positive @low @links
  Scenario: CTA and reference links have valid href values
    Given the guide page is loaded
    When the investor reviews all visible anchor elements
    Then every visible link has a non‑empty href not equal to "#" or "javascript:void"
    And clicking a sample of 2–3 external links opens them without crashing the page

  @negative @low @error-handling
  Scenario: Graceful evidence capture when page content is unavailable
    Given a simulated network failure or a 404/blocked condition for the guide URL
    When the investor tries to open the page
    Then the test captures the page title, URL, HTTP status, and takes a screenshot
    And the test does not crash; the failure is recorded as evidence

  @boundary @low @robustness
  Scenario: URL variants (trailing slash, uppercase) resolve to the same content
    Given the canonical URL "https://iventures.in/feeds/blog/gift-city-mutual-fund"
    When the investor opens variants: with trailing slash, without slash, and with different casing
    Then each variant either shows the guide content or redirects to the canonical URL
    And no variant results in a 404 or server error