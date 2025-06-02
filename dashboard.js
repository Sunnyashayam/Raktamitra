const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const hamburger = document.getElementById('hamburger');
const contentArea = document.getElementById('contentArea');

hamburger.addEventListener('click', () => {
  sidebar.classList.add('open');
  overlay.classList.add('show');
});

overlay.addEventListener('click', () => {
  closeSidebar();
});

function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('show');
}

function showAbout() {
  contentArea.innerHTML = `
    <h2>About Raktamitra</h2>
    <p>RaktaMitra is a life-saving initiative by Ashayam Foundation, born from the belief that no one should suffer or lose a loved one due to the unavailability of blood. With a mission to connect blood donors and recipients seamlessly, RaktaMitra acts as a digital bridge of hope during medical emergencies.Through this initiative, Ashayam Foundation aims to build a nationwide community of voluntary blood donors, enabling real-time access to eligible donors based on location and blood group**. Whether it’s a child in need of platelets, an accident victim requiring urgent transfusion, or a patient with a rare blood type, RaktaMitra ensures that help is just a tap away.RaktaMitra isn't just a directory—it's a movement of compassion and responsibility. The platform allows users to:Search for blood donors nearby without the need for login or registration
Register as a donor and contribute to the cause
Chat directly with available donors through the app (without sharing personal numbers)
 Access medical tips, schedule requests, and issue emergency alerts
 Recognize and honor Ashayam Volunteers with special badges for guaranteed donation support
With RaktaMitra, Ashayam Foundation envisions a future where blood donation becomes a common, celebrated act of humanity. Together, let’s save lives because a single drop of blood can write someone’s tomorrow.
</p>
  `;
  closeSidebar();
}

function showFAQs() {
  contentArea.innerHTML = `
    <h2>FAQs</h2>
    <p>1. What is RaktaMitra?

A. RaktaMitra is a life-saving initiative by Ashayam Foundation that connects voluntary blood donors with people in urgent need. It helps users find donors based on blood group and location, especially during emergencies.

2. Is RaktaMitra free to use?

A. Yes, RaktaMitra is completely free for both donors and recipients. The mission is to save lives, not to make profit.

3. Do I need to register to use the app?

A. No, you don’t need to register to search for blood donors. Anyone can search for donors instantly. However, if you wish to become a donor, you’ll need to register with basic details.

4. Is my phone number shared with others?

A. No. RaktaMitra uses an in-app chat system that allows recipients to message donors directly without revealing phone numbers. Your privacy is protected.

5. Who can register as a blood donor?

A. Anyone between the age of 18 and 60, weighing over 50 kg, and in good health can register as a blood donor. Donors should not have any major medical issues or infectious diseases.

6. What makes Ashayam volunteers special on RaktaMitra?

A. Ashayam-verified volunteers receive a special badge indicating they are trusted and guaranteed donors. This ensures faster and more reliable support during critical times.

7. Can I request blood for someone else?

A. Yes, you can request blood for a friend, family member, or even a stranger in need. Just enter their details, and the system will help you connect with nearby donors.

8. Is there an emergency alert system?

A. Yes, in extreme cases, users can trigger an emergency alert to notify nearby eligible donors for urgent help.

9. How often can I donate blood?

A. Men can usually donate every 3 months and women every 4 months, depending on their health. The app may remind you when you are eligible again.

10. How do I join as a volunteer with Ashayam Foundation?

A. You can visit ashayamfoundation.org and fill out the volunteer form or register through the app. Our team will guide you further.

11. Can RaktaMitra store blood?

No, RaktaMitra does not store blood. It is not a blood bank. Instead, RaktaMitra is a digital platform that helps you find nearby voluntary donors in real-time when there’s an emergency or need. Blood storage requires licensed medical infrastructure and strict government regulation, which is handled by official blood banks and hospitals.

RaktaMitra’s role is to bridge the gap between donors and those in need—because in most critical situations, what saves a life is a timely donation, not stored blood.</p>
  `;
  closeSidebar();
}

function showPrivacy() {
  contentArea.innerHTML = `
    <h2>Privacy Policy</h2>
    <p>RaktaMitra is a life-saving initiative by Ashayam Foundation that connects voluntary blood donors with recipients in need. We value your trust and are committed to protecting your privacy and personal data.

1. Information We Collect
We collect only the minimum information required to offer our services effectively and safely:

For Donors: Name, age, gender, blood group, city/location, contact details (email/phone – hidden from public), and availability.

For Recipients: Basic contact and request details (shared only with nearby potential donors).

App Usage: Anonymous data like search activity, device info, and feedback (for improvement purposes).

2. How We Use Your Information
To match blood donors with recipients based on blood group and location.

To notify volunteers of nearby requests (with your permission).

To improve user experience and ensure quick response.

To recognize and appreciate volunteers for their life-saving actions.

3. Data Protection & Security
Your phone number is never publicly displayed. All communication happens through secure in-app chat or managed contact systems.

Data is stored using secure, encrypted systems and access is strictly limited to authorized Ashayam Foundation personnel.

We do not sell, rent, or share your personal data with third-party advertisers or companies.

4. Your Consent
By using RaktaMitra, you consent to the collection and use of your information as described in this policy. You can update or delete your data anytime by contacting us.

5. Third-Party Links
We may include links to trusted health partners or hospitals. We are not responsible for their privacy practices. Please review their policies separately.

6. Children’s Privacy
RaktaMitra is not intended for use by children under the age of 13 without parental consent. We do not knowingly collect data from minors.

7. Changes to This Policy
We may update this Privacy Policy from time to time. All changes will be posted here, and significant updates will be communicated directly through the app or website.</p>
  `;
  closeSidebar();
}

function showContact() {
  contentArea.innerHTML = `
    <h2>Contact Us</h2>
    <p>You can reach us at <a href="mailto:raktamitra@ashayamfoundation.org">raktamitra@ashayamfoundation.org</a> or call +91-90108 94089.</p>
  `;
  closeSidebar();
}
