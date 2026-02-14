'use client'

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoogleGenAI } from "@google/genai";
import { Input } from "@/components/ui/input";
import { BorderBeam } from "@/components/magicui/border-beam";
import { TextAnimate } from "../magicui/text-animate";
import { useRef, useState } from "react";

interface Stats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number;
  acceptanceRate: number;
}

export function Component() {
  const info = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<'input' | 'response'>('input');
  const [response, setResponse] = useState('');
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);

  const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
  });

  function renderFormattedRoast(text: string) {
    if (!text) return null;

    const keywords = [
      "Total",
      "Easy",
      "Medium",
      "Hard",
      "Ranking",
      "Rank",
      "Acceptance"
    ];

    const parts = text.split(
      /(\b\d+%?\b|\bTotal\b|\bEasy\b|\bMedium\b|\bHard\b|\bRanking\b|\bRank\b|\bAcceptance\b)/gi
    );

    return parts.map((part, index) => {
      const isBold =
        /\b\d+%?\b/.test(part) ||
        keywords.some(word => new RegExp(`^${word}$`, "i").test(part));

      return (
        <span key={index} className={isBold ? "font-extrabold" : ""}>
          {part}
        </span>
      );
    });
  }

  async function main(username?: string) {
    if (!username) return;

    setLoading(true);

    try {
      const res = await fetch(
        `https://leetcode-stats-api.herokuapp.com/${username}`
      );

      if (!res.ok) throw new Error("User not found");

      const data = await res.json();

      const extractedStats: Stats = {
        totalSolved: data.totalSolved,
        easySolved: data.easySolved,
        mediumSolved: data.mediumSolved,
        hardSolved: data.hardSolved,
        ranking: data.ranking,
        acceptanceRate: data.acceptanceRate,
      };

      setStats(extractedStats);

      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
You are roasting a LeetCode user named ${username}.
Make it obvious you are talking about THEM.

Stats:
Total: ${extractedStats.totalSolved}
Easy: ${extractedStats.easySolved}
Medium: ${extractedStats.mediumSolved}
Hard: ${extractedStats.hardSolved}
Ranking: ${extractedStats.ranking}
Acceptance Rate: ${extractedStats.acceptanceRate}%

Roast intelligently under 90 words.
Be specific. Personal. Sharp.
`,
      });

      setResponse(result.text || "No roast generated.");
      setMode("response");

    } catch (error) {
      console.error(error);
      setResponse("User not found or API error.");
      setMode("response");
    }

    setLoading(false);
  }

  return (
    <Card className="relative w-[340px] md:w-[560px] overflow-hidden bg-black text-white border border-white/10 rounded-2xl shadow-2xl">

      {mode === 'input' ? (
        <>
          <CardHeader>
            <CardTitle className="tracking-tight text-xl md:text-3xl font-extrabold">
              <TextAnimate animation="blurIn">
                I Dare You Enter Your Profile
              </TextAnimate>
            </CardTitle>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-24">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
              </div>
            ) : (
              <Input
                ref={info}
                placeholder="Enter LeetCode username"
                className="bg-black border-white/20 text-white placeholder:text-white/40 focus:border-white"
              />
            )}
          </CardContent>

          <CardFooter>
            <Button
              disabled={loading}
              className="w-full bg-white text-black font-bold hover:bg-white/80 transition-all"
              onClick={() => {
                if (info.current && !loading)
                  main(info.current.value.trim());
              }}
            >
              Roast Me
            </Button>
          </CardFooter>
        </>
      ) : (
        <>
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl font-bold">
              Profile Breakdown
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">

         
            {stats && (
              <div className="grid grid-cols-2 gap-4 text-center">
                {[
                  ["Total", stats.totalSolved],
                  ["Easy", stats.easySolved],
                  ["Medium", stats.mediumSolved],
                  ["Hard", stats.hardSolved],
                  ["Rank", stats.ranking],
                  ["Acceptance", `${stats.acceptanceRate}%`],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="border border-white/10 rounded-xl p-4 bg-black"
                  >
                    <div className="text-xs uppercase tracking-wide text-white/50">
                      {label}
                    </div>
                    <div className="text-lg md:text-xl font-bold">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-black border border-white/10 p-5 rounded-xl shadow-inner">
              <div className="font-mono text-sm md:text-base leading-relaxed whitespace-pre-wrap opacity-0 h-0">
                <TextAnimate animation="blurIn">
                  {response}
                </TextAnimate>
              </div>

              <div className="font-mono text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                {renderFormattedRoast(response)}
              </div>
            </div>

          </CardContent>

          <CardFooter>
            <Button
              className="w-full bg-white text-black font-bold hover:bg-white/80 transition-all"
              onClick={() => {
                setMode('input');
                setResponse('');
                setStats(null);
              }}
            >
              Try Again
            </Button>
          </CardFooter>
        </>
      )}

      <BorderBeam delay={5} size={120} borderWidth={1} />
    </Card>
  );
}
