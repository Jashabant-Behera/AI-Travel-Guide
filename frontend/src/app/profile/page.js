import VerifyEmail from "@/components/VerifyEmail";
import ResetPassword from "@/components/ResetPassword";
import SavedLocations from "@/components/SavedLocations";

export default function ProfilePage() {
  return (
    <div>
      <h2 className="text-3xl font-semibold mb-4">Your Profile</h2>
      <VerifyEmail />
      <ResetPassword />
      <SavedLocations />
    </div>
  );
}
