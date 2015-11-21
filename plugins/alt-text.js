/**
 * A plugin to check for valid alternative representations for images
 */

import $ from "jquery";
import audit from "./shared/audit";

export default {
    title: "Image alt-text",
    description: "Annotates images without alt text",
    run: (annotate) => {
        // Generate errors for any images that fail the Accessibility
        // Developer Tools audit
        const { result, elements } = audit("imagesWithoutAltText");

        if (result === "FAIL") {
            // TODO: Spawn an info panel
            elements.forEach((el) => {
                annotate.errorLabel($(el), "", "Image is missing alt-text");
            });
        }

        // Additionally, label presentational images
        $(`img[role="presentation"], img[alt=""]`).each((i, el) => {
            // "Error" labels have a warning icon and expanded text on hover,
            // but we add a special `warning` class to color it differently.
            annotate
                .errorLabel($(el), "", "This image is decorative")
                .addClass("tota11y-label-warning");
        });
    },
};
