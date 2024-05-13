import { LocalDate, LocalDateTime, LocalTime } from "@js-joda/core";
export declare namespace DateTimeHelper {
    const formatDateTime: (value: string, format: string, type: "date" | "time" | "datetime", errorMessage?: string) => string | undefined;
    function toLocalDateOrTime(value: string, format: string, type: "date"): LocalDate | undefined;
    function toLocalDateOrTime(value: string, format: string, type: "time"): LocalTime | undefined;
    function toLocalDateOrTime(value: string, format: string, type: "datetime"): LocalDateTime | undefined;
}
