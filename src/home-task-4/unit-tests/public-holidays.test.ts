import axios from "axios";
import {
  getNextPublicHolidays,
  getListOfPublicHolidays,
  checkIfTodayIsPublicHoliday,
} from "../ngmp-public-src/services/public-holidays.service";
import { PublicHolidayShort } from "../ngmp-public-src/types";
import { PUBLIC_HOLIDAYS_API_URL } from "../ngmp-public-src/config";

const SHORTEN_PUBLIC_HOLIDAY_LIST_MOCK: PublicHolidayShort[] = [
  {
    date: "2023-01-01",
    localName: "New Year's Day",
    name: "New Year's Day",
  },
  {
    date: "2023-03-17",
    localName: "Saint Patrick's Day",
    name: "Saint Patrick's Day",
  },
  {
    date: "2023-12-25",
    localName: "Christmas Day",
    name: "Christmas Day",
  },
];

describe("Public holidays service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getListOfPublicHolidays()", () => {
    test("should return list of public holidays in shorten form", async () => {
      jest.spyOn(axios, "get").mockImplementation(() =>
        Promise.resolve({
          data: SHORTEN_PUBLIC_HOLIDAY_LIST_MOCK,
        })
      );

      const response = await getListOfPublicHolidays(2023, "GB");
      expect(response).toEqual(SHORTEN_PUBLIC_HOLIDAY_LIST_MOCK);
    });

    test("should call API with proper arguments", async () => {
      const axiosSpy = jest.spyOn(axios, "get").mockImplementation(() =>
        Promise.resolve({
          data: SHORTEN_PUBLIC_HOLIDAY_LIST_MOCK,
        })
      );

      await getListOfPublicHolidays(2023, "GB");
      expect(axiosSpy).toHaveBeenCalledWith(`${PUBLIC_HOLIDAYS_API_URL}/PublicHolidays/2023/GB`);
    });

    test("should return empty array when the API fails", async () => {
      jest.spyOn(axios, "get").mockImplementation(() => Promise.reject());

      const response = await getListOfPublicHolidays(2023, "GB");
      expect(response).toEqual([]);
    });
  });

  describe("getNextPublicHolidays()", () => {
    test("should return list of upcoming public holidays in shorten form", async () => {
      jest.spyOn(axios, "get").mockImplementation(() =>
        Promise.resolve({
          data: SHORTEN_PUBLIC_HOLIDAY_LIST_MOCK,
        })
      );

      const response = await getNextPublicHolidays("GB");
      expect(response).toEqual(SHORTEN_PUBLIC_HOLIDAY_LIST_MOCK);
    });

    test("should call API with proper arguments", async () => {
      const axiosSpy = jest.spyOn(axios, "get").mockImplementation(() =>
        Promise.resolve({
          data: SHORTEN_PUBLIC_HOLIDAY_LIST_MOCK,
        })
      );

      await getNextPublicHolidays("GB");
      expect(axiosSpy).toHaveBeenCalledWith(`${PUBLIC_HOLIDAYS_API_URL}/NextPublicHolidays/GB`);
    });

    test("should return empty array when the API fails", async () => {
      jest.spyOn(axios, "get").mockImplementation(() => Promise.reject());

      const response = await getNextPublicHolidays("GB");
      expect(response).toEqual([]);
    });
  });

  describe("checkIfTodayIsPublicHoliday()", () => {
    test("should return boolean value to check if today is public holiday", async () => {
      jest.spyOn(axios, "get").mockImplementation(() => Promise.resolve({ status: 200 }));

      const response1 = await checkIfTodayIsPublicHoliday("GB");
      expect(response1).toEqual(expect.any(Boolean));
    });

    test("should call API with proper arguments", async () => {
      const axiosSpy = jest
        .spyOn(axios, "get")
        .mockImplementation(() => Promise.resolve({ status: 200 }));

      await checkIfTodayIsPublicHoliday("GB");
      expect(axiosSpy).toHaveBeenCalledWith(`${PUBLIC_HOLIDAYS_API_URL}/IsTodayPublicHoliday/GB`);
    });

    test("should return [false] when the API fails", async () => {
      jest.spyOn(axios, "get").mockImplementation(() => Promise.reject());

      const response = await checkIfTodayIsPublicHoliday("GB");
      expect(response).toBeFalsy;
    });
  });
});
