package com.college.portal.service;

import org.springframework.stereotype.Service;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Service
public class DateResolverService {

    private static final ZoneId ZONE_ID = ZoneId.of("Asia/Kolkata");

    // Formatters for explicit date input
    private static final DateTimeFormatter[] DATE_FORMATS = {
            DateTimeFormatter.ofPattern("dd-MM-yyyy"),
            DateTimeFormatter.ofPattern("dd/MM/yyyy"),
            DateTimeFormatter.ISO_LOCAL_DATE // yyyy-MM-dd
    };

    /**
     * Resolve date for TIMETABLE queries.
     * Weekday names resolve to the NEXT future occurrence (timetable is
     * recurring).
     */
    public LocalDate resolveDate(String query) {
        LocalDate now = LocalDate.now(ZONE_ID);
        String lowerQuery = query.toLowerCase().trim();

        // Try explicit date first
        LocalDate explicit = tryParseExplicitDate(lowerQuery);
        if (explicit != null)
            return explicit;

        if (lowerQuery.contains("yesterday")) {
            return now.minusDays(1);
        }

        if (lowerQuery.contains("tomorrow")) {
            if (lowerQuery.contains("day after") || lowerQuery.contains("next tomorrow")) {
                return now.plusDays(2);
            }
            return now.plusDays(1);
        }

        if (lowerQuery.contains("today")) {
            return now;
        }

        DayOfWeek targetDay = getDayOfWeekFromQuery(lowerQuery);
        if (targetDay != null) {
            return resolveDateForWeekday(now, targetDay);
        }

        return now;
    }

    /**
     * Resolve date for ATTENDANCE queries.
     * Weekday names resolve to the MOST RECENT PAST occurrence (attendance is
     * historical).
     * "today" returns today, "yesterday" returns yesterday, "monday" returns last
     * Monday, etc.
     */
    public LocalDate resolveDateForAttendance(String query) {
        LocalDate now = LocalDate.now(ZONE_ID);
        String lowerQuery = query.toLowerCase().trim();

        // Try explicit date first
        LocalDate explicit = tryParseExplicitDate(lowerQuery);
        if (explicit != null)
            return explicit;

        if (lowerQuery.contains("day before yesterday") || lowerQuery.contains("two days ago")) {
            return now.minusDays(2);
        }

        if (lowerQuery.contains("yesterday")) {
            return now.minusDays(1);
        }

        if (lowerQuery.contains("today")) {
            return now;
        }

        // Handle "last week monday" or "last monday" — resolve to PREVIOUS week's
        // occurrence
        DayOfWeek targetDay = getDayOfWeekFromQuery(lowerQuery);
        if (targetDay != null) {
            if (lowerQuery.contains("last week") || lowerQuery.contains("last ")) {
                return resolveLastWeekDay(now, targetDay);
            }
            // For attendance, weekday names resolve to the MOST RECENT PAST occurrence
            return resolvePastWeekday(now, targetDay);
        }

        return now;
    }

    /**
     * Check if the given date is in the future (after today).
     */
    public boolean isFutureDate(LocalDate date) {
        LocalDate now = LocalDate.now(ZONE_ID);
        return date.isAfter(now);
    }

    /**
     * Check if the query text refers to a future date concept
     * (tomorrow, next week, day after tomorrow, etc.)
     */
    public boolean isFutureDateQuery(String query) {
        String lowerQuery = query.toLowerCase().trim();

        // "last week" and "last monday" are PAST, not future
        if (lowerQuery.contains("last week") || lowerQuery.contains("last "))
            return false;

        if (lowerQuery.contains("tomorrow"))
            return true;
        if (lowerQuery.contains("next week"))
            return true;
        if (lowerQuery.contains("day after tomorrow"))
            return true;
        if (lowerQuery.contains("overmorrow"))
            return true;
        if (lowerQuery.contains("two days from now"))
            return true;

        // Check if "next" + weekday is mentioned
        if (lowerQuery.contains("next") && getDayOfWeekFromQuery(lowerQuery) != null)
            return true;

        // Try explicit date — if it's in the future, it's a future query
        LocalDate explicit = tryParseExplicitDate(lowerQuery);
        if (explicit != null && isFutureDate(explicit))
            return true;

        return false;
    }

    /**
     * Try to parse an explicit date from the query string.
     * Supports: dd-MM-yyyy, dd/MM/yyyy, yyyy-MM-dd
     */
    private LocalDate tryParseExplicitDate(String query) {
        // Extract date-like patterns from the query
        String[] tokens = query.split("\\s+");
        for (String token : tokens) {
            for (DateTimeFormatter fmt : DATE_FORMATS) {
                try {
                    return LocalDate.parse(token, fmt);
                } catch (DateTimeParseException ignored) {
                }
            }
        }
        return null;
    }

    private DayOfWeek getDayOfWeekFromQuery(String query) {
        if (query.contains("monday") || query.contains("mon"))
            return DayOfWeek.MONDAY;
        if (query.contains("tuesday") || query.contains("tue"))
            return DayOfWeek.TUESDAY;
        if (query.contains("wednesday") || query.contains("wed"))
            return DayOfWeek.WEDNESDAY;
        if (query.contains("thursday") || query.contains("thu"))
            return DayOfWeek.THURSDAY;
        if (query.contains("friday") || query.contains("fri"))
            return DayOfWeek.FRIDAY;
        if (query.contains("saturday") || query.contains("sat"))
            return DayOfWeek.SATURDAY;
        if (query.contains("sunday") || query.contains("sun"))
            return DayOfWeek.SUNDAY;
        return null;
    }

    /**
     * Resolve to the NEXT future occurrence of this weekday (for timetable).
     */
    private LocalDate resolveDateForWeekday(LocalDate now, DayOfWeek targetDay) {
        DayOfWeek currentDay = now.getDayOfWeek();

        if (currentDay == targetDay) {
            return now;
        }

        int daysUntil = targetDay.getValue() - currentDay.getValue();
        if (daysUntil < 0) {
            daysUntil += 7;
        }
        return now.plusDays(daysUntil);
    }

    /**
     * Resolve to the MOST RECENT PAST occurrence of this weekday (for attendance).
     * If today is that weekday, returns today.
     */
    private LocalDate resolvePastWeekday(LocalDate now, DayOfWeek targetDay) {
        DayOfWeek currentDay = now.getDayOfWeek();

        if (currentDay == targetDay) {
            return now;
        }

        // Calculate days to go back
        int daysBack = currentDay.getValue() - targetDay.getValue();
        if (daysBack <= 0) {
            daysBack += 7;
        }
        return now.minusDays(daysBack);
    }

    /**
     * Resolve to the PREVIOUS WEEK's occurrence of this weekday.
     * "last week monday" always goes back at least 7 days to find that weekday.
     */
    private LocalDate resolveLastWeekDay(LocalDate now, DayOfWeek targetDay) {
        // First find the most recent past occurrence
        LocalDate recent = resolvePastWeekday(now, targetDay);
        // If it's today or within the current week, go back 7 more days
        if (recent.equals(now) || now.toEpochDay() - recent.toEpochDay() < 7) {
            return recent.minusDays(7);
        }
        return recent;
    }
}
