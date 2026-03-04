using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace NutriTrack.Services
{
    public class EmailSettings
    {
        public string Host { get; set; } = string.Empty;
        public int Port { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FromAddress { get; set; } = string.Empty;
        public string FromName { get; set; } = string.Empty;
        public string AppBaseUrl { get; set; } = string.Empty;
    }

    public class EmailService
    {
        private readonly EmailSettings _settings;

        public EmailService(EmailSettings settings)
        {
            _settings = settings;
        }

        public async Task SendVerificationEmailAsync(string toEmail, string username, string token)
        {
            var verifyUrl = $"{_settings.AppBaseUrl}/api/Registry/verify-email?token={token}";

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(_settings.FromName, _settings.FromAddress));
            message.To.Add(new MailboxAddress(username, toEmail));
            message.Subject = "NutriTrack - Email-cim megerositese";

            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = $"""
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2C3E50;">NutriTrack - Email megerositese</h2>
                        <p>Szia <strong>{username}</strong>!</p>
                        <p>Koszonjuk a regisztraciot! A fioked aktivalasakert kattints az alabbi gombra:</p>
                        <a href="{verifyUrl}"
                           style="display: inline-block; padding: 12px 24px; background-color: #3498DB;
                                  color: white; text-decoration: none; border-radius: 6px;
                                  font-size: 16px; margin: 20px 0;">
                           Email megerositese
                        </a>
                        <p style="color: #7F8C8D; font-size: 13px;">
                            Ez a link 24 oraig ervenyes.<br/>
                            Ha nem te regisztraltal, hagyd figyelmen kivul ezt az emailt.
                        </p>
                    </div>
                    """
            };

            message.Body = bodyBuilder.ToMessageBody();

            using var client = new SmtpClient();
            await client.ConnectAsync(_settings.Host, _settings.Port, SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(_settings.Username, _settings.Password);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
    }
}
