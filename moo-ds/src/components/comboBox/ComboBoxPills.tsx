import { type MouseEvent, useLayoutEffect, useRef, useState } from "react";
import { useComboBox } from "./ComboBoxProvider";
import { ComboBoxSelectedItem as SelectedItem } from "./ComboBoxSelectedItem";

// Rough px reserved on the row for the trailing "+N more" chip and (when the
// dropdown is open) the text input. Slightly generous so content never wraps.
const CHIP_RESERVE = 56;
const INPUT_RESERVE = 100;

// Measured widths carry sub-pixel noise: a content-hugged control's available
// width can land a fraction of a pixel under the integer-rounded pill sum, and
// that rounding must not tip a fitting row into the "+N more" collapse.
const FIT_EPSILON = 1;

// Greedy fit of pill widths onto one row. Exported for unit tests (jsdom has
// no layout, so the measuring effect itself cannot be exercised there).
export const computePillFit = (widths: number[], avail: number, gap: number, inputReserve: number): number => {
    if (widths.length === 0) return 0;

    const totalAll = widths.reduce((sum, w, i) => sum + w + (i ? gap : 0), 0);
    if (totalAll + inputReserve <= avail + FIT_EPSILON) return widths.length;

    const reserve = CHIP_RESERVE + gap + inputReserve;
    let used = 0;
    let fitCount = 0;
    for (let i = 0; i < widths.length; i++) {
        const add = widths[i] + (fitCount ? gap : 0);
        if (used + add + reserve > avail + FIT_EPSILON) break;
        used += add;
        fitCount++;
    }

    // Never collapse to a bare "+N more" with no pills at all — the first pill
    // always shows, clipped by the body's overflow if it truly cannot fit.
    return Math.max(1, fitCount);
};

// Renders the multi-select pills on a single row: as many as fit, then a
// "+N more" chip for the rest. When the dropdown is open, room is also kept for
// the input so the control never grows past one line — managing the full set
// happens through the dropdown.
//
// The fit is measured from real layout (every pill is rendered for one pass,
// their widths read, then the overflow dropped). A single set of pills is used
// (no clone). Where layout is unavailable (jsdom/SSR) it shows every pill.
export const ComboBoxPills = () => {

    const { selectedItems, show, valueField } = useComboBox();

    const wrapRef = useRef<HTMLDivElement>(null);
    const [fit, setFit] = useState(selectedItems.length);
    const [measuring, setMeasuring] = useState(true);
    const [expanded, setExpanded] = useState(false);

    const count = selectedItems.length;

    // Expansion only applies while the dropdown is closed: once it opens, the
    // list is the place to review selections, so the pills stay on one line.
    const expandedActive = expanded && !show;

    // Collapse the expanded pills whenever the dropdown opens, so reopening the
    // closed control doesn't spring back to the multi-line view.
    useLayoutEffect(() => {
        if (show) setExpanded(false);
    }, [show]);

    // Re-measure when the pills or the open state (which reserves input room) change.
    useLayoutEffect(() => {
        setMeasuring(true);
    }, [count, show]);

    // Measure pass: with every pill rendered, greedily keep the ones that fit.
    useLayoutEffect(() => {
        if (!measuring) return;
        const wrap = wrapRef.current;
        const body = wrap?.parentElement;
        if (!wrap || !body) return;

        const pills = Array.from(wrap.querySelectorAll<HTMLElement>(".item"));
        const style = getComputedStyle(body);
        // Fractional widths throughout: clientWidth/offsetWidth round to
        // integers, which combined with sub-pixel layout put a content-hugged
        // control right on the fit boundary.
        const avail = body.getBoundingClientRect().width - parseFloat(style.paddingLeft || "0") - parseFloat(style.paddingRight || "0");

        // No layout available (e.g. jsdom): show every pill.
        if (pills.length === 0 || !avail) {
            setFit(pills.length);
            setMeasuring(false);
            return;
        }

        const gap = parseFloat(style.columnGap || style.gap) || 12;
        const widths = pills.map(el => el.getBoundingClientRect().width);
        const inputReserve = show ? INPUT_RESERVE + gap : 0;

        setFit(computePillFit(widths, avail, gap, inputReserve));
        setMeasuring(false);
    }, [measuring, count, show]);

    // Re-measure on width changes (absent in jsdom/SSR).
    useLayoutEffect(() => {
        const body = wrapRef.current?.parentElement;
        if (typeof ResizeObserver === "undefined" || !body) return undefined;
        const observer = new ResizeObserver(() => setMeasuring(true));
        observer.observe(body);
        return () => observer.disconnect();
    }, []);

    if (count === 0) return null;

    const pill = (item: unknown, index: number) => (
        <SelectedItem key={valueField(item)?.toString() ?? index} item={item} />
    );

    // The chip stops propagation so toggling the pill view doesn't also open the
    // dropdown (a click anywhere else in the control does).
    const toggleExpanded = (e: MouseEvent) => {
        e.stopPropagation();
        setExpanded(v => !v);
    };

    // Expanded: every pill, wrapped over as many rows as needed, plus "show less".
    if (expandedActive) {
        return (
            <div className="cb-pills expanded" ref={wrapRef}>
                {selectedItems.map(pill)}
                <button type="button" className="cb-more" onClick={toggleExpanded}>show less</button>
            </div>
        );
    }

    const visible = measuring ? selectedItems : selectedItems.slice(0, fit);
    const hidden = count - visible.length;

    return (
        <div className="cb-pills" ref={wrapRef}>
            {visible.map(pill)}
            {!measuring && hidden > 0 && <button type="button" className="cb-more" onClick={toggleExpanded}>+{hidden} more</button>}
        </div>
    );
};

ComboBoxPills.displayName = "ComboBoxPills";
