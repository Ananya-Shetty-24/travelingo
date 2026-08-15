const { Resend } = require('resend')
const resend = new Resend(process.env.RESEND_API_KEY)

const sendBookingConfirmation = async (user, booking, flight) => {
    await resend.emails.send({
        from: 'Flight Booking <onboarding@resend.dev>',
        to: user.email,
        subject: `Booking Confirmed — ${flight.flightNumber}`,
        html: `
            <h1>Booking Confirmed! ✈️</h1>
            <p>Hi ${user.name},</p>
            <p>Your booking has been confirmed. Here are your details:</p>
            <table>
                <tr><td><b>Flight</b></td><td>${flight.flightNumber}</td></tr>
                <tr><td><b>Class</b></td><td>${booking.seats[0].class}</td></tr>
                <tr><td><b>Total Paid</b></td><td>£${(booking.totalAmount / 100).toFixed(2)}</td></tr>
                <tr><td><b>Status</b></td><td>Confirmed</td></tr>
            </table>
            <p>Thank you for booking with us!</p>
        `
    })
    console.log('Confirmation email sent to:', user.email)
}

const sendCancellationEmail = async (user, booking) => {
    await resend.emails.send({
        from: 'Flight Booking <onboarding@resend.dev>',
        to: user.email,
        subject: 'Booking Cancelled',
        html: `
            <h1>Booking Cancelled</h1>
            <p>Hi ${user.name},</p>
            <p>Your booking has been cancelled.</p>
            <p><b>Booking ID:</b> ${booking._id}</p>
            <p><b>Amount:</b> £${(booking.totalAmount / 100).toFixed(2)}</p>
            <p>If you did not request this cancellation, please contact us immediately.</p>
        `
    })
    console.log('Cancellation email sent to:', user.email)
}

module.exports = { sendBookingConfirmation, sendCancellationEmail }