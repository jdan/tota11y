export const TOGGLE_PLUGIN = "TOGGLE_PLUGIN";

export function togglePlugin(i) {
    return {
        type: TOGGLE_PLUGIN,
        index: i,
    };
}
