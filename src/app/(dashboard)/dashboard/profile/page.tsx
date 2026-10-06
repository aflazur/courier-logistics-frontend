import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ProfileForm } from '@/components/forms/profile-form';

export default function CustomerProfilePage() {
  return (
    <div className="max-w-xl space-y-4">
      <div>
        <h2 className="font-display text-ink-900 text-lg font-semibold">Profile & settings</h2>
        <p className="text-ink-500 text-sm">Update your account details.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Your details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm />
        </CardContent>
      </Card>
    </div>
  );
}
