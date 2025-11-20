// app/(app)/ideas/components/edit-clipping-modal.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  type Clipping as GeneratedClipping,
  saveClippingAsDraft,
} from "@/lib/api/ideas";
import {
  type Clipping as EditorialClipping,
  type EditorialDraft,
} from "@/lib/types/editorial";
import { useEditorialStore } from "@/lib/store/editorial-store";
import ModalHeader from "./edit-modal/modal-header";
import EditorialCore from "@/app/(app)/editorial/components/editorial-core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { getClientDataForEditor } from "@/app/actions/data";
import { toast } from "sonner";

interface EditClippingModalProps {
  isOpen: boolean;
  onClose: () => void;
  idea: EditorialClipping | GeneratedClipping;
}

export default function EditClippingModal({
  isOpen,
  onClose,
  idea,
}: EditClippingModalProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Data for saving the clipping
  const { data: clientData } = useQuery({
    queryKey: ["clientEditorData"],
    queryFn: getClientDataForEditor,
    staleTime: 60000,
  });

  const connections = clientData?.connections || [];
  const userContext = clientData;

  const setState = useEditorialStore((state) => state.setState);
  const reset = useEditorialStore((state) => state.reset);
  const setDraft = useEditorialStore((state) => state.setDraft);
  const mainCaption = useEditorialStore((state) => state.mainCaption);
  const platformCaptions = useEditorialStore((state) => state.platformCaptions);
  const selectedAccounts = useEditorialStore((state) => state.selectedAccounts);
  const threadMessages = useEditorialStore((state) => state.threadMessages);
  const labels = useEditorialStore((state) => state.labels);
  const collaborators = useEditorialStore((state) => state.collaborators);
  const location = useEditorialStore((state) => state.location);
  const aiGenerated = useEditorialStore((state) => state.aiGenerated);
  const recycleInterval = useEditorialStore((state) => state.recycleInterval);
  const mediaItems = useEditorialStore((state) => state.mediaItems);

  const saveMutation = useMutation({
    mutationFn: saveClippingAsDraft,
    onSuccess: (data) => {
      toast.success(
        `Idea "${
          data.title || data.content.substring(0, 30)
        }..." saved as a draft!`
      );
      queryClient.invalidateQueries({ queryKey: ["contentLibrary"] });
      onClose();
    },
    onError: (error: any) => {
      console.error("Error saving clipping:", error);
      toast.error(
        `Failed to save clipping: ${
          error?.response?.data?.message || "An unknown error occurred."
        }`
      );
    },
  });

  // Initialize store when modal opens
  useEffect(() => {
    if (isOpen) {
      const isAiGenerated =
        "body" in idea && idea.hashtags?.includes("#ezibreezy");

      setState({
        mainCaption: idea.body,
        selectedAccounts: {},
        aiGenerated: isAiGenerated,
        recycleInterval: null,
        threadMessages: [],
        platformCaptions: {},
        labels: "",
        collaborators: "",
        location: "",
        scheduleDate: new Date().toISOString().split("T")[0],
        scheduleTime: "12:00",
        sourceDraftId: null,
        mediaItems: [],
      });
    } else {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, idea.title, idea.body]);

  const handleOpenInEditorial = () => {
    const mainPostMedia = mediaItems.filter((m) => m.threadIndex === null);
    const postType =
      mainPostMedia.length === 0
        ? "text"
        : mainPostMedia.some(
            (m) =>
              m.file?.type.startsWith("video/") ||
              m.preview.toLowerCase().endsWith(".mp4") ||
              m.preview.toLowerCase().endsWith(".mov")
          )
        ? "video"
        : "image";

    const draft: EditorialDraft = {
      postType,
      mainCaption,
      platformCaptions,
      activePlatforms: Object.keys(selectedAccounts),
      selectedAccounts,
      media:
        mainPostMedia.length > 0 && mainPostMedia[0].file
          ? {
              file: mainPostMedia[0].file,
              preview: mainPostMedia[0].preview,
              type: postType === "video" ? "video" : "image",
            }
          : undefined,
      distribution: {
        labels,
        threadMessages,
        collaborators,
        location,
      },
      schedule: {
        isScheduled: useEditorialStore.getState().isScheduling,
        date: useEditorialStore.getState().scheduleDate,
        time: useEditorialStore.getState().scheduleTime,
      },
      sourceClippingId: "id" in idea ? idea.id : undefined,
      sourceTitle: idea.title,
      aiGenerated,
      recycleInterval,
      sourceDraftId: null,
    };

    setDraft(draft);
    router.push("/editorial");
    onClose();
  };

  const handleSaveClipping = () => {
    if (!userContext?.userId || !userContext?.organizationId) {
      return toast.error("User context data missing. Cannot save.");
    }

    const defaultIntegrationId = connections[0]?.id;
    if (!defaultIntegrationId) {
      return toast.error("No connected accounts found. Cannot save draft.");
    }

    saveMutation.mutate({
      userId: userContext.userId,
      organizationId: userContext.organizationId,
      integrationId: defaultIntegrationId,
      title: idea.title,
      content: mainCaption,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/50">
      <div className="flex h-[90vh] w-full max-w-7xl flex-col overflow-hidden border-4 border-foreground bg-surface shadow-2xl">
        <ModalHeader idea={idea} onClose={onClose} />
        <div className="flex-1 overflow-y-auto p-6">
          <EditorialCore
            mode="clipping"
            onSaveClipping={handleSaveClipping}
            isSavingClipping={saveMutation.isPending}
            onOpenInEditorial={handleOpenInEditorial}
          />
        </div>
      </div>
    </div>
  );
}
