# Traceability
Feature: GIFT City Mutual Fund Investment Guide - Regression Suite

  Background:
    Given the investor navigates to https://iventures.in/feeds/blog/gift-city-mutual-fund
    And the page loads without errors

  @regression @P2
  Scenario: Regression - Resource loading integrity for images, CSS, and fonts
    Given the page is fully loaded
    When all network requests for images, stylesheets, and font resources complete
    Then each resource should return a successful status (200 or 304)
    And no resource should return a client or server error (4xx, 5xx)

  @regression @P0
  Scenario: Regression - Core content references to GIFT City and mutual funds persist
    Given the investment guide page is displayed
    When the investor scans the main article content
    Then the visible text should contain "GIFT City"
    And the visible text should contain "Mutual Fund"
    And the visible text should contain at least one of "global" or "international" in the context of investment

  @regression @P2
  Scenario: Regression - CTA and reference links have valid href attributes and are visible
    Given the investor scrolls through the guide page
    When the investor identifies all visible calls to action and reference links
    Then each link should have a non-empty href attribute
    And no link should cause a JavaScript error when present

  @regression @P1
  Scenario: Regression - Mobile viewport does not introduce horizontal scroll or content clipping
    Given the browser viewport is set to 390x844 pixels
    When the investor scrolls through the entire guide
    Then there should be no horizontal scrollbar
    And all major section headings (h2, h3) should be fully visible when scrolled into view