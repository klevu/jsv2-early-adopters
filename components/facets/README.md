# Facets - Base component

>**Note:**  
>This is a base component for product add to cart functionality.
>It won't have any output on user interface. It only initializes core functions.  

You will find the necessary resources for this component available here:
[resources](/components/facets/resources). Please add these with the
method appropriate to your chosen framework.  

[Base file](/components/facets/resources/assets/js/klevu-facets.js) contains the core logic of the functionality.  
[Base styles](/components/facets/resources/assets/css/klevu-facets.css) contains the core styles of the functionality.

```javascript
/** Initalize base component to the scope*/
klevu.facets(TARGET_SCOPE);

/** Usage of base component functions */
TARGET_SCOPE.facets.base.FUNCTION_NAME();
```

Try accessing the Facets base component.

**Reference modules based on this component:**
- [Landing page filter items on the left side](/modules/filter-left/landing)