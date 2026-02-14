'use client'
import { WarpBackground } from "@/components/magicui/warp-background";
import { TextAnimate } from "@/components/magicui/text-animate";
import { Component } from "@/components/ui/Holder";
import { useState, useEffect, ReactNode } from "react";

function ClientOnlyWarpBackground({ children, className }: { children: ReactNode; className?: string }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className={`${className} flex items-center justify-center`}>
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <WarpBackground className={className}>
      {children}
    </WarpBackground>
  );
}

export default function Home() {
  return (
    <ClientOnlyWarpBackground className="min-h-screen w-full bg-zinc-950 text-white">
      <div className="flex items-center gap-y-5 flex-col justify-center h-fit w-fit m-auto mt-60 md:mt-30 rounded-1xl">
        <div className="flex flex-col gap-x-2">
          <TextAnimate 
            animation="blurIn" 
            delay={2} 
            by="character" 
            className="text-3xl font-mono font-extrabold"
          >
           Leetcode Roaster
          </TextAnimate>
          <TextAnimate 
            animation="slideUp" 
            delay={2} 
            by="character" 
            className="text-xs font-mono font-extrabold"
          >
            Want to Roast your Leetcode acc?
          </TextAnimate>
        </div>
        <div>
          <Component />
        </div>
      </div>
    </ClientOnlyWarpBackground>
  );
}