# Add Color swatch base component

This is base component for product color swatch functionality. As this is component it won't have any output on UI. It only initialize core functions.

You will find the necessary resources for this module available here:
[resources](/components/color-swatches/resources). Please add these with the
method appropriate to your chosen framework. 

[Base file](/components/color-swatches/resources/assets/js/color-swatches.js)
- Base file is for code functions

[Initialization](/components/color-swatches/resources/assets/js/color-swatches-initialize.js)
- In the initialization, this shows how to enable base component to the targeted scope. 


```html
/** Initalize base component to the scope*/
klevu.colorSwatches(TARGET_SCOPE);

/** Usage of base component functions */
TARGET_SCOPE.colorSwatches.base.FUNCTION_NAME();
```

Try accessing color swatches base component.

Modules based on extention of this component:
- [Landing page product color swatches](/modules/color-swatches-landing-page)
- [Product quick view color swatches](/modules/color-swatches-quick-view)