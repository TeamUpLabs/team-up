import { OrgData } from "@/types/OrgData";
import OrgCountCard from "@/components/project/github/org/OrgCountCard";
import OrgMemberCountCard from "@/components/project/github/org/OrgMemberCountCard";

interface OrgDataProps {
  orgData: OrgData;
}

export default function OrgTracker({ orgData }: OrgDataProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        <OrgCountCard orgCount={1} />
        <OrgMemberCountCard memberCount={orgData.members.length || 0} />
      </div>
    </div>
  );
}