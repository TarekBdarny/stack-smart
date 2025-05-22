"use client";
import { requestToOpenStore } from "@/actions/store.action";
import { getAuthUser } from "@/actions/user.action";
import React, { useEffect } from "react";

const RequestPage = () => {
  useEffect(() => {
    const sendRequest = async () => {
      const user = await getAuthUser();
      if (!user) return;
      const storeData = {
        name: "store name",
        location: "store location",
        workHours: "store work hours",
        requesterId: user?.id,
      };
      const res = await requestToOpenStore(storeData);
      if (!res?.success) {
        console.log(res?.error);
        return;
      }
      console.log(res?.message);
    };
    sendRequest();
  }, []);
  return <div>Hello</div>;
};

export default RequestPage;
