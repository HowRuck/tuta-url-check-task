import m from "mithril";
import "./UrlTester.css";
import { CenteredFrame } from "@shared/components";
import UrlInputForm from "./components/UrlInputForm";

/**
 * Main UrlTester component that contains the URL tester UI
 */
export const UrlTester: m.Component = {
  view: () => {
    return m(CenteredFrame, [
      m("h1.app-title", "Link Tester"),
      m(UrlInputForm),
    ]);
  },
};
