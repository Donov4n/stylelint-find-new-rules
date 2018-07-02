'use strict';

const columnify = require('columnify');

const EOL = require('os').EOL;

const print = (heading, data) => {
    const columns = columnify(data, {});
    const spacer  = EOL + EOL;

    process.stdout.write(heading);
    process.stdout.write(spacer);

    if (columns) {
        process.stdout.write(columns);
        process.stdout.write(spacer);
    }
};

module.exports = print;
