'use strict';

const readline = require('readline');

//
// To dump the last 32 merges to master by date (aka releases):
//   git checkout master
//   git log --format=medium --merges -n 32 --date=iso-strict | ag 'commit|Date' --no-color | node scripts/dumpReleases.js > releases.csv
//

const parseThing = (regex, line, lineIdx) => {
  const thing = line.match(regex);
  if (!thing) {
    console.error(new Error(`Could not parse line ${lineIdx}`));
  }
  return thing[1];
}

const parseCommit = (line, lineIdx) =>  parseThing(/^commit\s+([a-f0-9]+)$/, line, lineIdx);

const parseDate = (line, lineIdx) => {
  const dateStr = parseThing(/^Date:\s+(\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d(Z|[+-]\d\d:\d\d))$/, line, lineIdx);
  return dateStr ? new Date(dateStr).toISOString() : null;
}

function dumpReleases() {
  const rl = readline.createInterface({
    input: process.stdin
  });

  // CSV Header
  console.log(`timestamp,release`);

  // Read lines 2 at a time
  let lineIdx = 0;
  let commit;
  let date;
  rl.on('line', (line) => {
    // Parse commit, date from line N and N+1
    if (lineIdx % 2 == 0) {
      // Line N: commit
      commit = parseCommit(line, lineIdx);
      if (!commit) {
        rl.close();
        return;
      }
    } else {
      // Line N+1: date
      date = parseDate(line, lineIdx);
      if (!date) {
        rl.close();
        return;
      }
      // Write commit,date\n
      console.log(`${date},${commit}`);
    }
    lineIdx += 1;
  });
}

dumpReleases();
