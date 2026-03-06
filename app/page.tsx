"use client";

import { useEffect, useState } from "react";
import { WaveTiles, type WaveTileColor, type WaveTileTexture } from "@/ui/components/basic/wave-tiles";
import { NAV_ITEMS, PAGE_DEFINITIONS, type PageCubeDef, type PageName } from "@/app/components/pages";

type CubeDef = {
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
  color?: WaveTileColor;
  texture?: WaveTileTexture;
  content?: React.ReactNode;
  onClick?: () => void;
};

function toCubeDef(cube: PageCubeDef): CubeDef {
  return cube;
}

export default function Home() {
  const [cubeLayout, setCubeLayout] = useState<CubeDef[]>([]);
  const [currentPage, setCurrentPage] = useState<PageName>("Home");

  // Build the stable navbar plus the current page-controlled content area.
  // Page modules own everything except the navbar.
  useEffect(() => {
    const baseCells = 24;
    const minCubeSize = 16;
    const maxVisibleCubes = 900;

    function buildLayout() {
      const width = window.innerWidth;
      const height = window.innerHeight;

      let size = Math.max(minCubeSize, Math.floor(Math.min(width, height) / baseCells));
      while (Math.ceil(width / size) * Math.ceil(height / size) > maxVisibleCubes) {
        size += 1;
      }

      const cols = Math.max(1, Math.ceil(width / size));
      const centerCol = Math.floor((cols - 1) / 2);

      const itemSpan = 3;
      const navGap = 1;
      const totalNavWidth = NAV_ITEMS.length * itemSpan + (NAV_ITEMS.length - 1) * navGap;
      const navStart = Math.max(0, centerCol - Math.floor(totalNavWidth / 2));

      const navCubes: CubeDef[] = NAV_ITEMS.map((item, i) => ({
        row: 1,
        col: navStart + i * (itemSpan + navGap),
        rowSpan: 1,
        colSpan: itemSpan,
        color: item.color ?? "purple",
        texture: item.texture ?? "blockprint",
        content: (
          <div
            className={`select-none font-semibold text-base navbar-font ${
              item.label === "Problems" ? "text-black" : "text-white"
            }`}
          >
            {item.label}
          </div>
        ),
        onClick: () => setCurrentPage(item.label),
      }));

      const pageCubes = PAGE_DEFINITIONS[currentPage].layout.map(toCubeDef);
      setCubeLayout([...navCubes, ...pageCubes]);
    }

    buildLayout();
    window.addEventListener("resize", buildLayout);
    return () => window.removeEventListener("resize", buildLayout);
  }, [currentPage]);

  return <WaveTiles cubeLayout={cubeLayout} />;
}
