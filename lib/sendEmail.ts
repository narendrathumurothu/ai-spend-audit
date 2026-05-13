import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export async function sendConfirmationEmail(
    email: string,
    savings: number,
    shareUrl: string
): Promise<void> {
    try {
        await sgMail.send({
            to: email,
            from: "audit@credex.rocks",
            subject: savings > 0
                ? `Your AI Spend Audit — $${savings}/month in savings found`
                : "Your AI Spend Audit — You're spending well!",
            html: `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">

    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #16a34a; font-size: 28px; margin: 0;">🔍 AI Spend Audit</h1>
        <p style="color: #666; margin-top: 8px;">by Credex</p>
    </div>

    ${savings > 0 ? `
    <div style="background: #16a34a; color: white; border-radius: 16px; padding: 30px; text-align: center; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 16px; opacity: 0.9;">We found potential savings of</p>
        <p style="margin: 8px 0; font-size: 48px; font-weight: bold;">$${savings}/mo</p>
        <p style="margin: 0; font-size: 20px; opacity: 0.9;">That is $${savings * 12}/year!</p>
    </div>
    ` : `
    <div style="background: #2563eb; color: white; border-radius: 16px; padding: 30px; text-align: center; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 24px; font-weight: bold;">You are spending well!</p>
        <p style="margin: 8px 0; opacity: 0.9;">Your AI tool stack is already optimized.</p>
    </div>
    `}

    <p style="font-size: 16px; line-height: 1.6;">
        Your full audit report is ready. View and share your results:
    </p>

    <div style="text-align: center; margin: 30px 0;">
        <a href="${shareUrl}"
           style="background: #16a34a; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px;">
            View My Full Report
        </a>
    </div>

    ${savings > 500 ? `
    <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 12px; padding: 20px; margin-top: 24px;">
        <h3 style="color: #15803d; margin-top: 0;">Save Even More with Credex</h3>
        <p style="color: #166534; margin: 0;">
            With $${savings}/month in identified savings, you are a strong candidate for Credex AI credits.
            Credex sources discounted AI credits from companies that overforecast usage.
            Our team will be in touch shortly.
        </p>
    </div>
    ` : ""}

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />

    <p style="color: #9ca3af; font-size: 13px; text-align: center;">
        Credex · credex.rocks · AI infrastructure credits
    </p>

</body>
</html>
            `,
        });
    } catch (error) {
        console.error("SendGrid email error:", error);

    }
}