"use client";

import Link from 'next/link';
import { Edit3 } from 'lucide-react';

interface EditMapButtonProps {
  mapId: number;
}

export default function EditMapButton({ mapId }: EditMapButtonProps) {
  return (
    <Link
      href={`/admin/edit/${mapId}`}
      className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium transition-colors"
    >
      <Edit3 size={16} />
      <span>Edit Map</span>
    </Link>
  );
}