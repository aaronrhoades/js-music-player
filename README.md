# js-music-player

Uses JavaScript Web Audio API and plain Vanilla JavaScript to create a basic music player. 

## Notes

- Uses FontAwesome, which may need your own free [https://fontawesome.com/](fontawesome) license for.
- Uses Google Fonts to pull in the Quicksand font.
- Neomorphism design.

## Development Dependencies

There are a few dependencies for development purposes, but this code can be used as HTML, CSS, and just plain Vanilla JS. A server is needed to retrieve the music files, otherwise you will run into a [https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS](CORS Policy) issue.

- Node *package.json* file added `npm start` script.
- Script relies on a [https://www.google.com/chrome/](chrome) installation and [https://www.npmjs.com/package/http-server](http-server). You may have to install http-server globally. http-server may depend on packages that contain vulnerabilities. This is only used for development purposes, and you may also wish to set up your own server outside of http-server and use a different browser.