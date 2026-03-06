import type { PageDefinition } from "./types";

const aboutPage: PageDefinition = {
  layout: [
    {
      row: 3,
      col: 6,
      rowSpan: 3,
      colSpan: 12,
      color: "blue",
      texture: "jaali",
      content: (
        <div className="text-white select-none text-lg navbar-font">
          About Our Event
        </div>
      ),
    },
  ],
};

export default aboutPage;
