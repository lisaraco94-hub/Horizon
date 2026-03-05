import { UserProvider } from "@/lib/UserContext";
import HorizonApp from "@/components/HorizonApp";

export default function Home() {
  return (
    <UserProvider>
      <HorizonApp />
    </UserProvider>
  );
}
