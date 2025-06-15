
import * as React from "npm:react@18.3.1";
import { Section, Text, Hr, List, Item } from "npm:@react-email/components@0.0.22";
import { EmailLayout } from "./EmailLayout.tsx";
import { EmailHeader } from "./EmailHeader.tsx";
import { EmailFooter } from "./EmailFooter.tsx";

interface ContactNotificationEmailProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const ContactNotificationEmail = ({
  name,
  email,
  subject,
  message
}: ContactNotificationEmailProps) => (
  <EmailLayout>
    <EmailHeader />
    <Section style={{ background: "#222", padding: "36px 32px" }}>
      <Text style={{ color: "#fff", fontSize: 21, fontWeight: 600, marginBottom: 16 }}>
        New Contact Form Submission
      </Text>
      <List style={{ color: "#DFDFDF", fontSize: 16, marginLeft: 24, marginBottom: 12 }}>
        <Item><strong>Name:</strong> {name}</Item>
        <Item><strong>Email:</strong> {email}</Item>
        <Item><strong>Subject:</strong> {subject}</Item>
      </List>
      <Hr style={{border: "none", borderTop: "1px solid #444", margin: "18px 0"}} />
      <Text style={{ color: "#A6A6A6", fontSize: 16, marginBottom: 8 }}>Message:</Text>
      <Text style={{ color: "#DFDFDF", fontSize: 16, whiteSpace: "pre-wrap" }}>{message}</Text>
    </Section>
    <EmailFooter />
  </EmailLayout>
);

export default ContactNotificationEmail;
