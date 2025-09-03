"use client";

import { Tldraw } from "tldraw";
import 'tldraw/tldraw.css'

export default function Home() {
  return (
    <div className="h-full w-full">
      <Tldraw />
    </div>
  );
}
