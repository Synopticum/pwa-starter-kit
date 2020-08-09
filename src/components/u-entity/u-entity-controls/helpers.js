import {UObjectControlsConstants} from "../../u-object/u-object-controls/UObjectControls.actions";
import {UDotControlsConstants} from "../../u-dot/u-dot-controls/UDotControls.actions";
import {UPathControlsConstants} from "../../u-path/u-path-controls/UPathControls.actions";

export const getConstants = (type) => {
    switch (type) {
        case 'object':
            return UObjectControlsConstants;

        case 'dot':
            return UDotControlsConstants;

        case 'path':
            return UPathControlsConstants;
    }
};