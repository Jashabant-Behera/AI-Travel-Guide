import ChatBot from "@/components/ChatBot";
import Recommendations from "@/components/Recommendations";

export default function AIPage() {
  return (
    <div>
      <h2 className="text-3xl font-semibold mb-4">AI Assistant 🤖</h2>
      <ChatBot />
      <Recommendations />
    </div>
  );
}
