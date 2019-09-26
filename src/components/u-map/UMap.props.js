export default {
    /**
     * A leaflet.js related property
     * Sets minimal zoom level
     * https://leafletjs.com/examples/zoom-levels/
     */
    minZoom: {
        type: Number,
        attribute: 'min-zoom'
    },

    /**
     * A leaflet.js related property
     * Sets maximal zoom level
     * https://leafletjs.com/examples/zoom-levels/
     */
    maxZoom: {
        type: Number,
        attribute: 'max-zoom'
    },

    /**
     * A leaflet.js related property
     * Restricts dragging a map outside of bounds
     * https://leafletjs.com/reference-1.4.0.html#map-maxbounds
     */
    maxBounds: {
        converter: {
            toAttribute(value) {
                return JSON.stringify(value);
            },
            fromAttribute(value) {
                return JSON.parse(value);
            }
        },
        attribute: 'max-bounds'
    },

    /**
     * A leaflet.js related property
     * Sets map width
     */
    width: {
        type: Number,
        attribute: 'width'
    },

    /**
     * A leaflet.js related property
     * Sets map height
     */
    height: {
        type: Number,
        attribute: 'height'
    },

    /**
     * A leaflet.js related property
     * Color of objects and circles (on hover)
     * https://leafletjs.com/reference-1.4.0.html#path-fillcolor
     */
    objectFillColor: {
        type: String,
        attribute: 'object-fill-color'
    },

    /**
     * A leaflet.js related property
     * Stroke width of objects and circles (on hover)
     * https://leafletjs.com/reference-1.4.0.html#path-stroke
     */
    objectStrokeWidth: {
        type: Number,
        attribute: 'object-stroke-width'
    },

    /**
     * A leaflet.js related property
     * A reference to an leaflet map instance
     */
    _map: {
        type: Object,
        attribute: false
    },

    /**
     * User menu
     */
    _isUserMenuVisible: {
        type: Boolean,
        attribute: false
    },

    /**
     * Delay to show a tooltip
     */
    _tooltipHoverTimeOut: {
        type: Number,
        attribute: false
    },

    /**
     * A redux store property
     * Represents whether dot page is visible
     */
    _dotPage: {
        type: Object,
        attribute: false
    },

    /**
     * A redux store property
     * Represents whether dot creator form is visible
     */
    _dotCreator: {
        type: Object,
        attribute: false
    },

    /**
     * A redux store property
     * Represents a user model
     */
    _user: {
        type: Object,
        attribute: false
    },

    /**
     * A redux store property
     * Represents app settings
     */
    _settings: {
        type: Object,
        attribute: false
    },

    /**
     * An HTMLElement node reference
     * Refers to a temporary(ghost) dot that is visible while a real dot creating
     */
    _$tempDot: {
        type: Object,
        attribute: false
    },

    /**
     * A redux store property
     * Represents tooltip state
     */
    _tooltip: {
        type: Object,
        attribute: false
    },

    /**
     * A redux store property
     * Represents context menu state
     */
    _contextMenu: {
        type: Object,
        attribute: false
    },

    /**
     * A redux store property
     * Represents context menu state
     */
    _clouds: {
        type: Object,
        attribute: false
    },

    /**
     * An HTMLElement node reference
     * Refers to clouds background
     */
    _$clouds: {
        type: Object,
        attribute: false
    }
};