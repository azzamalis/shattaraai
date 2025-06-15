import * as React from "npm:react@18.3.1";
import { Section, Img } from "npm:@react-email/components@0.0.22";

export const EmailHeader = () => (
  <Section style={{
    background: "#4B4B4B",
    textAlign: "center",
    padding: "36px 0 20px"
  }}>
    <Img
      src="https://shattaraai.com/lovable-uploads/88dfb89e-dd52-48e1-bad9-3bcf54fae494.png"
      width={60}
      height={60}
      alt="ShattaraAI Logo"
      style={{ margin: "0 auto", borderRadius: "50%" }}
    />
    <h1 style={{
      margin: 0,
      marginTop: 12,
      fontWeight: 700,
      color: "#00A3FF",
      fontSize: 28,
      letterSpacing: ".1em"
    }}>
      ShattaraAI.com
    </h1>
  </Section>
);
