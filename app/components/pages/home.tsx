import type { PageDefinition } from "./types";

const homePage: PageDefinition = {
  layout: [
    {
      row: 3,
      col: 6,
      rowSpan: 3,
      colSpan: 12,
      color: "ember",
      texture: "bandhani",
      content: (
        <div className="text-white select-none text-xl font-bold navbar-font">
          Welcome to Hackathon 2026
        </div>
      ),
    },
  ],
};

export default homePage;
