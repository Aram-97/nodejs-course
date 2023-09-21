import request from "supertest";
import { PUBLIC_HOLIDAYS_API_URL } from "../ngmp-public-src/config";

const req = request(PUBLIC_HOLIDAYS_API_URL);

describe("Nager.Date API", () => {
  describe("GET /CountryInfo/{countryCode}", () => {
    test("should return info for a given country", async () => {
      const { status, body } = await req.get("/CountryInfo/US");

      expect(status).toEqual(200);
      expect(body).toEqual({
        commonName: expect.toBeOneOf([null, expect.any(String)]),
        officialName: expect.toBeOneOf([null, expect.any(String)]),
        countryCode: expect.toBeOneOf([null, expect.any(String)]),
        region: expect.toBeOneOf([null, expect.any(String)]),
        borders: expect.toBeOneOf([
          null,
          expect.arrayContaining([
            {
              commonName: expect.toBeOneOf([null, expect.any(String)]),
              officialName: expect.toBeOneOf([null, expect.any(String)]),
              countryCode: expect.toBeOneOf([null, expect.any(String)]),
              region: expect.toBeOneOf([null, expect.any(String)]),
              borders: null,
            },
          ]),
        ]),
      });
    });
  });

  describe("GET /AvailableCountries", () => {
    test("should return list of all available countries", async () => {
      const { status, body } = await req.get("/AvailableCountries");

      expect(status).toEqual(200);
      expect(body).toEqual(
        expect.arrayContaining([
          {
            countryCode: expect.toBeOneOf([null, expect.any(String)]),
            name: expect.toBeOneOf([null, expect.any(String)]),
          },
        ])
      );
    });
  });

  describe("GET /LongWeekend/{year}/{countryCode}", () => {
    test("should return list of long weekends for a given country in the given year", async () => {
      const { status, body } = await req.get("/LongWeekend/2023/US");

      expect(status).toEqual(200);
      expect(body).toEqual(
        expect.arrayContaining([
          {
            startDate: expect.any(String),
            endDate: expect.any(String),
            dayCount: expect.any(Number),
            needBridgeDay: expect.any(Boolean),
          },
        ])
      );
    });
  });

  describe("GET /PublicHolidays/{year}/{countryCode}", () => {
    test("should return list of public holidays for a given country in the given year", async () => {
      const { status, body } = await req.get("/PublicHolidays/2023/US");

      expect(status).toEqual(200);
      expect(body).toEqual(
        expect.arrayContaining([
          {
            date: expect.any(String),
            localName: expect.toBeOneOf([null, expect.any(String)]),
            name: expect.toBeOneOf([null, expect.any(String)]),
            countryCode: expect.toBeOneOf([null, expect.any(String)]),
            fixed: expect.any(Boolean),
            global: expect.any(Boolean),
            launchYear: expect.toBeOneOf([null, expect.any(Number)]),
            counties: expect.toBeOneOf([null, expect.arrayContaining([expect.any(String)])]),
            types: expect.toBeOneOf([null, expect.arrayContaining([expect.any(String)])]),
          },
        ])
      );
    });
  });

  describe("GET /IsTodayPublicHoliday/{countryCode}", () => {
    test("should return whether today is a public holiday", async () => {
      const { status } = await req.get("/IsTodayPublicHoliday/US");

      expect(status).toBeOneOf([200, 204]);
    });
  });
});
