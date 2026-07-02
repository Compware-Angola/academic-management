import { queryClient } from "@/lib/react-query";
import { configureAcademicCalendarService } from "@/services/academiccalendar/configure-cademic-calendar.service";
import { useMutation } from "@tanstack/react-query";

export const useMutationConfigureAcademicCalendar = () => {
    return useMutation({
        mutationFn: configureAcademicCalendarService,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["academic-calendar"],
            });
            queryClient.invalidateQueries({
                queryKey: ["vacancies"],
            });
            queryClient.invalidateQueries({
                queryKey: ["academic-year-monthly-fees"],
            });
            queryClient.invalidateQueries({
                queryKey: ["academic-year-params"],
            });
            queryClient.invalidateQueries({
                queryKey: ["academic-year"],
            });
            queryClient.invalidateQueries({
                queryKey: ["academic-year-vacancies"],
            });
        },
    });
}