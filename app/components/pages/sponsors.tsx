import type { PageDefinition } from "./types";

const sponsorsPage: PageDefinition = {
  layout: [
    {
      row: 3,
      col: 2,
      rowSpan: 2,
      colSpan: 35,
      color: "yellow",
      texture: "chikankari",
      content: (
        <div className="text-black select-none w-full h-full flex items-center justify-center px-8">
          <div className="text-6xl font-bold navbar-font tracking-wide">
            Sponsors & Partners
          </div>
        </div>
      ),
    },
    {
      row: 6,
      col: 2,
      rowSpan: 4,
      colSpan: 16,
      color: "white",
      texture: "jaali",
      content: (
        <div className="text-black select-none w-full h-full flex flex-col justify-center px-6 py-5">
          <div className="navbar-font text-4xl mb-3 font-bold">Title Partner</div>
          <div className="font-sans text-3xl font-bold">CSI SFIT</div>
          <div className="font-sans text-lg mt-3 opacity-75 leading-relaxed">
            Co-organizer, academic catalyst, and flagship campus innovation partner.
          </div>
        </div>
      ),
    },
    {
      row: 6,
      col: 19,
      rowSpan: 4,
      colSpan: 18,
      color: "blue",
      texture: "bandhani",
      content: (
        <div className="text-white select-none w-full h-full flex flex-col justify-center px-6 py-5">
          <div className="navbar-font text-4xl mb-3 font-bold">Technology Partner</div>
          <div className="font-sans text-3xl font-bold">GDG SFIT</div>
          <div className="font-sans text-lg mt-3 opacity-90 leading-relaxed">
            Developer community partner powering outreach, mentorship, and ecosystem support.
          </div>
        </div>
      ),
    },
    {
      row: 11,
      col: 2,
      rowSpan: 4,
      colSpan: 11,
      color: "yellow",
      texture: "blockprint",
      content: (
        <div className="text-black select-none w-full h-full flex flex-col justify-center px-5 py-4">
          <div className="navbar-font text-3xl mb-2 font-bold">Platinum</div>
          <div className="font-sans text-xl font-bold">Reserved</div>
          <div className="font-sans text-base mt-2 opacity-80 leading-relaxed">Premium brand visibility and keynote alignment.</div>
        </div>
      ),
    },
    {
      row: 11,
      col: 14,
      rowSpan: 4,
      colSpan: 11,
      color: "ember",
      texture: "blockprint",
      content: (
        <div className="text-white select-none w-full h-full flex flex-col justify-center px-5 py-4">
          <div className="navbar-font text-3xl mb-2 font-bold">Gold</div>
          <div className="font-sans text-xl font-bold">Reserved</div>
          <div className="font-sans text-base mt-2 opacity-80 leading-relaxed">Workshop, mentor, and showcase opportunities.</div>
        </div>
      ),
    },
    {
      row: 11,
      col: 26,
      rowSpan: 4,
      colSpan: 11,
      color: "brown",
      texture: "chikankari",
      content: (
        <div className="text-white select-none w-full h-full flex flex-col justify-center px-5 py-4">
          <div className="navbar-font text-3xl mb-2 font-bold">Silver</div>
          <div className="font-sans text-xl font-bold">Open Sponsor Slot</div>
          <div className="font-sans text-base mt-2 opacity-80 leading-relaxed">Looking for ecosystem, tooling, and hiring partners.</div>
        </div>
      ),
    },
    {
      row: 16,
      col: 2,
      rowSpan: 4,
      colSpan: 11,
      color: "violet",
      texture: "ikat",
      content: (
        <div className="text-white select-none w-full h-full flex flex-col justify-center px-5 py-4">
          <div className="navbar-font text-3xl mb-2 font-bold">Bronze</div>
          <div className="font-sans text-xl font-bold">Open Sponsor Slot</div>
          <div className="font-sans text-base mt-2 opacity-80 leading-relaxed">Great for startups and community-backed teams.</div>
        </div>
      ),
    },
    {
      row: 16,
      col: 14,
      rowSpan: 4,
      colSpan: 23,
      color: "white",
      texture: "jaali",
      content: (
        <div className="text-black select-none w-full h-full flex flex-col justify-center px-6 py-5">
          <div className="navbar-font text-4xl mb-4 font-bold">Why Sponsor?</div>
          <div className="font-sans text-xl leading-relaxed">
            Engage with builders, showcase developer tools, connect with top student talent,
            and align your brand with one of the campus flagship innovation events.
          </div>
        </div>
      ),
    },
    {
      row: 21,
      col: 3,
      rowSpan: 1,
      colSpan: 18,
      color: "black",
      texture: "jaali",
      content: (
        <div className="text-white select-none w-full h-full flex items-center justify-center px-6 text-center">
          <div>
            <div className="navbar-font text-3xl mb-2 font-bold">Become a Sponsor</div>
            <div className="font-sans text-lg opacity-90">
              Reach out through the Contact page to partner with the hackathon.
            </div>
          </div>
        </div>
      ),
    },
  ],
};

export default sponsorsPage;
