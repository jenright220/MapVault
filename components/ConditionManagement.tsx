"use client";

import { Prisma } from '@prisma/client';

type Condition = Prisma.ConditionGetPayload<{}>;
type Map = Prisma.MapGetPayload<{}>;

type ConditionWithMaps = Condition & {
  maps: Pick<Map, 'id' | 'title'>[];
};

interface ConditionManagementProps {
  conditions: ConditionWithMaps[];
}

export default function ConditionManagement({ conditions }: ConditionManagementProps) {
  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200 mb-2">
          Conditions Management - Coming Soon
        </h3>
        <p className="text-yellow-700 dark:text-yellow-300">
          This management interface is being built. For now, conditions are managed through the database seeding.
        </p>
      </div>

      <div className="grid gap-4">
        {conditions.map((condition) => (
          <div
            key={condition.id}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  {condition.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {condition.description} • {condition.maps.length} map{condition.maps.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}