import {
  getNextPublicHolidays,
  getListOfPublicHolidays,
  checkIfTodayIsPublicHoliday,
} from "../ngmp-public-src/services/public-holidays.service";

describe("Public holidays service", () => {
  describe("Get public holidays", () => {
    test("should return list of public holidays", async () => {
      const response = await getListOfPublicHolidays(2023, "GB");

      expect(response).toBeInstanceOf(Array);
      expect(response.length).toBeGreaterThan(0);
    });

    test("should return empty array when API fails", async () => {
      const response = await getListOfPublicHolidays(2023, "");
      expect(response).toEqual([]);
    });
  });

  describe("Check if today is public holiday", () => {
    test("should return boolean value", async () => {
      const response = await checkIfTodayIsPublicHoliday("GB");

      expect(response).toEqual(expect.any(Boolean));
    });

    test("should return [false] when API fails", async () => {
      const response = await checkIfTodayIsPublicHoliday("");
      expect(response).toBeFalsy();
    });
  });

  describe("Get upcoming public holidays", () => {
    test("should return list of upcoming public holidays", async () => {
      const response = await getNextPublicHolidays("GB");

      expect(response).toBeInstanceOf(Array);
      expect(response.length).toBeGreaterThan(0);
    });

    test("should return empty array when API fails", async () => {
      const response = await getNextPublicHolidays("");
      expect(response).toEqual([]);
    });
  });
});
