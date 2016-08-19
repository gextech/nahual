@tags=local

Feature: Lsing localhost

Scenario: Load a simple html document

  Given open "http://127.0.0.1/index.html" URL
  Then should I see "It works!"
