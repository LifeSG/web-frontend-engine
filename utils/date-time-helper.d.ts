import { LocalDate, LocalDateTime, LocalTime } from "@js-joda/core";
import { IDaysRangeRule, IWithinDaysRangeRule } from "../context-providers";
export declare namespace DateTimeHelper {
    const formatDateTime: (value: string, format: string, type: "date" | "time" | "datetime", errorMessage?: string) => string | undefined;
    function toLocalDateOrTime(value: string, format: string, type: "date"): LocalDate | undefined;
    function toLocalDateOrTime(value: string, format: string, type: "time"): LocalTime | undefined;
    function toLocalDateOrTime(value: string, format: string, type: "datetime"): LocalDateTime | undefined;
    function calculateWithinDaysRange(withinDays: IWithinDaysRangeRule): {
        startDate: LocalDate;
        endDate: LocalDate;
    };
    function calculateDisabledWithinDaysRange(withinDays: IWithinDaysRangeRule): {
        startDate: LocalDate;
        endDate: LocalDate;
    };
    function calculateDisabledBeyondDaysRange(beyondDays: IDaysRangeRule): {
        startDate: any;
        endDate: any;
    };
    function checkWithinDays(value: string, withinDays: IWithinDaysRangeRule): boolean;
    function checkBeyondDays(value: string, beyondDays: IDaysRangeRule): boolean;
}
