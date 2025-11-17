"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  slug: string;
  friendName: string;
};

export function FriendAccessForm({ slug, friendName }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage(null);
    const formData = new FormData(event.currentTarget);
    const accessKey = (formData.get("accessKey") as string | null)?.trim() ?? "";

    if (!accessKey) {
      setError("Bạn chưa nhập key.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/verify-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug, accessKey }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Không thể xác thực key.");
      } else {
        setMessage("Đã mở khóa! Đang tải nội dung...");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra, thử lại sau nhé.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="accessKey">
          Nhập key {friendName ? `do ${friendName} cung cấp` : ""}
        </Label>
        <Input
          id="accessKey"
          name="accessKey"
          type="password"
          placeholder="••••••"
          autoComplete="off"
          disabled={isSubmitting}
        />
      </div>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="text-sm text-emerald-600" role="status">
          {message}
        </p>
      )}
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Đang kiểm tra..." : "Mở khóa thư"}
      </Button>
    </form>
  );
}

