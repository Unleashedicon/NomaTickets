"use client";

import { Fragment, useEffect, useState } from "react";
import HomePage from "@/components/home"
export const dynamic = "force-dynamic";

export default function Home() {

  return (
    <main className="flex flex-col py-6">
      <div className="flex flex-col h-full gap-6 justify-center items-center">
        <Fragment>
          <HomePage />
        </Fragment>
      </div>
    </main>
  );
}