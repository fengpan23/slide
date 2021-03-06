define(['./view/ComponentButton',
	'./view/ImportingComponentButton',
	'./model/Image',
	'./model/TextBox',
	'./model/Table',
	'./model/WebFrame',
	'./model/Video',
	'./view/ImageView',
	'./view/TextBoxView',
	'./view/TableView',
	'./view/WebFrameView',
	'./view/VideoView',
	'./ComponentFactory',
	'lang',
	'./view/ShapesDropdown',
	'./ShapeCollection',
	'./view/ShapeView',
	'./model/Shape'],
	function(Button,
			 ImportingComponentButton,
			 Image,
			 TextBox,
			 Table,
			 WebFrame,
			 Video,
			 ImageView,
			 TextBoxView,
			 TableView,
			 WebFrameView,
			 VideoView,
			 ComponentFactory,
			 lang,
			 ShapesDropdown,
			 ShapeCollection,
			 ShapeView,
			 Shape) {
		var availableShapes = new ShapeCollection();
		var service = {
			createButtons: function(editorModel) {
				var buttons = [];

				buttons.push(new Button({
					componentType: 'TextBox',
					icon: 'icon-text-width',
					name: lang.text,
					editorModel: editorModel
				}));
				
				buttons.push(new Button({
					componentType: 'Table',
					icon: 'icon-th',
					name: lang.table,
					componentClass: 'hidden-phone',
					editorModel: editorModel
				}));

				buttons.push(new ImportingComponentButton({
					componentType: 'Image',
					icon: 'icon-picture',
					name: lang.image,
					tag: 'img',
					title: lang.insert_image,
					componentClass: 'hidden-phone',
					editorModel: editorModel,
					hasStorage: editorModel.hasStorage,
					browsable: true
				}));

				buttons.push(new ImportingComponentButton({
					componentType: 'Video',
					icon: 'icon-film',
					name: lang.video,
					tag: 'video',
					title: lang.insert_video,
					componentClass: 'hidden-phone',
					editorModel: editorModel,
					ignoreErrors: true
				}));

				buttons.push(new ImportingComponentButton({
					componentType: 'WebFrame',
					icon: 'icon-globe',
					name: lang.website,
					tag: 'iframe',
					title: lang.insert_website,
					componentClass: 'hidden-phone',
					editorModel: editorModel,
					ignoreErrors: true
				}));

//				buttons.push(new ShapesDropdown(
//					availableShapes,
//					JST['strut.slide_components/ShapesDropdown'],
//					{class: 'group-dropdown hidden-phone',
//						editorModel: editorModel}
//				));

				return buttons;
			}
		};

		return {
			initialize: function(registry) {
				// Register each component as a service
				// so it can be picked up by the ComponentFactory
				// If 3rd parties want to add components
				// then they just add their components to the registry as well.
				registry.register({
					interfaces: 'strut.ComponentButtonProvider'
				}, service);

				registry.register({
					interfaces: 'strut.ComponentModel',
					meta: {
						type: 'Image'
					}
				}, Image);

				registry.register({
					interfaces: 'strut.ComponentModel',
					meta: {
						type: 'TextBox'
					}
				}, TextBox);
				
				registry.register({
					interfaces: 'strut.ComponentModel',
					meta: {
						type: 'Table'
					}
				}, Table);

				registry.register({
					interfaces: 'strut.ComponentModel',
					meta: {
						type: 'WebFrame'
					}
				}, WebFrame);

				registry.register({
					interfaces: 'strut.ComponentModel',
					meta: {
						type: 'Video'
					}
				}, Video);

				registry.register({
					interfaces: 'strut.ComponentModel',
					meta: {
						type: 'Shape'
					}
				}, Shape);

				registry.register({
					interfaces: 'strut.ComponentView',
					meta: {
						type: 'Image'
					}
				}, ImageView);

				registry.register({
					interfaces: 'strut.ComponentView',
					meta: {
						type: 'TextBox'
					}
				}, TextBoxView);
				
				registry.register({
					interfaces: 'strut.ComponentView',
					meta: {
						type: 'Table'
					}
				}, TableView);

				registry.register({
					interfaces: 'strut.ComponentView',
					meta: {
						type: 'WebFrame'
					}
				}, WebFrameView);

				registry.register({
					interfaces: 'strut.ComponentView',
					meta: {
						type: 'Video'
					}
				}, VideoView);

				registry.register({
					interfaces: 'strut.ComponentView',
					meta: {
						type: 'Shape'
					}
				}, ShapeView);

				ComponentFactory.initialize(registry);
			}
		};
	});