'use client'
import Block from "@/components/block/Block";
import { useGlobalState } from "@/state";
import { useEffect } from "react";

export default function HomePage() {
  const { state } = useGlobalState();
  useEffect(() => {
    console.log(state);
  }, [state])
  const list = state.values();
  return (
    <>
      {Array.from(state.values()).map(block => (
        <Block key={block.id} block={block} />
      ))}
    </>
  )
}
