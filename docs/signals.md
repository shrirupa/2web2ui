# Signals

Last Edited: Apr 18, 2019 1:51 PM

### Releases

**V1**

Represents what is currently available to the public. This includes the Overview page with all dimensions, and all details pages aside from the three behavior by cohort charts.

**V2**

Includes a break up the Overview page in favor of three new dashboards for each dimension, a new navigation item, and three behavior by cohort charts. V2 is accessible via a UI option - `feature_signals_v2`.

**V3 and beyond?**

Not well defined (no epic), but there are many improvements being made to the data modeling, API, and UI. This could include updated details page designs, WoW sorting, updated filtering behavior, additional facets, and a recommendations API.

### Local Development

The [signals api](https://github.com/SparkPost/sparkpost-admin-api-documentation/blob/master/services/signals.md) is not deployed to UAT, and while it is set up in staging, data is sparse. Working with signals data locally is easiest when [pointing your local upstreams to prd](https://confluence.int.messagesystems.com/display/ENG/Configuring+Openresty+Upstreams) and logging into cid 108, a sales engineering account.

### File Structure

Signals follows the same architecture as most of the app's other features (pages at the top, components below). Here's a rough outline of where things are:

```bash
/signals                      # Top level pages for V1 & all details pages
├── /dashboards               # Top level pages for V2 dashboards & relevant components
├── /constants                # Config for cohort mappings, recommendations, health colors & weight info
├── /containers
|   ├── withDateSelection.js    # Handles date selection state for details pages
|   ├── withDetails.js          # Handles data fetching for all details pages & previews (other charts)
|   ├── withSignalOptions.js    # Redux connection for signalOptions (filters)
|   └── ...OverviewContainer.js # Redux connections for each summary table
└── components
    ├── /actionContent        # Generates recommended actions for details pages
    ├── /charts               # Custom Recharts wrappers & supporting components
    ├── /dataCells            # Components for summary tables
    ├── /engagement           # Tabs for engagement cohort pages
    ├── /filters              # Filter components
    ├── /previews             # The "Other Charts" previews on details pages
    ├── /viewControl          # Button group toggles eg. count/ratio
    ├── ...Overview.js        # Summary tables
    └── ...everything else    # Uncategorized components
```

### The Data

The majority of the Signals endpoints function the same way: they request a list of entries by **facet** (sending domain, ip pool, campaign), with data for a **dimension** (health score, spam traps, engagement cohorts). Data is faceted by subaccount by default.

**Dates**

Historical data is stored for 90 days, and data is aggregated at the end of each day, resulting in a precision of one day.

This also means we do not display data for today. The engagement behavioral charts (FBLs, unsubscribes, engagement rate) also do not contain data within the last 3 days from today. (Idk why ask Avi)

**Aggregate Account Data & Differences Between Dimensions**

The signals API accepts a subaccount header, like any other endpoint. However, this header does not represent *ownership* of a facet value, it describes *data for a subaccount* (like webhooks). Passing in an invalid subaccount header where its value is not a real subaccount id (-1) results in a 401 from the auth API. Because of this, we do not have details pages for overall account data (subaccount id -1), and a one-off injections endpoint to retrieve overall account injections.

Without a facet, health score is the only dimension that provides data for master & all subaccounts. With a facet, health score is the only dimension that does not provide data for master & all subaccounts.

This leads to some inconsistent UX. Example:

```js
// /signals/health-score/sending-domain
// returns data for each subaccount
[
  { facet: 'sparkpost.com', current_health_score: 10, sid: 101 },
  { facet: 'sparkpost.com', current_health_score: 10, sid: 105 },
]

// /signals/spam-hits/sending-domain
// returns data for a facet from master and all subaccounts
[
  { facet: 'sparkpost.com', trap_hits: 10 },
]
```

Retrieving data for a dimension other than health score with a facet for a subaccount requires the user to filter by the specific subaccount id. Example:

```js
// /signals/spam-hits/sending-domain
// x-msys-subaccount: 101
[
  { facet: 'sparkpost.com', trap_hits: 5, sid: 101 },
]
```

### Fixing the Data with Selectors

The signals selectors attempt to standardize inconsistent data. Each selector is unique and can handle any or all of the following:

- Renaming keys
- Filling in missing keys
- Filling in missing dates
- Sorting time series data by date
- Calculating missing metrics
- Merging data from multiple requests
- Evaluating empty and loading states

Most logic here could be removed in the future when improvements to the API are made.

### Health Score Components

Health score contains additional data that represents how the score was evaluated. Data science calls these **components**, and the API calls these **weights**. Each component includes its type or name, its value, and a value describing how it is affecting health score relative to other components. Example:

```js
{
  weight_type: "Block Bounces",
  weight: "-0.1055784300",      // Non-normalized relative weight
  weight_value: "0.0243629999"  // Block bounces percentage
}
```
### Recommendations

Recommendations are generated based on the values of a single date of a time series. This defaults to the most recent date, and can be changed by selecting a single date on any chart. The logic that determines which recommendations to display is crude, and will be refined in the future.

### Communication

Signals requires coordination between several teams, and it is recommended to join the following slack channels: `#signals-dev`, `#signals-int-feedback`, `#sparkpost_signals`. Any large changes to UI behavior or interactions should be announced in one of these channels, mostly to keep TAMs and sales up to date.

For any questions:

- Design: Aubrey
- Front End: Jon
- Everything else: Avi
