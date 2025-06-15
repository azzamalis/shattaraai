import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import ContactNotificationEmail from "./_templates/ContactNotificationEmail.tsx";
import ContactConfirmationEmail from "./_templates/ContactConfirmationEmail.tsx";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  try {
    const { name, email, subject, message }: ContactFormData = await req.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Send notification email to business using React Email template
    const businessHtml = await renderAsync(
      ContactNotificationEmail({ name, email, subject, message })
    );
    const businessEmailResponse = await resend.emails.send({
      from: "Contact Form <noreply@updates.shattaraai.com>",
      to: ["hello@shattaraai.com"],
      subject: `New Contact Form Submission: ${subject}`,
      html: businessHtml,
    });

    // Send confirmation email to user using React Email template
    const userHtml = await renderAsync(
      ContactConfirmationEmail({ name, subject, message })
    );
    const userEmailResponse = await resend.emails.send({
      from: "ShattaraAI.com <noreply@updates.shattaraai.com>",
      to: [email],
      subject: "Thank you for contacting ShattaraAI.com",
      html: userHtml,
    });

    console.log("Business email sent:", businessEmailResponse);
    console.log("User confirmation email sent:", userEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Message sent successfully! We'll get back to you soon." 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to send message. Please try again later.",
        details: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
