# Add Category navigation with Magento

The files you will need for this module can be found in the
[resources](/getting-started/6-category-navigation/resources) folder.

This will build on steps 1-5 of th is guide, so please open up the Magento extension you have created so far.

Add the following assets to your theme, from the above 'resources' folder:

- `view/frontend/web/js/category/klevu-category.js`
    - Copy the content from `category-navigation-scripts.js`
- `view/frontend/web/css/category/klevu-category.css`
    - Copy the content from `category-navigation-styles.css`
- `view/frontend/templates/category/category-templates.phtml`
    - Copy the content from `category-navigation-templates.tpl`

We will need a Magento Block to fetch the current category, which may look something like below.
Create `Block/Category.php` and add the following:

```php
<?php
namespace Klevu\JSv2\Block;

use Magento\Catalog\Model\CategoryFactory;
use Magento\Framework\Registry;
use Magento\Framework\View\Element\Template;
use Magento\Framework\View\Element\Template\Context;

class Category extends Template
{
    /** @var Registry */
    protected $registry;
    
    /** @var CategoryFactory */
    protected $categoryFactory;

    /**
     * @param Context $context
     * @param Registry $registry
     * @param CategoryFactory $categoryFactory
     * @param array $data
     */
    public function __construct(
        Context $context,
        Registry $registry,
        CategoryFactory $categoryFactory,
        array $data = []
    ) {
        $this->registry = $registry;
        $this->categoryFactory = $categoryFactory;
        
        parent::__construct($context, $data);
    }

    /**
     * @return string
     */
    public function getCurrentCategory()
    {
        $categoryNames = array();
        $currentCategory = $this->registry->registry('current_category');
        $pathIds = $currentCategory->getPathIds();
        
        if(!empty($pathIds)) {
            unset($pathIds[0]);
            unset($pathIds[1]);
            foreach ($pathIds as $key => $value){
                $categoryNames[] = $this->getCategoryName($value);
            }
        }
        
        return implode(";", $categoryNames);
    }

    /**
     * @param int $categoryId
     * @return string
     */
    public function getCategoryName($categoryId)
    {
        return $this->categoryFactory->create()
            ->load((int)$categoryId)
                ->getName();
    }
}
```

We will need a template to expose a JavaScript variable and a placeholder for the content to be injected.
Create `view/frontend/templates/category.phtml` and add something like this:

```html
<?php /** @var $block \Klevu\Search\Block\Category */ ?>

<script type="text/javascript">
    var klevu_pageCategory = "<?php echo $block->getCurrentCategory(); ?>";
    sessionStorage.setItem("klevu_pageCategory", klevu_pageCategory);
</script>
<script type="text/javascript" src="<?= $block->getViewFileUrl('Klevu_JSv2::js/category/klevu-category.js') ?>"></script>
<link rel="stylesheet" type="text/css" media="all" href="<?= $block->getViewFileUrl('Klevu_JSv2::css/category/klevu-category.css'); ?>" />

<div role="main" class="klevuCategoryPage"></div>
```

Finally we need to create a layout file to replace the native Magento category rendering with all of the above.
Create `view/frontend/layout/catalog_category_view.xml` and add something like this:

```xml
<?xml version="1.0"?>
<page xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" layout="1column" xsi:noNamespaceSchemaLocation="urn:magento:framework:View/Layout/etc/page_configuration.xsd">
    <body>
        <referenceContainer name="category.products" remove="true" />

        <referenceContainer name="head.additional">
            <block class="Magento\Framework\View\Element\Template" name="klevu_category_templates" template="Klevu_JSv2::category/category-templates.phtml" />
        </referenceContainer>

        <referenceContainer name="content">
            <block class="Klevu\Search\Block\Category" name="klevu_category" template="Klevu_JSv2::category.phtml" />
        </referenceContainer>
    </body>
</page>
```

> **IMPORTANT:**
> **`nouislider` for price sliders is not currently supported in this example.**

Please amend `category/klevu-category.js` as follows, making minMax 'false' to use a standard checkbox approach for prices:

```javascript
/** Price slider filter request query */
klevu.search.categoryLanding.getScope().priceSliderFilterReqQuery = {
    key: "klevu_price",
    minMax: false
};
```
