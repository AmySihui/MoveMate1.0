import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import axios from "axios";
import { getCurrentUser } from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";
import { uploadToS3 } from "@/lib/uploadToS3";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

const eventFormSchema = z.object({
  eventType: z.string().min(1, "Please select event type"),
  description: z.string().min(2, "Please enter description"),
  image: z.any().optional(),
});

export default function AddEventForm({
  station,
  onSubmit,
}: {
  station: any;
  onSubmit: () => void;
}) {
  const form = useForm({
    resolver: zodResolver(eventFormSchema),
    defaultValues: { eventType: "", description: "" },
  });

  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const navigate = useNavigate();

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const imageUrl = await uploadToS3(file, "event-images");
      setImageUrl(imageUrl);
    } catch (e) {
      console.error("Image upload failed", e);
      setImageUrl("");
      toast({
        title: "Image upload failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
    setUploading(false);
  };

  const handleSubmit = async (values: any) => {
    if (!station) return;

    let userSub = "";
    try {
      const user = await getCurrentUser();
      userSub = user.userId || "";
    } catch {
      navigate(
        `/login?redirect=${encodeURIComponent(location.pathname + location.search)}`,
      );
      return;
    }

    try {
      setUploading(true);

      await axios.post(
        "/api/events/create-with-image",
        {
          ...values,
          stopName: station.stationDesc,
          latitude: station.latitude,
          longitude: station.longitude,
          lineName: station.lineName,
          imageUrl: imageUrl || null,
          userSub,
        },
        {
          headers: {
            "X-User-Sub": userSub,
            "X-Forwarded-For": "127.0.0.1",
          },
        },
      );

      toast({
        title: "Event submitted successfully",
        description: "Thank you for your feedback!",
      });

      form.reset();
      setImageUrl("");
      onSubmit();
    } catch (e: any) {
      console.log("提交请求：", {
        eventType: values.eventType,
        description: values.description,
        stopName: station.stationDesc,
        latitude: station.latitude,
        longitude: station.longitude,
        lineName: station.lineName,
        userSub,
        imageUrl,
      });

      const status = e?.response?.status;
      const message =
        e?.response?.data?.message || "Server error, please try again later.";

      toast({
        title: status === 400 ? "Invalid Content" : "Event submission failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3 p-3">
      <h4 className="text-lg font-semibold">
        Report Event {station?.stationDesc && `for ${station.stationDesc}`}
      </h4>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="eventType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Type</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full rounded border px-2 py-1"
                  >
                    <option value="">Select type</option>
                    <option value="Delay">Delay</option>
                    <option value="Suspension">Suspension</option>
                    <option value="Closure">Closure</option>
                    <option value="Other">Other</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Describe the event..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem>
            <FormLabel>Image (optional)</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
              />
            </FormControl>
            {uploading && (
              <div className="text-sm text-muted-foreground">
                Uploading image...
              </div>
            )}
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Uploaded"
                className="mt-2 h-24 w-full rounded object-cover"
              />
            )}
          </FormItem>
          <Button
            type="submit"
            className="w-full"
            disabled={uploading || form.formState.isSubmitting}
          >
            {uploading || form.formState.isSubmitting
              ? "Submitting..."
              : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
