"use client";
import { Black_Ops_One } from "next/font/google";
import { Download, Play, Settings, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { ModeToggle } from "@/components/ui/ModeToggle";

const blackOps = Black_Ops_One({
  subsets: ["latin"],
  weight: ["400"] // choose the weight you need
});

type OnRunProps = {
  onRun: () => void;
  isRunning: boolean;
};

const NavBar = ({ onRun, isRunning }: OnRunProps) => {
  const [language, setLanguage] = useState("javaScript");
  return (
    <div
      className="fixed top-0 left-1/2 -translate-x-1/2 w-[100%]   
          h-16 flex bg-black-800 px-2 border-b-2 border-b-purple-950"
    >
      <div className="flex items-center justify-between w-full h-full">
        {/* ---------------Left-Section-logo------------------------ */}
        <div className="flex items-center justify-center">
          <h1
            className={`${blackOps.className} text-2xl font-bold bg-linear-to-r
             from-violet-400
             via-purple-500
             to-indigo-600
               bg-clip-text 
               text-transparent`}
          >
            DevHive
          </h1>
        </div>
        {/* ---------------Center-Section-ChangeLanguage------------------------ */}
        <div className="flex items-center justify-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                {language === "javascript" && "🟨 JavaScript"}
                {language === "typescript" && "🔷 TypeScript"}
                {language === "python" && "🐍 Python"}
                {language === "html" && "🌐 HTML"}
                {language === "css" && "🎨 CSS"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>🟨 JavaScript</DropdownMenuItem>
              <DropdownMenuItem>🔷 TypeScript</DropdownMenuItem>
              <DropdownMenuItem>🐍 Python</DropdownMenuItem>
              <DropdownMenuItem>🌐 HTML</DropdownMenuItem>
              <DropdownMenuItem>🎨 CSS</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={onRun} disabled={isRunning}>
            <Play className="size-4" />
            <span className="text-sm">{isRunning ? "Running" : "Run"}</span>
          </Button>
        </div>
        {/* ---------------Right-Section-{Share,Download,Settings,UserAvatar}------------------------ */}
        <div className="flex items-center gap-2 justify-center">
          <Button className="bg-none">
            <Share2 className="size-4 " />
            <span className="text-sm hidden sm:inline">Share</span>
          </Button>
          <Button className="bg-none">
            <Download className="size-4 " />
          </Button>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
};
export default NavBar;
