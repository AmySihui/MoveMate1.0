import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const navigate = useNavigate();

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const { data } = await axios.post("/api/s3/presigned-url", {
        fileName: file.name,
        fileType: file.type,
      });
      await axios.put(data.url, file, {
        headers: { "Content-Type": file.type },
      });
      setImageUrl(data.url.split("?")[0]);
    } catch {
      setImageUrl("");
    }
    setUploading(false);
  };

  const handleSubmit = async (values: any) => {
    if (!station) return;
    // Check login
    try {
      await getCurrentUser();
    } catch {
      navigate("/login");
      return;
    }
    await axios.post("/api/events", {
      ...values,
      stopName: station.stationDesc,
      latitude: station.latitude,
      longitude: station.longitude,
      lineName: station.lineName,
      status: "pending",
      imageUrl: imageUrl || undefined,
    });
    form.reset();
    setImageUrl("");
    onSubmit();
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
