import { useLayoutEffect, useRef, useState } from "react";
import { useComboBox } from "./ComboBoxProvider";
import { ComboBoxSelectedItem as SelectedItem } from "./ComboBoxSelectedItem";

// Renders the multi-select pills. While the dropdown is closed the pills
// collapse to however many fit on a single row plus a "+N more" chip; when it's
// open (actively choosing) every pill is shown.
//
// To know how many fit, every pill is rendered during a short "measure" pass and
// their row (offsetTop) is read; the overflow is then dropped and replaced by the
// chip. A single set of pills is used (no off-screen clone), so the DOM isn't
// duplicated. Measuring needs real layout, so where it's unavailable (jsdom/SSR)
// it falls back to showing every pill.
export const ComboBoxPills = () => {

    const { selectedItems, show, valueField } = useComboBox();

    const wrapRef = useRef<HTMLDivElement>(null);
    const [fit, setFit] = useState(selectedItems.length);
    const [measuring, setMeasuring] = useState(true);

    const collapsed = !show && selectedItems.length > 0;
    const count = selectedItems.length;

    // Re-measure whenever the collapse state or the number of pills changes.
    useLayoutEffect(() => {
        if (collapsed) setMeasuring(true);
    }, [collapsed, count]);

    // Measure pass: with every pill rendered, count the ones on the first row.
    useLayoutEffect(() => {
        if (!collapsed || !measuring) return;
        const wrap = wrapRef.current;
        if (!wrap) return;

        const pills = Array.from(wrap.querySelectorAll<HTMLElement>(".item"));
        if (pills.length > 0) {
            const firstTop = pills[0].offsetTop;
            const firstRow = pills.filter(p => p.offsetTop <= firstTop + 1).length;
            // Reserve a slot for the "+N more" chip when there's overflow.
            setFit(firstRow >= pills.length ? pills.length : Math.max(1, firstRow - 1));
        }
        setMeasuring(false);
    }, [collapsed, measuring, count]);

    // Re-measure on width changes (absent in jsdom/SSR).
    useLayoutEffect(() => {
        if (!collapsed) return undefined;
        const body = wrapRef.current?.parentElement;
        if (typeof ResizeObserver === "undefined" || !body) return undefined;
        const observer = new ResizeObserver(() => setMeasuring(true));
        observer.observe(body);
        return () => observer.disconnect();
    }, [collapsed]);

    const pill = (item: unknown, index: number) => (
        <SelectedItem key={valueField(item)?.toString() ?? index} item={item} />
    );

    if (!collapsed) {
        return <>{selectedItems.map(pill)}</>;
    }

    const visible = measuring ? selectedItems : selectedItems.slice(0, fit);
    const hidden = count - visible.length;

    return (
        <div className="cb-pills" ref={wrapRef}>
            {visible.map(pill)}
            {!measuring && hidden > 0 && <span className="cb-more">+{hidden} more</span>}
        </div>
    );
};

ComboBoxPills.displayName = "ComboBoxPills";
