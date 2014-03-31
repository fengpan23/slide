define(["./component_drawer/SlideDrawer",
        "./component_drawer/slide2Image",
        "./component_drawer/TextBoxDrawer",
        "./component_drawer/ImageDrawer"
], function(SlideDrawer, slide2Image, TextBoxDrawer, ImageDrawer) {
    "use strict";
    
    return {
        initialize: function(registry) {
            registry.register({
                interfaces: 'strut.ComponentDrawer',
                meta: {
                    type: 'Image'
                }
            }, ImageDrawer);

            registry.register({
                interfaces: 'strut.ComponentDrawer',
                meta: {
                    type: 'TextBox'
                }
            }, TextBoxDrawer);
            
            registry.register({
                interfaces: 'strut.SlideDrawer',
            }, SlideDrawer);
        }
    };
});
