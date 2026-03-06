import aboutPage from "./about";
import contactPage from "./contact";
import faqsPage from "./faq-page";
import homePage from "./home";
import problemsPage from "./problems";
import sponsorsPage from "./sponsors";
import timelinePage from "./timeline";
import type { NavItem, PageDefinition, PageName } from "./types";

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", color: "red", texture: "blockprint" },
  { label: "About", color: "blue", texture: "jaali" },
  { label: "Problems", color: "white", texture: "bandhani" },
  { label: "Timeline", color: "green", texture: "ikat" },
  { label: "Sponsors", color: "yellow", texture: "blockprint" },
  { label: "FAQs", color: "brown", texture: "chikankari" },
  { label: "Contact", color: "black", texture: "jaali" },
];

export const PAGE_DEFINITIONS: Record<PageName, PageDefinition> = {
  Home: homePage,
  About: aboutPage,
  Problems: problemsPage,
  Timeline: timelinePage,
  Sponsors: sponsorsPage,
  FAQs: faqsPage,
  Contact: contactPage,
};

export type { NavItem, PageCubeDef, PageDefinition, PageName } from "./types";
