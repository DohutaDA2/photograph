import * as business from "../hoc/business/business";

describe("Tinh lai suat", () => {
  test("STK 10.000.000 co ky han 12 thang, lai suat 5%", () => {
    expect(business.calculateLimit(10000000, 5, 12)).toBe(500000);
  });

  test("STK 10.000.000 co ky han 6 thang, lai suat 5%", () => {
    expect(business.calculateLimit(10000000, 5, 6)).toBe(250000);
  });

  test("STK 10.000.000 co ky han 3 thang, lai suat 5%", () => {
    expect(business.calculateLimit(10000000, 5, 3)).toBe(125000);
  });

  test("STK 10.000.000 co ky han 1 thang, lai suat 5%", () => {
    expect(business.calculateLimit(10000000, 5, 1)).toBe(500000 / 12);
  });

  test("STK 10.000.000 khong ky han, lai suat 0.5%, gui 365 ngay", () => {
    expect(business.calculateUnLimit(10000000, 0.5, 365)).toBe(18250000 / 360);
  });
});

describe("Tinh so du STK", () => {
  test("STK 10.000.000 co ky han 12 thang, lai suat 5%", () => {
    expect(
      business.calculate(
        null,
        10000000,
        5,
        0.5,
        new Date("1,1,2017"),
        12,
        true,
        "t00"
      )
    ).toBe(10500000);
  });

  test("STK 10.000.000 co ky han 6 thang, lai suat 5%", () => {
    expect(
      business.calculate(
        null,
        10000000,
        5,
        0.5,
        new Date("1,1,2017"),
        6,
        true,
        "t00"
      )
    ).toBe(10250000);
  });

  test("STK 10.000.000 co ky han 3 thang, lai suat 5%", () => {
    expect(
      business.calculate(
        null,
        10000000,
        5,
        0.5,
        new Date("1,1,2017"),
        3,
        true,
        "t00"
      )
    ).toBe(10125000);
  });

  test("STK 10.000.000 co ky han 1 thang, lai suat 5%", () => {
    expect(
      business.calculate(
        null,
        10000000,
        5,
        0.5,
        new Date("1,1,2017"),
        1,
        true,
        "t00"
      )
    ).toBe(10041667);
  });

  test("STK 10.000.000 khong ky han, lai suat 0.5%, gui 365 ngay", () => {
    expect(
      business.calculate(
        null,
        10000000,
        5,
        0.5,
        new Date("1,1,2017"),
        0,
        true,
        "t00"
      )
    ).toBe(10092917);
  });
});
