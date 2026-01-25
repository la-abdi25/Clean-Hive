# Clean-Hive

<h2>Description</h2>
<p> A full-stack home cleaning services application that allows users to book professional cleaning services, communicate with cleaners in real time, and securely pay online. Built with a modern web stack focused on scalability, security, and performance. </p>

<h2> App Terminology </h2>
<ul>
  <li>Customers(Bees)</li>
  <li>Cleaning Agents(Nectars)</li>
</ul>

<h2>Features</h2>
<h3>Bee & Nectar Accounts via Registration</h3>
<ul>
  <li>Register as a Bee or Nectar</li>
  <li>Secure login and authentication using JWT and bcrypt</li>
  <li>Personalized profile pages for Bees and Nectars</li>
  <li>Nectars are able to update profile information (phone number, bio, cleaning plan, and availability)</li>
  <li>Bees are able to update profile information (phone number and address)</li>
</ul>

<h3>Browse Cleaning Agents</h3>
<ul>
  <li>View a list of available cleaning agents</li>
  <li>Select a cleaner directly from their profile</li>
  <li>Search for a cleaning agent by name</li>
</ul>

<h3>Book a Cleaning Service</h3>
<ul>
  <li>Book cleaning services through a guided checkout process</li>
  <li>Select service type, date and time, and cleaning service notes</li>
  <li>Booking confirmation only after successful Stripe payment</li>
  <li>Bookings are stored and managed in MongoDB</li>
</ul>

<h3>Bee Payment Flow</h3>
<ul>
  <li>Payments are collected using Stripe Elements: CardNumberElement, CardExpiryElement, and CardCvcElement</li>
  <li>Card details are tokenized by Stripe and don't touch the application server</li>
  <li>A PaymentIntent is created server-side and confirmed client-side</li>
  <li>Payment status is stored and associated with the booking in MongoDB</li>
</ul>

<h3>Nectar Payout Flow (Stripe Express)</h3>
<ul>
  <li>Nectars onboard via Stripe Express accounts</li>
  <li>Onboarding is handled using Stripe Account Links</li>
  <li>Nectars securely provide: Bank routing, account numbers, and identity verification details</li>
  <li>The platform does not store sensitive financial data</li>
</ul>

<h3>Booking Cancellations</h3>
<ul>
  <li>Cancellations can be initiated by: Bees and Nectars</li>
  <li>A 24-hour cancellation window is enforced: Bookings cannot be canceled within 24 hours of the scheduled service time using time-based validation</li>
  <li>A Stripe refund is issued directly to the customer if the funds have not yet been paid out to the Nectar</li>
  <li>A Stripe transfer reversal is performed if the funds have been paid out to the Nectar</li>
</ul>

<h3>Booking Statuses</h3>
<ul>
  <li>Pending – Booking created, awaiting confirmation from Nectar</li>
  <li>Upcoming – Payment confirmed and service scheduled</li>
  <li>Completed – Cleaning service successfully fulfilled</li>
  <li>Cancelled – Booking cancelled by customer or cleaning agent</li>
</ul>

<h3>Bee Payment View</h3>
<ul>
  <li>Total amount paid</li>
  <li>Booking reference number</li>
  <li>Payment status (in route, or cancelled)</li>
  <li>Card details (masked): Card brand, Last 4 digits, Expiration date</li>
  <li>Note: Sensitive card data such as full card numbers and CVC codes are never stored or exposed. All card information is securely handled and tokenized by Stripe.</li>
</ul>

<h3>Nectar Payment View</h3>
<ul>
  <li>Booking reference number</li>
  <li>Customer name</li>
  <li>Payout status (in route, or cancelled)</li>
  <li>Funds availability date (when payout becomes available)</li>
  <li>Transfer or reversal status (if applicable)</li>
</ul>


<h3>Real-Time Messaging</h3>
<ul>
  <li>In-app messaging between Bees and Nectars</li>
  <li>Built using Firebase Realtime Database / Firestore</li>
  <li>Messages are tied to individual bookings</li>
  <li>Enables real-time communication without page refresh</li>
</ul>

<h3>Reviews & Ratings</h3>
<ul>
  <li>Customers can leave reviews after completed services</li>
  <li>Top 4 Reviews are displayed on Nectar profiles</li>
  <li>Helps users make informed booking decisions</li>
</ul>


<h3>User Feedback & Notifications</h3>
<ul>
  <li>React Hot Toast used for: </li>
  <li>Booking confirmations</li>
  <li>Successful payments</li>
  <li>Profile updates</li>
  <li>Error handling and policy violations (e.g. late cancellations)</li>
  <li>Provides real-time, non-intrusive user feedback</li>
</ul>

<h3>File Storage (AWS)</h3>
<ul>
  <li>User-uploaded images (profile photos, service images) are stored in AWS S3 </li>
  <li>CloudFront CDN serves assets with low latency and caching</li>
  <li>Improves load times and scalability</li>
</ul>

<h3>Responsive UI</h3>



<h2>Tech Stack</h2>
<ul>
  <ul>
    <h4>Frontend:</h4>
    <li>Next.js</li>
    <li>React</li>
    <li>React Testing Library</li>
    <li>CSS</li>
  </ul>
   <ul>
    <h4>Backend:</h4>
    <li>Node.js / API Routes (Next.js)</li>
    <li>MongoDB</li>
  </ul>
  <ul>
    <h4>Authentication:</h4>
    <li>JWT (JSON Web Tokens)</li>
    <li>bcrypt for password hashing</li>
  </ul>
  <ul>
    <h4>Environment Variables:</h4>
    <li>dotenv</li>
  </ul>
  <ul>
    <h4>Testing</h4>
    <li>React Testing Library: Frontend testing of components, interactions, and user flows</li>
    <li>Jest: Backend unit and integration testing</li>
    <li>next-api-handler</li>
  </ul>
    <ul>
    <h4>Integrations</h4>
    <li>Stripe API – Secure payment processing</li>
    <li>Firebase API – Real-time chat and messaging</li>
    <li>AWS S3 – Image and file storage</li>
    <li>AWS CloudFront – CDN for fast global asset delivery</li>
  </ul>
</ul>
  
