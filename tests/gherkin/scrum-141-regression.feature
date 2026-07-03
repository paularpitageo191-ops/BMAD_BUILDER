# Traceability
Feature: Regression Guardrails – GIFT City Mutual Fund Investment Guide
  As a QA regression agent
  I want to revalidate core structural elements of the investment guide page
  So that content updates do not silently break fundamental page expectations

  Scenario: Regression – Article core metadata (h1, date, author) remains visible
    Given the investor has opened the guide page at "https://iventures.in/feeds/blog/gift-city-mutual-fund"
    When the page is fully loaded
    Then the page must contain a non-empty top-level heading (h1) that refers to GIFT City
    And the page must contain a visible date text (e.g., a date string)
    And the page must contain a visible author name or byline

  Scenario: Regression – Page continues to load successfully without network errors
    Given the investor opens the guide page
    When the page loads
    Then the page title should include "GIFT City Mutual Fund" (or similar context)
    And no browser error page is displayed
    And the HTTP status is 200