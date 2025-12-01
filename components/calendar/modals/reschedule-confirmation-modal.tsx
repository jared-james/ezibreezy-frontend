// components/calendar/modals/reschedule-confirmation-modal.tsx

"use client";

import { AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface RescheduleConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  originalTime: string;
}

export default function RescheduleConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
  originalTime,
}: RescheduleConfirmationModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Past Schedule Warning
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            You moved this post to a time ({originalTime}) that has already
            passed for today.
            <br />
            <br />
            <strong>
              This will trigger the post to be published immediately.
            </strong>
            <br />
            Do you want to proceed?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-brand-primary text-brand-primary-foreground hover:bg-brand-primary/90"
            onClick={onConfirm}
          >
            Yes, Publish Now
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
