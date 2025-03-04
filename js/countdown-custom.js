$(function () {
    // Set the target date and time in IST (India Standard Time) as 9:00 AM on April 21, 2025
    var targetDateIST = new Date(2025, 2, 21, 9, 0);  // This is 9:00 AM IST
    
    // Convert the IST time to UTC by subtracting 5 hours 30 minutes (IST is UTC +5:30)
    var targetDateUTC = new Date(targetDateIST.getTime() - (5.5 * 60 * 60 * 1000)); // Convert to UTC
    
    // Initialize the countdown with the target UTC date
    $('#defaultCountdown').countdown({
        until: targetDateUTC // Countdown target in UTC
    });
});
