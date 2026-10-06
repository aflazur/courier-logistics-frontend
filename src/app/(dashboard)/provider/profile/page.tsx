import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CourierProfileForm } from '@/components/forms/courier-profile-form';

export default function ProviderProfilePage() {
  return (
    <div className="max-w-xl space-y-4">
      <div>
        <h2 className="font-display text-ink-900 text-lg font-semibold">Profile & availability</h2>
        <p className="text-ink-500 text-sm">Keep your vehicle details and availability current.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Courier details</CardTitle>
        </CardHeader>
        <CardContent>
          <CourierProfileForm />
        </CardContent>
      </Card>
    </div>
  );
}
