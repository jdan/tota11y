export const TOGGLE_EXPANDED = "TOGGLE_EXPANDED";
export const TOGGLE_PLUGIN = "TOGGLE_PLUGIN";

export function toggleExpanded() {
    return {
        type: TOGGLE_EXPANDED,
    };
}

export function togglePlugin(i) {
    return {
        type: TOGGLE_PLUGIN,
        index: i,
    };
}
