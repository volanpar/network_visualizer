import { CLR_NODE, CLR_INPUT_NODE, CLR_OUTPUT_NODE, CLR_REWARD_NODE, CLR_NODE_ACTIVATED } from './Constants';

export function get_node_color(node) {
    var color = CLR_NODE;
    if (node.__type === "input") { color = CLR_INPUT_NODE; }
    else if (node.__type === "output") { color = CLR_OUTPUT_NODE; }
    else if (node.__type === "external") { color = CLR_REWARD_NODE; }

    // activated?
    if (node.__activated) { color = CLR_NODE_ACTIVATED; }
    return color
}