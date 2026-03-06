import type { PageDefinition } from "./types";

const problemsPage: PageDefinition = {
  layout: [
    {
      row: 3,
      col: 6,
      rowSpan: 3,
      colSpan: 12,
      color: "green",
      texture: "ikat",
      content: (
        <div className="text-white select-none text-lg navbar-font">
          Problem Statements
        </div>
      ),
    },
  ],
};

export default problemsPage;
