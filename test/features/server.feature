@tags=local

Feature: Custom local server

Scenario: Load static files through a custom server

  Given loaded "/index.html"
  Then "h1" should contain "It works!"
