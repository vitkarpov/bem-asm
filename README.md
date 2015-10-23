# Simple Assembler for BEM projects with zero-config

Let you have the next file structure of your project:

```
blocks
  link
    link.bemhtml.js
    link.css
  button
    button.bemhtml.js
    button.css
  ...

blocks.page1
  link
    link.bemhtml.js
    link.css

blocks.page2
  link
    link.bemhtml.js
    link.css

pages
  page1
    page1.bemjson.js
  page2
    page2.bemjson.js
```

you can use **assembler with zero-config** to build the project

```
var bemass = require('bem-ass');

bemass(['page1', 'page2']).then(function() {
  console.log('all done!');
});
```

Check out [the tests](https://github.com/vitkarpov/bem-ass/tree/master/tests) to catch an idea
