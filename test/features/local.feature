@tags=local

Feature: Lsing localhost

Scenario: Load a simple html document

  Given loaded "http://0.0.0.0:8000/"
  Then "body" should contain "It works!"
