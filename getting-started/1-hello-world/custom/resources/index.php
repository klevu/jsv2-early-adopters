<!DOCTYPE html>
<html>
<head>
    <title>Klevu JS Library Static Example</title>

    <!-- css -->
    <link href='/assets/css/quick/klevu-quick.css' rel='stylesheet'>
    <link href='/assets/css/landing/klevu-landing.css' rel='stylesheet'>
    <link href='/assets/css/landing/klevu-landing-responsive.css' rel='stylesheet'>

    <!-- quick templates -->
    <?php include(dirname(__FILE__) . '/templates/quick/quick-auto-suggestions.tpl') ?>
    <?php include(dirname(__FILE__) . '/templates/quick/quick-base.tpl') ?>
    <?php include(dirname(__FILE__) . '/templates/quick/quick-category-suggestions.tpl') ?>
    <?php include(dirname(__FILE__) . '/templates/quick/quick-no-results-found.tpl') ?>
    <?php include(dirname(__FILE__) . '/templates/quick/quick-page-suggestions.tpl') ?>
    <?php include(dirname(__FILE__) . '/templates/quick/quick-product-block.tpl') ?>
    <?php include(dirname(__FILE__) . '/templates/quick/quick-products.tpl') ?>

    <!-- landing templates -->
    <?php include(dirname(__FILE__) . '/templates/landing/landing-base.tpl') ?>
    <?php include(dirname(__FILE__) . '/templates/landing/landing-no-results-found.tpl') ?>
    <?php include(dirname(__FILE__) . '/templates/landing/landing-pagination.tpl') ?>
    <?php include(dirname(__FILE__) . '/templates/landing/landing-filters.tpl') ?>
    <?php include(dirname(__FILE__) . '/templates/landing/landing-results.tpl') ?>
    <?php include(dirname(__FILE__) . '/templates/landing/landing-product-block.tpl') ?>
</head>

<body>
    <!-- quick search input -->
    <form action="/index.php" method="get">
        <label for="search">Search</label>
        <input type="text" name="q" id="search" placeholder="eg. bag" />
    </form>

    <!-- search results placeholder -->
    <div class="klevuLanding"></div>

    <!-- js -->
    <script src="//js.klevu.com/klevu-js-v2/2.0/klevu.js"></script>
    <script src="/assets/js/klevu-settings.js"></script>
    <script src="/assets/js/quick/klevu-quick.js"></script>
    <script src="/assets/js/landing/klevu-landing.js"></script>
    <noscript>
        <div class="global-site-notice noscript">
            <div class="notice-inner">
                <p>
                    <strong>JavaScript seems to be disabled in your browser.</strong><br />
                    You must have JavaScript enabled in your browser to utilize the functionality of this website.
                </p>
            </div>
        </div>
    </noscript>
</body>
</html>
