// app/(app)/ideas/components/edit-clipping-modal.tsx
// COMMENTED OUT - Modal functionality being refactored to avoid excessive editorial updates

/*
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  type Clipping as GeneratedClipping,
  saveClippingAsDraft,
} from "@/lib/api/ideas";
import { type EditorialDraft } from "@/lib/types/editorial";
import { useEditorialStore } from "@/lib/store/editorial-store";
import ModalHeader from "@/components/post-editor/modal-header";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { getClientDataForEditor } from "@/app/actions/data";
import { toast } from "sonner";
import EditorialCore from "@/components/post-editor";

interface EditClippingModalProps {
  isOpen: boolean;
  onClose: () => void;
  idea: GeneratedClipping;
}

export default function EditClippingModal({
  isOpen,
  onClose,
  idea,
}: EditClippingModalProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

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
  const stagedMediaItems = useEditorialStore((state) => state.stagedMediaItems);
  const platformMediaSelections = useEditorialStore(
    (state) => state.platformMediaSelections
  );

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
        location: { id: null, name: "" },
        scheduleDate: new Date().toISOString().split("T")[0],
        scheduleTime: "12:00",
        sourceDraftId: null,
        stagedMediaItems: [],
        platformMediaSelections: {},
      });
    } else {
      reset();
    }
  }, [isOpen, idea.title, idea.body, setState, reset]);

  const handleOpenInEditorial = () => {
    const mainPostMedia = stagedMediaItems.filter(
      (m) => m.threadIndex === null
    );
    const postType =
      mainPostMedia.length === 0
        ? "text"
        : mainPostMedia.some((m) => m.type === "video")
        ? "video"
        : "image";

    const draft: EditorialDraft = {
      postType,
      mainCaption,
      platformCaptions,
      activePlatforms: Object.keys(selectedAccounts),
      selectedAccounts,
      stagedMediaItems: stagedMediaItems.map((item) => ({
        uid: item.uid,
        preview: item.preview,
        type: item.type,
        file: item.file || undefined,
      })),
      platformMediaSelections,
      distribution: {
        labels,
        threadMessages,
        collaborators,
        location: location.name,
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
*/

// Temporary stub to prevent build errors
import type { Clipping as GeneratedClipping } from "@/lib/api/ideas";

interface EditClippingModalProps {
  isOpen: boolean;
  onClose: () => void;
  idea: GeneratedClipping;
}

export default function EditClippingModal({}: EditClippingModalProps) {
  return null;
}
