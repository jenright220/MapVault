import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';
import HomeContent from '@/components/HomeContent';

export default async function Home() {
  const [maps, isAdmin] = await Promise.all([
    prisma.map.findMany({
      include: {
        category: true,
        condition: true,
      },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ]
    }),
    isAuthenticated()
  ]);

  return <HomeContent initialMaps={maps} isAdmin={isAdmin} />;
}