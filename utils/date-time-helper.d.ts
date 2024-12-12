import { LocalDate, LocalDateTime, LocalTime } from "@js-joda/core";
import { IDaysRangeRule } from "../context-providers";
export declare namespace DateTimeHelper {
    const formatDateTime: (value: string, format: string, type: "date" | "time" | "datetime", errorMessage?: string) => string | undefined;
    function toLocalDateOrTime(value: string, format: string, type: "date"): LocalDate | undefined;
    function toLocalDateOrTime(value: string, format: string, type: "time"): LocalTime | undefined;
    function toLocalDateOrTime(value: string, format: string, type: "datetime"): LocalDateTime | undefined;
    function calculateWithinDaysRange(withinDays: IDaysRangeRule): {
        startDate: LocalDate;
        endDate: LocalDate;
    };
    function calculateDisabledBeyondDaysDates(beyondDays: IDaysRangeRule): string[];
    function checkWithinDays(value: string, withinDays: IDaysRangeRule): boolean;
    function checkBeyondDays(value: string, beyondDays: IDaysRangeRule): boolean;
}
