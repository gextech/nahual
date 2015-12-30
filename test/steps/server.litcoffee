
Given loaded "$SRC".

    (src) ->
      @browser
        .url('http://localhost:8000' + src)
        .waitForElementVisible('body', 100)

Then "$EL" should contain "$TEXT".

    (el, text) ->
      @browser
        .expect.element(el).text.to.contain(text)
