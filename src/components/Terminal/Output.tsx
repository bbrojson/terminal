/* eslint-disable react/no-array-index-key */
import React from "react";
import { TerminalStyles } from "./Terminal";
import { OuptutMessage } from "./types";

type OutputProps = {
  output: OuptutMessage[];
  styles: TerminalStyles;
};

export function Output({ styles, output }: OutputProps) {
  return (
    <output>
      {output.map(({ type, prefix, message }, index) => {
        if (type === "command") {
          return (
            <div key={index} className={styles.command}>
              <u>$</u>
              <span>{message}</span>
            </div>
          );
        }
        return (
          <div key={index} className={`${styles.output} ${styles[type]}`}>
            {prefix && <u>{prefix}: </u>}
            <div dangerouslySetInnerHTML={{ __html: message }} />
          </div>
        );
      })}
    </output>
  );
}
