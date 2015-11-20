/**
 * A plugin to label all ARIA landmark roles
 */

import $ from "jquery";

export default {
    title: "Landmarks",
    description: "Labels all ARIA landmarks",
    run: (annotate) => {
        $("[role]").each(function() {
            annotate.label($(this), $(this).attr("role"));
        });
    },
};
