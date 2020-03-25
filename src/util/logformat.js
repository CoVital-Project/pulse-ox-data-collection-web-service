import morgan from 'morgan';

morgan.format('po', function developmentFormatLine(tokens, req, res) {
  // get the status code if response written
  const status = headersSent(res) ? res.statusCode : undefined;

  // get status color
  const color =
    status >= 500
      ? 31
      : status >= 400
        ? 33
        : status >= 300
          ? 36
          : status >= 200
            ? 32
            : 0; // red // yellow // cyan // green // no color

  // get colored function
  let fn = developmentFormatLine[color];

  // eslint-disable-next-line no-unused-vars
  let url;
  try {
    url = decodeURI(tokens.url(req, res));
  } catch (err) {
    url = tokens.url(req, res);
  }

  url = url.substring(url.indexOf('?'));

  if (!fn) {
    // compile
    fn = developmentFormatLine[color] = morgan.compile(
      '\x1b[0m[:date[clf]] :remote-addr \x1b[91m:method\x1b[0m \x1b[96m' +
        ':url' +
        ' \x1b[0m\x1b[' +
        color +
        'm:status\x1b[0m :response-time ms - len: :res[content-length]\x1b[0m'
    );
  }

  return fn(tokens, req, res);
});

function headersSent(res) {
  return typeof res.headersSent !== 'boolean'
    ? Boolean(res._header)
    : res.headersSent;
}
