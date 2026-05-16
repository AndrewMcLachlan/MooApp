import { describe, it, expect } from "vitest";
import { className } from "../className";

describe("className", () => {
    it("returns a className prop when given a non-empty string", () => {
        expect(className("foo")).toEqual({ className: "foo" });
    });

    it("returns an empty object when given an empty string", () => {
        expect(className("")).toEqual({});
    });

    it("returns an empty object when given undefined", () => {
        expect(className(undefined)).toEqual({});
    });

    it("returns an empty object when given null", () => {
        expect(className(null)).toEqual({});
    });

    it("returns an empty object when given false", () => {
        expect(className(false)).toEqual({});
    });

    it("is spread-safe so consumers never emit class=\"\"", () => {
        const props = { id: "x", ...className(undefined) };
        expect(props).not.toHaveProperty("className");
    });
});
