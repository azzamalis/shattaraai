import * as React from "npm:react@18.3.1";
import { Section, Text, Link } from "npm:@react-email/components@0.0.22";

export const EmailFooter = ({ children, showUnsubscribe = false }: { children?: React.ReactNode, showUnsubscribe?: boolean }) => (
  <Section style={{ background: "#222", textAlign: "center", padding: "28px 20px 16px", borderTop: "2px solid #333" }}>
    {children}
    {showUnsubscribe && (
      <Text style={{ color: "#A6A6A6", fontSize: 13, margin: "14px 0 0" }}>
        You can unsubscribe anytime by contacting <Link href="mailto:hello@shattaraai.com" style={{ color: "#00A3FF" }}>hello@shattaraai.com</Link>
      </Text>
    )}
    <Text style={{
      color: "#A6A6A6",
      fontSize: 12,
      margin: "18px 0 0"
    }}>
      © {new Date().getFullYear()} ShattaraAI.com &mdash; Transforming Education with AI
    </Text>
  </Section>
);
