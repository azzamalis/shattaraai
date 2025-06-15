
import * as React from "npm:react@18.3.1";
import { Section, Text, Link } from "npm:@react-email/components@0.0.22";
import { BRAND_NAME, PRIMARY_COLOR } from "./EmailHeader.tsx";

export const BRAND_SLOGAN = "Transforming Education with AI";

export const EmailFooter = ({
  children,
  showUnsubscribe = false,
  brandSlogan = BRAND_SLOGAN,
  contactEmail = "hello@shattaraai.com"
}: {
  children?: React.ReactNode,
  showUnsubscribe?: boolean,
  brandSlogan?: string,
  contactEmail?: string
}) => (
  <Section style={{ background: "#222", textAlign: "center", padding: "28px 20px 16px", borderTop: "2px solid #333" }}>
    {children}
    {showUnsubscribe && (
      <Text style={{ color: "#A6A6A6", fontSize: 13, margin: "14px 0 0" }}>
        You can unsubscribe anytime by contacting <Link href={`mailto:${contactEmail}`} style={{ color: PRIMARY_COLOR }}>{contactEmail}</Link>
      </Text>
    )}
    <Text style={{
      color: "#A6A6A6",
      fontSize: 12,
      margin: "18px 0 0"
    }}>
      © {new Date().getFullYear()} {BRAND_NAME} &mdash; {brandSlogan}
    </Text>
  </Section>
);
