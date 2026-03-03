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
    <ClientOnlyWarpBackground className="min-h-screen w-full bg-zinc-950 text-white overflow-hidden relative">
      <div className="flex items-center gap-y-5 flex-col justify-center min-h-[90vh] w-full px-4 m-auto overflow-hidden">
        <div className="flex flex-col items-center gap-y-1">
          <div className="flex flex-col md:flex-row items-center justify-center gap-x-3 gap-y-0 text-center">
            <TextAnimate
              animation="blurIn"
              delay={0.5}
              by="character"
              className="text-4xl md:text-5xl font-mono font-black uppercase tracking-tighter"
            >
              Leetcode
            </TextAnimate>
            <TextAnimate
              animation="blurIn"
              delay={0.8}
              by="character"
              className="text-4xl md:text-5xl font-mono font-black uppercase tracking-tighter text-white"
            >
              Roaster
            </TextAnimate>
          </div>
          <TextAnimate
            animation="slideUp"
            delay={1.2}
            by="character"
            className="text-[10px] md:text-xs font-mono font-bold text-white/40 uppercase tracking-[0.2em]"
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