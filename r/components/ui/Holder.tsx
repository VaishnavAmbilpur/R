'use client'
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoogleGenAI } from "@google/genai";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BorderBeam } from "@/components/magicui/border-beam";
import { TextAnimate } from "../magicui/text-animate";
import { useRef, useState } from "react";
export function Component() {
const info = useRef<HTMLInputElement>(null);
const [mode, setMode] = useState<'input' | 'response'>('input');
const [response, setResponse] = useState('');
const [loading, setLoading] = useState(false);
const ai = new GoogleGenAI({apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY});
async function main(username?: string) {
  setLoading(true);
  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Roast me with another level humor in English. This is my name: ${username}. Keep it to 50 words.`,
    });
    const response = result.text;
    console.log(response);
    const filteredText = String(response).replace(new RegExp(`^${username},?\\s*`, 'i'), '');
    setResponse(filteredText);
    setMode('response');
  } catch (error) {
    console.error("Error generating roast:", error);
    setResponse("An error occurred while generating the roast. Please try again.");
    setMode('response');
  }
  setLoading(false);
}
return (
    <Card className="relative w-[200px] md:w-100 overflow-hidden bg-zinc-950 text-white border-0 rounded-2xl md:text- text-xs">
      {mode === 'input' ? (
        <>
          <CardHeader>
            <div className="flex md:text-2xl justify-left text-xs "> <CardTitle className="tracking-tighter"><TextAnimate animation="blurIn">Username</TextAnimate></CardTitle>
    </div>
       
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : (
          <form>
            <div className="grid w-full items-center gap-4 md:text-xl text-xs">
              <div className="flex flex-col space-y-1.5">
                <Input id="username" ref={info} type="username" placeholder="Enter your username" size={3} className="md:text-md text-xs" />
              </div>
            </div>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-between md:text-xl text-xs">
        <div><Button disabled={loading} className="hover:bg-red-900 font-bold hover:text-white md:text-md text-xs" onClick={() => { if (info.current && !loading) main(info.current.value) }}>Roast me</Button></div>
      </CardFooter>
        </>
      ) : (
        <>
          <CardHeader>
            <div className="flex md:text-2xl justify-left text-sm font-extrabold"> <CardTitle className="tracking-tighter">Roast</CardTitle>
    </div>
      </CardHeader>
      <CardContent>
        <a className="md:text-md font-mono font-extrabold text-xs"><TextAnimate animation="blurIn">{response}</TextAnimate></a>
      </CardContent>
      <CardFooter className="flex justify-between md:text-xl text-xs">
        <div><Button className="hover:bg-red-900 font-bold hover:text-white md:text-md text-xs" onClick={() => { setMode('input'); setResponse(''); setLoading(false); }}>Roast Again</Button></div>
      </CardFooter>
        </>
      )}
       <BorderBeam delay={10} size={100} borderWidth={2}></BorderBeam>
    </Card>
  );
}
