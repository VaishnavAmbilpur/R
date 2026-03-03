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
import {
  Calculator,
  Trophy,
  Star,
  CheckCircle2,
  AlertCircle,
  Flame
} from "lucide-react";

interface Stats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number;
  reputation: number;
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
      "Reputation"
    ];

    const parts = text.split(
      /(\b\d+%?\b|\bTotal\b|\bEasy\b|\bMedium\b|\bHard\b|\bRanking\b|\bRank\b)/gi
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
        `/api/leetcode?username=${username}`
      );

      if (!res.ok) throw new Error("User not found");

      const data = await res.json();

      const extractedStats: Stats = {
        totalSolved: data.totalSolved,
        easySolved: data.easySolved,
        mediumSolved: data.mediumSolved,
        hardSolved: data.hardSolved,
        ranking: data.ranking,
        reputation: data.reputation,
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
Reputation: ${extractedStats.reputation}

Roast intelligently under 90 words.
Be specific. Personal. Sharp.
`,
      });

      setResponse(result.text || "No roast generated.");
      setMode("response");

    } catch (error: any) {
      console.error(error);
      setResponse(`Error: ${error.message || "Something went wrong"}.`);
      setMode("response");
    }

    setLoading(false);
  }

  return (
    <Card className="relative w-full max-w-[340px] md:max-w-[640px] h-auto max-h-[90vh] overflow-hidden bg-black text-white border border-white/10 rounded-2xl shadow-2xl mx-auto flex flex-col">

      {mode === 'input' ? (
        <>
          <CardHeader className="pt-8">
            <CardTitle className="tracking-tighter text-2xl md:text-3xl font-black text-center uppercase italic">
              <TextAnimate animation="blurIn">
                Drop Your Username. Prepare to Burn.
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
              className="w-full bg-white text-black font-bold hover:bg-white/80 transition-all uppercase tracking-widest"
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                {[
                  { label: "Total", value: stats.totalSolved, icon: <Calculator className="w-4 h-4 text-blue-400" /> },
                  { label: "Easy", value: stats.easySolved, icon: <CheckCircle2 className="w-4 h-4 text-green-400" /> },
                  { label: "Medium", value: stats.mediumSolved, icon: <AlertCircle className="w-4 h-4 text-yellow-400" /> },
                  { label: "Hard", value: stats.hardSolved, icon: <Flame className="w-4 h-4 text-red-400" /> },
                  { label: "Rank", value: stats.ranking, icon: <Trophy className="w-4 h-4 text-amber-400" /> },
                  { label: "Reputation", value: stats.reputation, icon: <Star className="w-4 h-4 text-purple-400" /> },
                ].map(({ label, value, icon }) => (
                  <div
                    key={label}
                    className="border border-white/10 rounded-xl p-4 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center gap-2 hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {icon}
                      <div className="text-[10px] uppercase tracking-widest text-white/50 font-medium">
                        {label}
                      </div>
                    </div>
                    <div className="text-xl md:text-2xl font-black tracking-tighter">
                      {value.toLocaleString()}
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
