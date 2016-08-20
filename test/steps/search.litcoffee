    searchEngine = null

    setEngine = (name) ->
      searchEngine = (
        Google:
          url: 'http://google.com'
          input: 'input[type=text]'
          submit: 'button[name=btnG]'
          output: '#ires'
      )[name]

Given open "$ENGINE" URL.

    (name) ->
      setEngine(name)

      @browser
        .url(searchEngine.url)
        .waitForElementVisible('body', 1000)

When I search for "$INPUT".

    (value) ->
      @browser
        .setValue(searchEngine.input, value)
        .click(searchEngine.submit)
        .pause(1000)

Then should I see "$OUTPUT".

    (result) ->
      @browser
        .assert.containsText(searchEngine.output, result)

Given loaded "$URL".

    (url) ->
      @browser
        .url(url)
        .waitForElementVisible('body', 1000)

Then "$SELECTOR" should contain "$OUTPUT".

    (selector, output) ->
      @browser
        .assert.containsText(selector, result)
