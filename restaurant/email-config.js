/* ============================================================
   EmailJS-Konfiguration – Bestell-Benachrichtigung per Mail
   an info@dis-restaurant.de.

   Einrichtung (einmalig, ca. 5 Min):
   1. Kostenloses Konto: https://www.emailjs.com
   2. "Email Services" → Dienst hinzufügen (z. B. Gmail oder
      eigener SMTP) → notiere die Service ID
   3. "Email Templates" → Vorlage anlegen (Empfänger =
      info@dis-restaurant.de) → notiere die Template ID
   4. "Account" → General → notiere den Public Key
   5. Die drei Werte hier unten eintragen.

   Solange die Werte leer sind, wird keine Mail verschickt –
   die Bestellung wird trotzdem ganz normal erfasst.
   ============================================================ */

window.DIS_EMAIL = {
  publicKey: 'tMMTRNxgCwo8nMOUgsWAz',
  serviceId: 'service_xbyq9ih',
  templateId: 'template_suwr2ug',
  to: 'info@dis-restaurant.de',
};
