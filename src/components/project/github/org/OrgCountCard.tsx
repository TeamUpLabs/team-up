import { Building } from "flowbite-react-icons/outline";

interface OrgCountCardProps {
  orgCount: number;
}

export default function OrgCountCard({ orgCount }: OrgCountCardProps) {
  return (
    <div className="bg-component-background rounded-lg p-6 border border-component-border space-y-2 hover:border-point-color-indigo-hover transition duration-200 ease-in-out">
      <div className="flex items-center justify-between">
        <span className="text-text-primary text-sm font-semibold">연결된 조직</span>
        <Building className="text-text-primary" />
      </div>
      <div>
        <span className="text-text-primary text-3xl font-bold">
          {orgCount || 0}
        </span>
        <p className="text-xs text-text-secondary">활성 조직</p>
      </div>
    </div>
  );
}