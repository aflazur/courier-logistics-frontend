import { CreateShipmentWizard } from '@/components/forms/create-shipment-wizard';

export default function NewShipmentPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-ink-900 text-lg font-semibold">Book a new shipment</h2>
        <p className="text-ink-500 text-sm">A few quick steps to schedule your pickup.</p>
      </div>
      <CreateShipmentWizard />
    </div>
  );
}
