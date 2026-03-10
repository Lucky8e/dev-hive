"use client";
import { Black_Ops_One } from "next/font/google";
import { Download, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createAvatar } from "@dicebear/core";
import { openPeeps } from "@dicebear/collection";

const blackOps = Black_Ops_One({
  subsets: ["latin"],
  weight: ["400"] // choose the weight you need
});

type OnRunProps = {
  onRun: () => void;
  isRunning: boolean;
  userId: string;
  userName: string;
};

const NavBar = ({ onRun, isRunning, userId, userName }: OnRunProps) => {
  const [language, setLanguage] = useState("javaScript");

  const avatarUrl = createAvatar(openPeeps, {
    seed: userId
  }).toDataUri();
  return (
    <div
      className="fixed top-0 left-1/2 -translate-x-1/2 w-full  
          h-16 flex bg-black-800 px-6 border-b-2 border-b-primary"
    >
      <div className="flex items-center justify-between w-full h-full">
        {/* ---------------Left-Section-logo------------------------ */}
        <div className="flex items-center justify-center">
          <h1
            className={`${blackOps.className} text-2xl font-bold bg-linear-to-r
             from-purple-500
             via-indigo-600
             to-purple-500
               bg-clip-text 
               text-transparent`}
          >
            DevHive
          </h1>
        </div>
        {/* ---------------Center-Section-ChangeLanguage------------------------ */}
        <div className="flex items-center justify-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className="rounded-2xl rounded-r-none  bg-linear-to-l from-violet-800 via-violet-600 to-violet-800"
            >
              <Button>
                {language === "javaScript" && "🟨 JavaScript"}
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

          <Button
            onClick={onRun}
            disabled={isRunning}
            className="rounded-2xl rounded-l-none 
           bg-linear-to-r from-emerald-800 via-emerald-600 to-emerald-800"
          >
            <Play className="size-4 fill-current" />
            <span className="text-sm">{isRunning ? "Running" : "Run"}</span>
          </Button>
        </div>
        {/* ---------------Right-Section-{Share,Download,Settings,UserAvatar}------------------------ */}
        <div className="flex items-center gap-2 justify-center">
          <Button
            /* className=" bg-linear-to-r from-orange-800 via-orange-600 to-orange-800" */ variant={
              "outline"
            }
          >
            <span className="text-xs">Download Code</span>
            <Download className="size-4" strokeWidth={3} />
          </Button>
          <ModeToggle />

          <div>
            <Avatar className="overflow-visible" size="default">
              <AvatarImage src={avatarUrl} alt={userName} />
              <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NavBar;
