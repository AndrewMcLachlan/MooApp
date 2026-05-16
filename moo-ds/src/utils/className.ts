/**
 * Returns a spread-able prop object containing `className` only when `value`
 * is truthy. Use to avoid emitting empty `class=""` attributes:
 *
 * ```tsx
 * <div {...className(maybeClass)} />
 * ```
 */
export function className(value: string | undefined | null | false): { className?: string } {
    return value ? { className: value } : {};
}
