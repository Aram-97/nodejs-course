import { validateInput, shortenPublicHoliday } from "../ngmp-public-src/helpers";
import { PublicHoliday } from "../ngmp-public-src/types";

describe("shortenPublicHoliday()", () => {
  const PUBLIC_HOLIDAY_MOCK: PublicHoliday = {
    date: "2023-09-02",
    localName: "Quốc khánh",
    name: "National Day",
    countryCode: "VN",
    fixed: true,
    global: true,
    counties: null,
    launchYear: null,
    types: ["Public"],
  };

  test("should return public holiday in shorten form", () => {
    expect(shortenPublicHoliday(PUBLIC_HOLIDAY_MOCK)).toEqual({
      date: "2023-09-02",
      localName: "Quốc khánh",
      name: "National Day",
    });
  });
});

describe("validateInput()", () => {
  test("should return [true] for supported countries in current year", () => {
    expect(validateInput({ year: 2023, country: "GB" })).toBeTruthy();
  });

  test("should throw an Error for not supported countries", () => {
    expect(() => validateInput({ year: 2023, country: "VN" })).toThrow(
      new Error("Country provided is not supported, received: VN")
    );
  });

  test("should throw an Error for not current year", () => {
    expect(() => validateInput({ year: 2020, country: "GB" })).toThrow(
      new Error("Year provided not the current, received: 2020")
    );
  });
});
