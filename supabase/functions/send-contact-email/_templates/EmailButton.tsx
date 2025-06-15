
import * as React from "npm:react@18.3.1";
import { Button } from "npm:@react-email/components@0.0.22";
import { PRIMARY_COLOR } from "./EmailHeader.tsx";

export const EmailButton = ({ href, children }: { href: string, children: React.ReactNode }) => (
  <Button
    href={href}
    style={{
      display: "inline-block",
      background: PRIMARY_COLOR,
      color: "#fff",
      padding: "16px 32px",
      textDecoration: "none",
      fontWeight: 700,
      borderRadius: 8,
      fontSize: 18,
      margin: "24px 0 0"
    }}
  >
    {children}
  </Button>
);

