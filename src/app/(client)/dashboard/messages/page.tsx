import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageChat } from "@/components/messages/message-chat";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const messages = await prisma.message.findMany({
    where: {
      OR: [{ senderId: user.id }, { receiverId: user.id }],
    },
    include: { sender: true, receiver: true },
    orderBy: { createdAt: "asc" },
    take: 100,
  });

  // Find the physio (admin)
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });

  return (
    <div className="p-8 h-[calc(100vh-2rem)]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Mesaje</h1>
        <p className="text-muted-foreground">
          Discută cu fizioterapeutul tău
        </p>
      </div>

      <MessageChat
        currentUserId={user.id}
        otherUserId={admin?.id ?? ""}
        otherUserName={admin?.name ?? "Fizioterapeut"}
        initialMessages={messages.map((m) => ({
          id: m.id,
          content: m.content,
          senderId: m.senderId,
          senderName: m.sender.name,
          createdAt: m.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
