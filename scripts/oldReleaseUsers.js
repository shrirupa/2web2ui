'use strict';

// Usage:
//   1. Pull the "Visitors Releases" report as CSV from Pendo
//   2. Pull Git release history: `git checkout master && git log --format=medium --merges -n 32 --date=iso-strict | ag 'commit|Date' --no-color | node scripts/dumpReleases.js > releases.csv`
//   4. Run report: `node oldReleaseUsers.js <visitors.csv> <releases.csv>`
//
// Note this will write report findings to stderr and a CSV of results to stdout

const fs = require('fs');
const papa = require('papaparse');
const moment = require('moment');

const defaultCsvConfig = { header: true, skipEmptyLines: true };
const validateCsvLoad = ({ data, errors }) => {
  if (errors.length) {
    console.error(errors);
    throw new Error(`CSV parse failed`);
  }
  return data;
};

const loadCsv = (path, config = {}) => validateCsvLoad(papa.parse(fs.readFileSync(path, { encoding: 'utf8' }), {...defaultCsvConfig, ...config }));

const formatVisitorRecord = ([visitorId,release,tenant,plan,serviceLevel,lastVisit]) => ({
  visitorId,
  release,
  tenant,
  plan,
  serviceLevel,
  lastVisit: moment(lastVisit).add(4, 'h').toDate() // Visitor lastVisit field is in EDT (!)
});

// Load visitor records
const visitorsFilePath = process.argv[2];
const visitors = loadCsv(visitorsFilePath, { header: false }).slice(1).map(formatVisitorRecord);

// Load release records and sort ascending
const releasesFilePath = process.argv[3]
const formatReleaseColumn = (value, key) => key === 'timestamp' ? moment(value).toDate() : value;
const releases = loadCsv(releasesFilePath, { transform: formatReleaseColumn }).sort((a, b) => a.timestamp - b.timestamp);

// Pull the latest release for each visitor, based on their last visit time.
const releaseDetailsForVisitor = (visitor, releases) => {
  const visibleReleases = releases.filter(release => release.timestamp <= visitor.lastVisit);
  const latestRelease = visibleReleases[visibleReleases.length-1];
  const releaseAge = visitor.lastVisit - latestRelease.timestamp;
  return {
    latestRelease,
    releaseAge,
    displayReleaseAge: releaseAge > 0 ? moment.duration(releaseAge).humanize() : 'current'
  };
};

const visitorsWithReleaseDetails = visitors.map(visitor => ({
  ...visitor,
  ...releaseDetailsForVisitor(visitor, releases)
}));

// Calculate the proportion of visitors running old releases
const visitorsOnOldReleases = visitorsWithReleaseDetails.filter(visitor => visitor.release !== visitor.latestRelease.release)
console.warn(`${visitorsOnOldReleases.length} of ${visitors.length} visitors are running old releases`);

// Estimate the distribution of old release age
const oldReleaseAges = visitorsOnOldReleases.map(visitor => visitor.releaseAge);
const mean = oldReleaseAges.reduce((a, b) => a + b, 0) / oldReleaseAges.length;
console.warn(`Mean age of releases for people on old releases: ${moment.duration(mean).humanize()}`);

// Dump visitor list with release age details
const textSafeVisitors = visitorsWithReleaseDetails.map(({ latestRelease, displayReleaseAge, lastVisit, ...rest}) => ({
  lastVisit: lastVisit.toISOString(),
  ...rest,
}));
console.log(papa.unparse(textSafeVisitors));
