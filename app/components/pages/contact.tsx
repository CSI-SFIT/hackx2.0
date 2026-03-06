import type { PageDefinition } from "./types";

const contactPage: PageDefinition = {
  layout: [
    {
      row: 3,
      col: 6,
      rowSpan: 3,
      colSpan: 12,
      color: "violet",
      texture: "bandhani",
      content: (
        <div className="text-white select-none text-lg navbar-font">
          Contact Us
        </div>
      ),
    },
  ],
};

export default contactPage;
