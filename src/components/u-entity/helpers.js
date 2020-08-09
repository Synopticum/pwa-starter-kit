import {ObjectConstants} from "../u-object/UObject.actions";
import {DotConstants} from "../u-dot/UDot.actions";
import {PathConstants} from "../u-path/UPath.actions";

export const getConstants = (type) => {
    switch (type) {
        case 'object':
            return ObjectConstants;

        case 'dot':
            return DotConstants;

        case 'path':
            return PathConstants;
    }
};