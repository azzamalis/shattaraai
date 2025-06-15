import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import NewsletterWelcomeEmail from "./_templates/NewsletterWelcomeEmail.tsx";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SubscriptionData {
  email: string;
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
    const { email }: SubscriptionData = await req.json();

    // Validate email
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Please enter a valid email address" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check if email already exists
    const { data: existingSubscriber, error: checkError } = await supabase
      .from("newsletter_subscribers")
      .select("email, status")
      .eq("email", email.toLowerCase())
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking existing subscriber:", checkError);
      throw new Error("Database error occurred");
    }

    if (existingSubscriber) {
      if (existingSubscriber.status === "active") {
        return new Response(
          JSON.stringify({ 
            error: "You're already subscribed to our newsletter!" 
          }),
          {
            status: 409,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      } else {
        // Reactivate unsubscribed user
        const { error: updateError } = await supabase
          .from("newsletter_subscribers")
          .update({ 
            status: "active", 
            subscribed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq("email", email.toLowerCase());

        if (updateError) {
          console.error("Error reactivating subscriber:", updateError);
          throw new Error("Failed to reactivate subscription");
        }
      }
    } else {
      // Insert new subscriber
      const { error: insertError } = await supabase
        .from("newsletter_subscribers")
        .insert([
          {
            email: email.toLowerCase(),
            status: "active"
          }
        ]);

      if (insertError) {
        console.error("Error inserting subscriber:", insertError);
        throw new Error("Failed to subscribe to newsletter");
      }
    }

    // Send welcome email using React Email template
    const html = await renderAsync(
      NewsletterWelcomeEmail({ toEmail: email })
    );

    const welcomeEmailResponse = await resend.emails.send({
      from: "ShattaraAI.com <noreply@updates.shattaraai.com>",
      to: [email],
      subject: "Welcome to ShattaraAI.com Newsletter!",
      html,
    });

    console.log("Welcome email sent:", welcomeEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Thank you for subscribing! Check your email for a welcome message." 
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
    console.error("Error in newsletter-subscribe function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to subscribe to newsletter. Please try again later.",
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
