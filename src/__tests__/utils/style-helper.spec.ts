import { StyleHelper } from "../../utils";

describe("style-helper", () => {
	describe("sanitizeStyleString", () => {
		let warnSpy: jest.SpyInstance;

		beforeEach(() => {
			warnSpy = jest.spyOn(console, "warn").mockImplementation(() => undefined);
		});

		afterEach(() => {
			warnSpy.mockRestore();
		});

		it.each`
			scenario                            | input                                       | expected
			${"single declaration"}             | ${"padding-top: 50px;"}                     | ${"padding-top: 50px;"}
			${"multiple declarations"}          | ${"padding-top: 50px; margin-right: 10px;"} | ${"padding-top: 50px; margin-right: 10px;"}
			${"declaration without trailing ;"} | ${"padding: 1rem"}                          | ${"padding: 1rem;"}
			${"calc() values"}                  | ${"width: calc(100% - 40px)"}               | ${"width: calc(100% - 40px);"}
			${"!important"}                     | ${"padding-top: 50px !important"}           | ${"padding-top: 50px !important;"}
			${"uppercase property names"}       | ${"PADDING-TOP: 8px"}                       | ${"padding-top: 8px;"}
			${"multi-value shorthand"}          | ${"margin: 0 auto 8px 4px"}                 | ${"margin: 0 auto 8px 4px;"}
			${"border-radius"}                  | ${"border-radius: 0"}                       | ${"border-radius: 0;"}
			${"comments are ignored"}           | ${"padding-top: 8px; /* note */ margin: 0"} | ${"padding-top: 8px; margin: 0;"}
		`("should keep layout declarations: $scenario", ({ input, expected }) => {
			expect(StyleHelper.sanitizeStyleString(input)).toBe(expected);
			expect(warnSpy).not.toHaveBeenCalled();
		});

		it.each`
			scenario                                  | input
			${"literal url()"}                        | ${'background: url("https://evil.example.com/x.png")'}
			${"escaped url() (\\75 = u)"}             | ${'background: \\75rl("https://evil.example.com/x.png")'}
			${"escaped url() with trailing space"}    | ${'background-image: \\000075 rl("https://evil.example.com/x.png")'}
			${"image-set()"}                          | ${'background-image: image-set("https://evil.example.com/x.png" 1x)'}
			${"-webkit-image-set()"}                  | ${'background-image: -webkit-image-set("https://evil.example.com/x.png" 1x)'}
			${"cross-fade()"}                         | ${'background-image: cross-fade(url("https://evil.example.com/x.png"), none, 50%)'}
			${"element()"}                            | ${"background: element(#secret)"}
			${"expression()"}                         | ${"width: expression(alert(1))"}
			${"@import"}                              | ${'@import url("https://evil.example.com/x.css");'}
			${"escaped @import"}                      | ${'@\\69mport "https://evil.example.com/x.css";'}
			${"non-layout property"}                  | ${"color: red"}
			${"position overlay"}                     | ${"position: fixed; z-index: 9999"}
			${"opacity"}                              | ${"opacity: 0"}
			${"invisible overlay"}                    | ${"position: fixed; z-index: 9999; opacity: 0"}
			${"display"}                              | ${"display: none"}
			${"escaped property name"}                | ${"\\62 ackground: red"}
			${"url() hidden in an allowed property"}  | ${'padding: url("https://evil.example.com/x.png")'}
			${"escaped url() in an allowed property"} | ${'width: \\75rl("https://evil.example.com/x.png")'}
			${"backslash in an allowed property"}     | ${"padding: 1\\30 px"}
			${"quote in an allowed property"}         | ${'padding: "8px"'}
			${"declaration without a value"}          | ${"padding:"}
			${"declaration without a separator"}      | ${"padding 8px"}
			${"unclosed bracket"}                     | ${"padding: calc(1px"}
			${"unopened bracket"}                     | ${"padding: 1px)"}
		`("should drop unsafe or unsupported declarations: $scenario", ({ input }) => {
			expect(StyleHelper.sanitizeStyleString(input)).toBe("");
			expect(warnSpy).toHaveBeenCalledTimes(1);
		});

		it("should keep the safe declarations and drop the unsafe ones in a mixed string", () => {
			const result = StyleHelper.sanitizeStyleString(
				'padding-top: 50px; background: \\75rl("https://evil.example.com/x.png"); margin-right: 10px;'
			);

			expect(result).toBe("padding-top: 50px; margin-right: 10px;");
			expect(warnSpy).toHaveBeenCalledTimes(1);
			expect(warnSpy.mock.calls[0][0]).toContain("background");
		});

		it("should keep earlier declarations when a later one has an unclosed bracket", () => {
			expect(StyleHelper.sanitizeStyleString("margin: 0; padding: calc(1px")).toBe("margin: 0;");
		});

		it.each`
			scenario                       | input
			${"@media block"}              | ${"@media screen and (max-width: 480px) { padding-top: 47px; }"}
			${"rule breakout"}             | ${"padding: 0; } body { background: red } .x {"}
			${"nested selector block"}     | ${"& > div { padding: 0 }"}
			${"escaped braces"}            | ${"@media all \\7b background: url(//evil.example.com/x) \\7d"}
			${"escaped @"}                 | ${"\\40 media all{padding:0}"}
			${"@media after a newline"}    | ${"padding-top: 8px\n@media (max-width:1px){background:url(//evil.example.com/x)}"}
			${"other at-rules"}            | ${"@supports (display:grid) { padding: 0 }"}
			${"brace hidden in a comment"} | ${"padding-top: 8px /* } body { background: url(//evil.example.com/x) } */"}
		`("should drop rules and at-rules that style.cssText cannot apply: $scenario", ({ input }) => {
			expect(StyleHelper.sanitizeStyleString(input)).toBe("");
			expect(warnSpy).toHaveBeenCalledTimes(1);
		});

		it.each`
			scenario        | input
			${"undefined"}  | ${undefined}
			${"null"}       | ${null}
			${"number"}     | ${12}
			${"object"}     | ${{ paddingTop: "8px" }}
			${"empty"}      | ${""}
			${"whitespace"} | ${"   "}
		`("should return an empty string without warning for $scenario", ({ input }) => {
			expect(StyleHelper.sanitizeStyleString(input)).toBe("");
			expect(warnSpy).not.toHaveBeenCalled();
		});

		// note: jsdom discards escaped url() / image-set() on its own, unlike real browsers, so bypass coverage must assert
		// on sanitizeStyleString's output directly (above) rather than on what an element ends up with
		it("should produce output that the browser applies as-is", () => {
			const element = document.createElement("div");
			element.style.cssText = StyleHelper.sanitizeStyleString(
				"padding-top: 50px; margin-right: 10px; width: calc(100% - 40px);"
			);

			expect(element.style.paddingTop).toBe("50px");
			expect(element.style.marginRight).toBe("10px");
			expect(element.style.width).toBe("calc(100% - 40px)");
		});
	});
});
