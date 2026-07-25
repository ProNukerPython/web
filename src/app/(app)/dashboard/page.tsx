import { Package, Target, Wallet } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import {
  collectionProgressPercent,
  formatCentsEs,
} from "@/domain/calculations";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user!.id;

  const [totalEditions, ownedGroups, purchases, wishlist] = await Promise.all([
    prisma.gameEdition.count(),
    prisma.ownedCopy.groupBy({
      by: ["gameEditionId"],
      where: { userId },
    }),
    prisma.purchase.findMany({
      where: { userId },
      orderBy: { purchasedAt: "desc" },
      take: 5,
      include: { gameEdition: { include: { game: true } } },
    }),
    prisma.wishlistEntry.findMany({
      where: { userId },
      orderBy: { priority: "desc" },
      take: 5,
      include: { gameEdition: { include: { game: true } } },
    }),
  ]);

  const ownedCount = ownedGroups.length;
  const pendingCount = Math.max(totalEditions - ownedCount, 0);
  const progress = collectionProgressPercent(ownedCount, totalEditions);
  const investedCents = purchases.reduce((sum, p) => sum + p.totalCents, 0);

  const primaryCopies = await prisma.ownedCopy.findMany({
    where: { userId, isPrimary: true },
    include: { gameEdition: true },
  });
  const estimatedCents = primaryCopies.reduce((sum, copy) => {
    const ref = copy.gameEdition.referencePriceCents ?? 0;
    return sum + Math.round((ref * copy.completenessPercent) / 100);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight sm:text-3xl">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Resumen de tu colección. Los precios del seed son orientativos.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Completado"
          value={`${progress}%`}
          hint={`${ownedCount} de ${totalEditions}`}
          icon={<Target className="size-4" />}
        />
        <StatCard
          label="Conseguidos"
          value={String(ownedCount)}
          hint={`${pendingCount} pendientes`}
          icon={<Package className="size-4" />}
        />
        <StatCard
          label="Invertido"
          value={formatCentsEs(investedCents)}
          hint="Compras registradas"
          icon={<Wallet className="size-4" />}
        />
        <StatCard
          label="Valor estimado"
          value={formatCentsEs(estimatedCents)}
          hint="Orientativo"
          icon={<Wallet className="size-4" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/80 shadow-[var(--shadow-sm)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Últimas compras</CardTitle>
            <CardDescription>Historial reciente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {purchases.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aún no hay compras registradas.
              </p>
            ) : (
              purchases.map((purchase) => (
                <div
                  key={purchase.id}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {purchase.gameEdition.game.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {purchase.purchasedAt.toLocaleDateString("es-ES")}
                    </p>
                  </div>
                  <span className="shrink-0 tabular-nums">
                    {formatCentsEs(purchase.totalCents)}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-[var(--shadow-sm)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Wishlist prioritaria</CardTitle>
            <CardDescription>Lo que más te interesa ahora</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {wishlist.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Tu wishlist está vacía.
              </p>
            ) : (
              wishlist.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <p className="truncate font-medium">
                    {entry.gameEdition.game.name}
                  </p>
                  <Badge variant="secondary" className="shrink-0">
                    {entry.priority}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="border-border/80 shadow-[var(--shadow-sm)]">
      <CardContent className="pt-4 space-y-2">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs uppercase tracking-wide">{label}</span>
          {icon}
        </div>
        <p className="font-[family-name:var(--font-display)] text-xl font-semibold tabular-nums sm:text-2xl">
          {value}
        </p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}
