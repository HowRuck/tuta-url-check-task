import m from "mithril";
import "./CenteredFrame.css";

/**
 * Component that centers its content vertically and horizontally
 */
export const CenteredFrame: m.Component = {
  view: (vnode) => {
    return m("section.centered-frame", vnode.children);
  },
};
