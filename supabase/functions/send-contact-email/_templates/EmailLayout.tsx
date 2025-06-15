import * as React from "npm:react@18.3.1";
import { Html, Head, Body, Container } from "npm:@react-email/components@0.0.22";

export const EmailLayout = ({ children }: { children: React.ReactNode }) => (
  <Html>
    <Head />
    <Body style={{ margin: 0, padding: 0, backgroundColor: "#000", color: "#fff", fontFamily: "Plus Jakarta Sans, Arial, sans-serif" }}>
      <Container style={{
        background: "#000",
        padding: "0",
        maxWidth: 600,
        margin: "0 auto",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 0 24px #00121a1a"
      }}>
        {children}
      </Container>
    </Body>
  </Html>
);
