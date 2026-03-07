/**
 * Custom SVGR template that injects React.useId() for unique SVG element IDs.
 * This prevents ID collisions when the same SVG component is rendered multiple times.
 */
module.exports = function template(variables, { tpl }) {
  return tpl`
    ${variables.imports};

    ${variables.interfaces};
    const ${variables.componentName} = (${variables.props}) => {
      const _uid = React.useId();
      return ${variables.jsx};
    };
    ${variables.exports};
  `;
};
