"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Props = {
  children: React.ReactElement;
};

export function SignOutButton({ children }: Props) {
  const router = useRouter();
  const supabase = React.useMemo(() => createSupabaseBrowserClient(), []);

  async function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    children.props.onClick?.(event);
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return React.cloneElement(children, {
    onClick: handleClick,
    type: "button",
  });
}

