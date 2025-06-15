
import * as React from "npm:react@18.3.1";
import { Section, Text, Hr, List, Item } from "npm:@react-email/components@0.0.22";
import { EmailLayout } from "./EmailLayout.tsx";
import { EmailHeader, BRAND_NAME } from "./EmailHeader.tsx";
import { EmailFooter } from "./EmailFooter.tsx";

interface ContactConfirmationEmailProps {
  name: string;
  subject: string;
  message: string;
}

export const ContactConfirmationEmail = ({
  name,
  subject,
  message
}: ContactConfirmationEmailProps) => (
  <EmailLayout>
    <EmailHeader />
    <Section style={{ background: "#222", padding: "36px 32px" }}>
      <Text style={{ color: "#fff", fontSize: 24, fontWeight: 600, marginBottom: 18 }}>Thank you for contacting us!</Text>
      <Text style={{ color: "#A6A6A6", fontSize: 18, marginBottom: 12 }}>
        Dear {name},
      </Text>
      <Text style={{ color: "#A6A6A6", fontSize: 17 }}>
        We’ve received your message and will get back to you as soon as possible (usually within 24-48 hours).
      </Text>
      <Hr style={{border: "none", borderTop: "1px solid #444", margin: "28px 0"}} />
      <Text style={{ color: "#DFDFDF", fontSize: 17, marginBottom: 6 }}>Your Message</Text>
      <List style={{ color: "#DFDFDF", fontSize: 14, marginLeft: 20 }}>
        <Item><strong>Subject:</strong> {subject}</Item>
        <Item><strong>Message:</strong> {message}</Item>
      </List>
      <Text style={{ color: "#A6A6A6", fontSize: 15, marginTop: 24 }}>
        For urgent questions, you can also email <a href="mailto:hello@shattaraai.com" style={{ color: "#00A3FF" }}>hello@shattaraai.com</a> or call +966 53 481 4860.
      </Text>
      <Text style={{ color: "#A6A6A6", fontSize: 15, marginTop: 14 }}>
        The {BRAND_NAME} Team
      </Text>
    </Section>
    <EmailFooter />
  </EmailLayout>
);

export default ContactConfirmationEmail;
