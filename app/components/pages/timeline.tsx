import type { PageDefinition } from "./types";

const timelinePage: PageDefinition = {
  layout: [
    {
      row: 3,
      col: 6,
      rowSpan: 3,
      colSpan: 12,
      color: "orange",
      texture: "blockprint",
      content: (
        <div className="text-white select-none text-lg navbar-font">
          Event Timeline
        </div>
      ),
    },
  ],
};

export default timelinePage;
