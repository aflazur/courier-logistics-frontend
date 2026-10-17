export interface Faq {
  q: string;
  a: string;
}

// Every answer here describes behaviour the platform actually implements.
export const FAQS: Faq[] = [
  {
    q: 'How is the delivery fee calculated?',
    a: 'Every fee is a ৳60 base plus ৳25 per kilogram. The total is shown before you pay, so a 2.5 kg parcel costs ৳122.50.',
  },
  {
    q: 'When is my pickup scheduled?',
    a: 'Right after your payment is confirmed. You book the shipment, pay through the secure SSLCommerz checkout, and the status moves from Pending to Pickup scheduled automatically.',
  },
  {
    q: 'Can I cancel a shipment?',
    a: 'Yes, until the parcel reaches the origin hub. A shipment can be cancelled while it is Pending, Pickup scheduled or Picked up. After that it is in the hub network and can no longer be cancelled.',
  },
  {
    q: 'What do the shipment statuses mean?',
    a: 'A parcel moves through Pending, Pickup scheduled, Picked up, At origin hub, In transit, At destination hub and Out for delivery, ending in Delivered. If a delivery attempt fails it is retried or returned, and every change is logged with a timestamp.',
  },
  {
    q: 'Who can see my shipments and payments?',
    a: 'Only you. Customers see their own shipments and payments, couriers see only the parcels assigned to them, and admins manage the whole operation.',
  },
  {
    q: 'Is my payment information safe?',
    a: 'Card details are entered on the SSLCommerz checkout, never on this site. Each payment is verified server-side before a shipment is marked as paid.',
  },
  {
    q: 'I am a courier. How do I get deliveries?',
    a: 'Register, complete your courier profile with your vehicle and availability, and an admin can assign shipments to you. You update each step from your deliveries page and track your earnings.',
  },
];
