import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ApplicationNotificationRequest {
  name: string;
  email: string;
  phone: string;
  position: string;
  experience?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  cover_letter?: string;
  adminEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      name, 
      email, 
      phone, 
      position,
      experience,
      linkedin_url,
      portfolio_url,
      cover_letter,
      adminEmail 
    }: ApplicationNotificationRequest = await req.json();

    console.log("Sending application notification for:", { name, email, position, adminEmail });

    // Send notification to admin/HR
    const adminEmailResponse = await resend.emails.send({
      from: "Career <onboarding@resend.dev>",
      to: [adminEmail],
      subject: `New Job Application: ${name} for ${position}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; border-bottom: 2px solid #4f46e5; padding-bottom: 10px;">New Job Application</h1>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #4f46e5; margin-top: 0;">Applicant Details</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Position:</strong> ${position}</p>
            ${experience ? `<p><strong>Experience:</strong> ${experience}</p>` : ""}
            ${linkedin_url ? `<p><strong>LinkedIn:</strong> <a href="${linkedin_url}">${linkedin_url}</a></p>` : ""}
            ${portfolio_url ? `<p><strong>Portfolio:</strong> <a href="${portfolio_url}">${portfolio_url}</a></p>` : ""}
          </div>
          
          ${cover_letter ? `
          <div style="background: #fff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h2 style="color: #333; margin-top: 0;">Cover Letter</h2>
            <p style="white-space: pre-wrap; color: #555;">${cover_letter}</p>
          </div>
          ` : ""}
          
          <p style="color: #888; font-size: 12px; margin-top: 30px;">
            This notification was sent automatically when a new job application was submitted.
            Please check the admin dashboard for the resume and more details.
          </p>
        </div>
      `,
    });

    console.log("Admin notification sent:", adminEmailResponse);

    // Send confirmation to the applicant
    const applicantEmailResponse = await resend.emails.send({
      from: "Career <team@canvascartel.in>",
      to: [email],
      subject: "Application Received - Thank You!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f5;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td align="center" style="padding: 40px 40px 20px; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); border-radius: 16px 16px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 28px; font-weight: 700;">
                        Thank You, ${name}!
                      </h1>
                      <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.9); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 16px;">
                        Your Application Has Been Received
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Main Content -->
                  <tr>
                    <td align="center" style="padding: 40px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          <td align="center">
                            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); border-radius: 50%; margin-bottom: 24px; display: inline-block;">
                              <span style="font-size: 40px; line-height: 80px; color: #ffffff;">✓</span>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="padding-bottom: 24px;">
                            <p style="margin: 0; color: #374151; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 18px; line-height: 1.6; text-align: center;">
                              We've received your application for the <strong style="color: #4f46e5;">${position}</strong> position.
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="padding-bottom: 32px;">
                            <p style="margin: 0; color: #6b7280; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 16px; line-height: 1.6; text-align: center;">
                              Our HR team will review your application and get back to you within <strong style="color: #4f46e5;">3-5 business days</strong>.
                            </p>
                          </td>
                        </tr>
                        
                        <!-- What's Next Box -->
                        <tr>
                          <td align="center">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
                              <tr>
                                <td style="padding: 24px;">
                                  <h3 style="margin: 0 0 16px; color: #1f2937; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 16px; font-weight: 600; text-align: center;">
                                    What's Next?
                                  </h3>
                                  <ul style="margin: 0; padding: 0 0 0 20px; color: #6b7280; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; line-height: 1.8;">
                                    <li>Our team will review your application</li>
                                    <li>If shortlisted, we'll reach out for an interview</li>
                                    <li>You'll receive updates via email</li>
                                  </ul>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td align="center" style="padding: 24px 40px 40px; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0 0 8px; color: #6b7280; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; text-align: center;">
                        Have questions? Feel free to reply to this email.
                      </p>
                      <p style="margin: 0; color: #9ca3af; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; text-align: center;">
                        Best regards,<br>The HR Team
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    console.log("Applicant confirmation sent:", applicantEmailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        adminEmail: adminEmailResponse,
        applicantEmail: applicantEmailResponse,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  } catch (error: unknown) {
    console.error("Error in send-application-notification function:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
