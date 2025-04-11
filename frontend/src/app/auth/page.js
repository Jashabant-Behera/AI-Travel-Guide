import AuthForm from "@/components/AuthForm";
import { ToastContainer } from 'react-toastify';

export default function AuthPage() {
  return (
    <div>
      <ToastContainer/>
      <AuthForm />
    </div>
  );
}
