package com.citizenconnect.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@citizenconnect.com}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendWelcomeEmail(String to, String name) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("Welcome to CitizenConnect!");
            message.setText("Hello " + name + ",\n\nWelcome to CitizenConnect!\n\nBest regards,\nCitizenConnect Team");
            mailSender.send(message);
            log.info("Welcome email sent to {}", to);
        } catch (Exception e) {
            log.error("Failed to send welcome email: {}", e.getMessage());
        }
    }

    @Async
    public void sendIssueAssignmentNotification(String to, String issueTitle) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("New Issue Assigned: " + issueTitle);
            message.setText("A new issue has been assigned to you: " + issueTitle);
            mailSender.send(message);
            log.info("Issue assignment notification sent to {}", to);
        } catch (Exception e) {
            log.error("Failed to send issue assignment notification: {}", e.getMessage());
        }
    }

    @Async
    public void sendIssueResponseNotification(String to, String issueTitle, String response) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("Response to Your Issue: " + issueTitle);
            message.setText("Your issue has received a response:\n\n" + response);
            mailSender.send(message);
            log.info("Issue response notification sent to {}", to);
        } catch (Exception e) {
            log.error("Failed to send issue response notification: {}", e.getMessage());
        }
    }
}
