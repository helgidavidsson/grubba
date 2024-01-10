require('dotenv').config();
const nodemailer = require('nodemailer');
const cron = require('node-cron');

let scheduledTasks = new Map(); // To keep track of scheduled tasks

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

function formatEventDate(dateString) {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('is-IS', options);
}

function sendEmail(participant, event, adminName,  groupName, groupLink, template) {
    const formattedEventDate = formatEventDate(event.eventDate);
    const personalizedTemplate = template
        .replace(/{memberName}/g, participant.name)
        .replace(/{adminName}/g, adminName)
        .replace(/{eventName}/g, event.eventName)
        .replace(/{eventDate}/g, formattedEventDate)
        .replace(/{eventTime}/g, event.eventTime)
        .replace(/{eventLocation}/g, event.eventLocation)
        .replace(/{groupName}/g, groupName)
        .replace(/{groupLink}/g, groupLink);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: participant.email,
        subject: `Boð í ${event.eventName}`,
        html: personalizedTemplate
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log('Error sending email: ' + error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}


function scheduleEmails(participants, event, template, notificationTime, adminName, groupName, groupLink) {
    // Convert notification time to milliseconds
    function convertToMilliseconds(time) {
        const units = {
            m: 60 * 1000,
            h: 60 * 60 * 1000,
            d: 24 * 60 * 60 * 1000,
            w: 7 * 24 * 60 * 60 * 1000,
        };
        const unit = time.slice(-1);
        const value = parseInt(time.slice(0, -1), 10);
        return value * (units[unit] || 0);
    }

    const eventStartString = `${event.eventDate} ${event.eventTime}`;
    console.log('Event Start String:', eventStartString);

    const eventStartTime = new Date(eventStartString);
    console.log('Event Start Time:', eventStartTime);

    if (isNaN(eventStartTime.getTime())) {
        console.error('Invalid event start time');
        return;
    }

    // Calculate the schedule time based on the notification time
    const notificationTimeInMilliseconds = convertToMilliseconds(notificationTime);
    const scheduleTime = new Date(eventStartTime.getTime() - notificationTimeInMilliseconds);
    console.log('Scheduled Time:', scheduleTime);

    if (isNaN(scheduleTime.getTime())) {
        console.error('Invalid scheduled time');
        return;
    }

    const cronTime = `${scheduleTime.getMinutes()} ${scheduleTime.getHours()} ${scheduleTime.getDate()} ${scheduleTime.getMonth() + 1} *`;
    console.log('Cron Time:', cronTime);

    return cron.schedule(cronTime, () => {
        participants.forEach(participant => {
            // Include the additional parameters in the sendEmail function call
            sendEmail(participant, event, adminName, groupName, groupLink, template);
        });
    });
}


function scheduleAllEmails(events, participants, emailTemplate, globalNotificationTime, adminName, groupName, groupLink) {
    scheduledTasks.forEach((task, eventId) => {
        task.stop(); // Stop the existing cron job
        scheduledTasks.delete(eventId); // Remove it from the map
    });

    events.forEach(event => {
        const emailParticipants = participants.filter(p => p.isCheckedEmail);
        // Now pass the additional parameters to scheduleEmails
        const task = scheduleEmails(emailParticipants, event, emailTemplate, globalNotificationTime, adminName, groupName, groupLink);
        scheduledTasks.set(event.id, task); // Store the new task
    });
}


function cancelScheduledEmail(eventId) {
    console.log("Current scheduled tasks:", scheduledTasks);
    console.log("Looking for task with event ID:", eventId);

    const task = scheduledTasks.get(eventId);
    if (task) {
        task.stop(); // Stop the task
        scheduledTasks.delete(eventId); // Remove it from the map
        console.log(`Scheduled email for event ${eventId} cancelled.`);
    } else {
        console.log(`No scheduled task found for event ${eventId}.`);
    }
}

module.exports = { sendEmail, scheduleEmails, scheduleAllEmails, cancelScheduledEmail };
