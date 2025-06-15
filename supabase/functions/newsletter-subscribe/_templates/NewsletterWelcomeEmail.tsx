
import * as React from "npm:react@18.3.1";
import { Section, Text, Hr, List, Item } from "npm:@react-email/components@0.0.22";
import { EmailLayout } from "./EmailLayout.tsx";
import { EmailHeader, BRAND_NAME } from "./EmailHeader.tsx";
import { EmailFooter } from "./EmailFooter.tsx";
import { EmailButton } from "./EmailButton.tsx";

interface NewsletterWelcomeEmailProps {
  toEmail: string;
}

export const NewsletterWelcomeEmail = ({ toEmail }: NewsletterWelcomeEmailProps) => (
  <EmailLayout>
    <EmailHeader />
    <Section style={{ background: "#222", padding: "36px 32px" }}>
      <Text style={{ color: "#fff", fontSize: 24, fontWeight: 600, marginBottom: 18 }}>Welcome to our Newsletter!</Text>
      <Text style={{ color: "#A6A6A6", fontSize: 18, marginBottom: 15 }}>
        Thanks for subscribing to {BRAND_NAME}, {toEmail}.<br/>We're excited to have you!
      </Text>
      <Hr style={{border: "none", borderTop: "1px solid #444", margin: "24px 0"}} />
      <Text style={{ color: "#A6A6A6", fontSize: 18 }}>Here’s what you’ll receive:</Text>
      <List style={{ color: "#DFDFDF", fontSize: 16, marginLeft: 28, marginBottom: 20 }}>
        <Item>New AI-powered educational features</Item>
        <Item>Learning tips & best practices</Item>
        <Item>Platform updates and improvements</Item>
        <Item>Educational resources and content</Item>
      </List>
      <EmailButton href="https://shattaraai.com/signup">Create Your Free Account</EmailButton>
      <Text style={{ color: "#A6A6A6", fontSize: 16, marginTop: 30 }}>
        Thanks for choosing us for your learning journey!
      </Text>
      <Text style={{ color: "#A6A6A6", fontSize: 15, marginTop: 18 }}>
        Best regards,<br />
        The {BRAND_NAME} Team
      </Text>
    </Section>
    <EmailFooter showUnsubscribe />
  </EmailLayout>
);

export default NewsletterWelcomeEmail;
