"use client";

import { useEffect } from "react";

type ScriptAndStyleLoaderProps = {
  css: string;
};

const ScriptAndStyleLoader: React.FC<ScriptAndStyleLoaderProps> = ({ css }) => {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = css.replace("<style>", "").replace("</style>", "");

    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [css]);

  return <></>;
};

export default ScriptAndStyleLoader;
