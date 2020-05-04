# Integrate JSv2 to existing JSv1 website

For **_EVERY PAGE_** of your Klevu JSv1 website, include the following initializations.

### Step 1: Add Klevu JSv2 library

```html
<!-- IMPORT BASE STYLES -->
<link rel="stylesheet" href="//js.klevu.com/klevu-js-v2/2.2/klevu.css" />
<!-- IMPORT KLEVU JSV2 LIBRARY -->
<script src="//js.klevu.com/klevu-js-v2/2.2/klevu.js"></script>
```

### Step 2: Add component for analytics utility

Before start adding or implementing any JSv2 module, it is **_important_** to add [analytics-utils](/components/analytics-utils) component to fire analytics events.
You will find the necessary resources for this component available here: [resources](/components/analytics-utils/resources).

###### Include assets:

```html
<script src="/path/to/folder/klevu-analytics-utils.js"></script>
```

### Step 3: Initialize Klevu library settings

```html
<script type="text/javascript">
  /**
   * Power-up Klevu library for your store.
   */
  klevu.interactive(function () {
    var options = {
      url: {
        // replace with your own search endpoint
        search:
          klevu.settings.url.protocol +
          "//eucs18v2.ksearchnet.com/cs/v2/search",
        protocolFull: klevu.settings.url.protocol + "//",
      },
      localSettings: true,
      search: {
        // replace with your own API Key
        apiKey: "klevu-XXXXXXXXXXXXXXXXX",
      },
      analytics: {
        // replace with your own API Key
        apiKey: "klevu-XXXXXXXXXXXXXXXXX",
      },
    };

    klevu(options);
  });

  /**
   * Also power up Analytics to handle clicks events
   */
  klevu.coreEvent.build({
    name: "analyticsBasePowerUp",
    fire: function () {
      if (
        !klevu.getSetting(klevu.settings, "settings.localSettings", false) ||
        !klevu.analytics.build
      ) {
        return false;
      }
      return true;
    },
    maxCount: 500,
    delay: 30,
  });

  klevu.coreEvent.attach("analyticsBasePowerUp", {
    name: "attachSendRequestEvent",
    fire: function () {
      klevu.analyticsUtil.base.sendAnalyticsEventsFromStorage(
        klevu.analyticsUtil.base.storage.dictionary,
        klevu.analyticsUtil.base.storage.term
      );

      klevu.analyticsUtil.base.sendAnalyticsEventsFromStorage(
        klevu.analyticsUtil.base.storage.dictionary,
        klevu.analyticsUtil.base.storage.click
      );

      klevu.analyticsUtil.base.sendAnalyticsEventsFromStorage(
        klevu.analyticsUtil.base.storage.dictionary,
        klevu.analyticsUtil.base.storage.categoryClick
      );
    },
  });
</script>
```

### Step 4: Add JSv2 library Components / Modules

Import Klevu JSv2 library Components or Modules to the website.

###### Include assets:

```html
<link rel="stylesheet" href="/path/to/folder/styles.css" />
<script src="/path/to/folder/scripts.js"></script>
```

###### Add templates:

```html
<body>
  <!--
	Include the Template file.
	You can either copy+paste the HTML content directly,
	or you can use your programming language to include them.
	eg. with PHP <?php include('/path/to/folder/templates.tpl'); ?>
	-->
  <!-- ADD TEMPLATES HERE, USING YOUR PREFERRED APPROACH -->
</body>
```
