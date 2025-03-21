import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useGlobalStore } from "@/store/global-store";
import { Mail, Pencil, Phone } from "lucide-react";
import { useState } from "react";
import { UserProfileForm } from "./components/UserProfileForm/UserProfileForm";

import { userQueryService } from "@/service/queries/user.queries";
import { UserProfileSkeleton } from "./components/UserProfileSkeleton";
export const UserProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { data: userInfo, isLoading } = userQueryService.useUserInfo();

  if (isLoading) {
    return <UserProfileSkeleton />;
  }

  if (userInfo && isEditing) {
    return (
      <UserProfileForm data={userInfo} onCancel={() => setIsEditing(false)} />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="h-[250px] bg-gradient-to-br from-primary via-primary/95 to-primary/90 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5" />
        </div>

        <svg
          className="absolute -bottom-px w-full text-slate-50"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            fillOpacity="0.2"
            d="M0,128L34.3,133.3C68.6,139,137,149,206,144C274.3,139,343,117,411,128C480,139,549,181,617,186.7C685.7,192,754,160,823,144C891.4,128,960,128,1029,144C1097.1,160,1166,192,1234,197.3C1302.9,203,1371,181,1406,170.7L1440,160L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"
          />
          <path
            fill="currentColor"
            d="M0,192L34.3,186.7C68.6,181,137,171,206,170.7C274.3,171,343,181,411,192C480,203,549,213,617,202.7C685.7,192,754,160,823,144C891.4,128,960,128,1029,144C1097.1,160,1166,192,1234,186.7C1302.9,181,1371,139,1406,117.3L1440,96L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-[180px] relative z-10">
        {/* Profile Header - Repositioned and Restyled Button */}
        <div className="flex justify-end mb-6">
          <Button
            variant="outline"
            className="hover:text-primary hover:bg-white"
            onClick={() => setIsEditing(true)}
          >
            <Pencil size={16} />
            Edit Profile
          </Button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-4">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="p-6 text-center">
                <Avatar className="h-32 w-32 mx-auto ring-4 ring-primary/10">
                  <AvatarImage
                    src={userInfo?.profileImgUrl || ""}
                    alt={userInfo?.name || "profile image"}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-4xl bg-primary/5 capitalize">
                    {userInfo?.name?.[0] || userInfo?.username[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="mt-4 space-y-2">
                  <h2 className="text-md font-semibold text-slate-600">
                    {userInfo?.name}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h3 className="text-xl font-semibold mb-6 text-slate-800">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                <InfoCard
                  icon={<Phone className="h-5 w-5" />}
                  label="Phone"
                  value={userInfo?.phone ? userInfo?.phone : "N/A"}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mt-3">
                <InfoCard
                  icon={<Mail className="h-5 w-5" />}
                  label="Email"
                  value={userInfo?.username ? userInfo?.username : "N/A"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({
  icon,
  label,
  value = "Not provided",
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) => (
  <div className="flex items-start space-x-4 p-4 rounded-2xl bg-slate-50 hover:bg-primary/5 transition-colors duration-300">
    <div className="p-2 rounded-xl bg-primary/10 text-primary">{icon}</div>
    <div>
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <p className="font-medium text-slate-800">{value}</p>
    </div>
  </div>
);
