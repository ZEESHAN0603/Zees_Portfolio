import React from "react";
import { IconCloud } from "../ui/interactive-icon-cloud";

const defaultSlugs = [
  "python",
  "java",
  "javascript",
  "typescript",
  "nextdotjs",
  "nodedotjs",
  "docker",
  "postgresql",
  "supabase",
  "git",
  "github",
  "visualstudiocode",
  "googlecolab",
  "androidstudio",
  "antigravity",
  "anthropic",
  "pytorch",
  "tensorflow",
  "fastapi",
  "flask",
  "mongodb",
  "redis",
  "amazons3",
  "googlecloud",
  "linux",
  "nginx",
  "langchain",
  "n8n",
];


export function IconCloudDemo({ iconSlugs }: { iconSlugs?: string[] }) {
  return (
    <div className="relative mx-auto flex h-[320px] md:h-[480px] w-full max-w-2xl items-center justify-center">
      <IconCloud iconSlugs={iconSlugs || defaultSlugs} />
    </div>
  );
}
