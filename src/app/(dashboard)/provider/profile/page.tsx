import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ProfileForm } from '@/components/forms/profile-form';
import { CourierProfileForm } from '@/components/forms/courier-profile-form';

export const metadata: Metadata = { title: 'Profile & availability' };

export default function ProviderProfilePage() {
  return (
    <div className="max-w-xl space-y-4">
      <div>
        <h2 className="font-display text-ink-900 text-lg font-semibold">Profile & availability</h2>
        <p className="text-ink-500 text-sm">
          Keep your contact details, vehicle and availability current.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Personal details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm />
        </CardContent>
      </Card>
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
