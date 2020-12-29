'use strict';

/**
 * replaceBuffer is a single function that accepts a string (and an optional object of options) as a parameter and returns an interpolated string with varaibles replaced by matching environment variables (located in `env`).
 *
 * It will throw if a matching variable is not found in `env` and will return the string that was passed if nothing was found to interpolate.
 * @param  {Buffer} buffer
 * @param  {object} env
 * @return {Buffer}
 */
function replaceBuffer(buffer, env) {
  const startToken = '${'; // declare start token
  const endToken = '}'; // declare end token


  let start = buffer.indexOf(startToken); // beginning of var
  let end = buffer.indexOf(endToken, start); // end of var
  let result = start > 0 ? buffer.slice(0, start) : buffer;

  // loop over string
  while (start !== -1 && end !== -1) {
    // grab match
    // match = buffer.substring(start + startToken.length, end);
    const match = buffer.subarray(start + startToken.length, end).toString();

    // reset start at start of next startToken
    start = buffer.indexOf(startToken, end);

    if (env[match] !== undefined) {
      // if there's a new var
      const tail = start > 0
        ? buffer.slice(end + endToken.length, start)
        : buffer.slice(end + endToken.length);

      // concat results
      result = Buffer.concat([result, Buffer.from(env[match]), tail]);
    } else {
      // match isn't an environment var
      console.warn(match, 'is not an environment variable');
    }

    // set end of next var
    end = buffer.indexOf(endToken, start);
  }

  return result;
}

module.exports = replaceBuffer;