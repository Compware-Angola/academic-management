import { useMutation } from "@tanstack/react-query";


import { ChangeShiftStudentRequest, changeShiftStudent } from "@/services/students/change-shift.service";
import { queryClient } from "@/lib/react-query";
import { toast } from "sonner";
import { ChangeShiftStudentResponse } from "@/services/students/change-shift.service";
export function useMutationChangeShift() {
    return useMutation({
        mutationFn: async (data: ChangeShiftStudentRequest) => await changeShiftStudent(data),
        onSuccess: (data: ChangeShiftStudentResponse) => {
            queryClient.invalidateQueries({ queryKey: ["student-detail"] });
            toast.success(data.message);
        },
        onError: (error: any) => {

        }
    })
}
