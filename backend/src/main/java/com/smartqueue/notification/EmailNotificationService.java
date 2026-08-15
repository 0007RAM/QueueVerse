package com.smartqueue.notification;

import com.smartqueue.entity.Token;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Sends email notifications to users about their token's lifecycle events.
 * When smartqueue.mail.enabled=false, notifications are only logged instead of
 * being sent, which is convenient for local development without SMTP credentials.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EmailNotificationService {

    private final JavaMailSender mailSender;

    @Value("${smartqueue.mail.enabled:false}")
    private boolean mailEnabled;

    @Value("${smartqueue.mail.from:noreply@smartqueue.com}")
    private String fromAddress;

    public void notifyTokenCalled(Token token) {
        String subject = "Your turn has arrived - " + token.getTokenNumber();
        String body = String.format(
                "Hi %s,%n%nYour token %s for queue \"%s\" has been called. " +
                "Please confirm your presence within 2 minutes or your token will expire.%n%nSmartQueue",
                token.getUser().getName(), token.getTokenNumber(), token.getQueue().getName());
        send(token.getUser().getEmail(), subject, body);
    }

    public void notifyTokenExpired(Token token) {
        String subject = "Token expired - " + token.getTokenNumber();
        String body = String.format(
                "Hi %s,%n%nYour token %s for queue \"%s\" has expired because it was not confirmed in time.%n%nSmartQueue",
                token.getUser().getName(), token.getTokenNumber(), token.getQueue().getName());
        send(token.getUser().getEmail(), subject, body);
    }

    public void notifyQueueCompleted(Token token) {
        String subject = "Service completed - " + token.getTokenNumber();
        String body = String.format(
                "Hi %s,%n%nYour service for token %s in queue \"%s\" has been completed. Thank you for using SmartQueue!%n%nSmartQueue",
                token.getUser().getName(), token.getTokenNumber(), token.getQueue().getName());
        send(token.getUser().getEmail(), subject, body);
    }

    private void send(String to, String subject, String body) {
        if (!mailEnabled) {
            log.info("[MAIL DISABLED] To: {} | Subject: {} | Body: {}", to, subject, body);
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception ex) {
            log.error("Failed to send email to {}: {}", to, ex.getMessage());
        }
    }
}
