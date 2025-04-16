import VerifyEmail from "@/components/VerifyEmail";
import { ToastContainer } from 'react-toastify';


export default function ResetPage() {
  return (
    <div>
      <ToastContainer/>
      <VerifyEmail />
    </div>
  );
}