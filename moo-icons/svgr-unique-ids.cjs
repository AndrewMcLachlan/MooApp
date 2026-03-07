/**
 * SVGR plugin that replaces static SVG element IDs with React useId()-based
 * dynamic IDs, preventing collisions when the same component is rendered
 * multiple times on a page.
 *
 * Transforms:
 *   id="myClip"              -> id={_uid + "myClip"}
 *   clipPath="url(#myClip)"  -> clipPath={`url(#${_uid}myClip)`}
 *   mask="url(#myMask)"      -> mask={`url(#${_uid}myMask)`}
 *
 * Also injects `const _uid = React.useId();` into the component body via
 * the companion svgr-template.cjs.
 */

/**
 * Build a template literal AST node from a string containing ${_uid} placeholders.
 * Handles any number of occurrences (0, 1, or many).
 */
function buildTemplateLiteral(t, str) {
  const parts = str.split("${_uid}");
  if (parts.length === 1) {
    // No placeholders — return as a plain string
    return t.stringLiteral(str);
  }
  const quasis = parts.map((raw, i) =>
    t.templateElement({ raw, cooked: raw }, i === parts.length - 1)
  );
  const expressions = parts.slice(1).map(() => t.identifier("_uid"));
  return t.templateLiteral(quasis, expressions);
}

module.exports = function uniqueIdPlugin(api) {
  const { types: t } = api;

  return {
    visitor: {
      // Replace id={...} string literals with id={_uid + "value"}
      JSXAttribute(path) {
        const name = path.node.name;
        if (!t.isJSXIdentifier(name)) return;
        const attrName = name.name;

        const value = path.node.value;
        if (!value) return;

        // Handle id="something" -> id={_uid + "something"}
        if (attrName === "id" && t.isStringLiteral(value)) {
          path.node.value = t.jsxExpressionContainer(
            t.binaryExpression(
              "+",
              t.identifier("_uid"),
              t.stringLiteral(value.value)
            )
          );
          return;
        }

        // Handle clipPath="url(#id)", mask="url(#id)", fill="url(#id)", etc.
        if (t.isStringLiteral(value) && /url\(#/.test(value.value)) {
          const newValue = value.value.replace(
            /url\(#([^)]+)\)/g,
            (_, id) => "url(#${_uid}" + id + ")"
          );
          path.node.value = t.jsxExpressionContainer(
            buildTemplateLiteral(t, newValue)
          );
          return;
        }

        // Handle JSX expression containers with string values containing url(#...)
        if (t.isJSXExpressionContainer(value) && t.isStringLiteral(value.expression) && /url\(#/.test(value.expression.value)) {
          const newValue = value.expression.value.replace(
            /url\(#([^)]+)\)/g,
            (_, id) => "url(#${_uid}" + id + ")"
          );
          path.node.value = t.jsxExpressionContainer(
            buildTemplateLiteral(t, newValue)
          );
        }
      },
    },
  };
};
