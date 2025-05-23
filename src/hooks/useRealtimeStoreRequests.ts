"use client";
import { supabaseClient } from "@/utils/supabaseClient";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export function useStoreRequests() {
  const [requests, setRequests] = useState({});
  const { getToken } = useAuth();
  useEffect(() => {
    const getRequests = async () => {
      const token = await getToken({ template: "supabase" });
      if (!token) return;
      const supabase = await supabaseClient(token!);
      const storeRequests = supabase
        .channel(`stores-requests`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "StoreRequest",
            filter: `status=eq."Pending"`,
          },
          (payload) => {
            setRequests(payload.new);
          }
        )
        .subscribe();

      return () => {
        storeRequests.unsubscribe();
      };
    };
    getRequests();
  }, [getToken]);
  return requests;
}
