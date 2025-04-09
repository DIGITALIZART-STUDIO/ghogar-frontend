import { Badge } from "../ui/badge";
import { TitleSecction } from "./TitleSecction";

interface HeaderPageProps {
  title: string;
  description?: string;
  badgeContent?: string;
}

export const HeaderPage = ({ title, description, badgeContent }: HeaderPageProps) => {
  return (
    <div className="mb-4">
      <TitleSecction text={title} />
      {badgeContent && (
        <div className="m-2">
          <Badge className="bg-emerald-100 capitalize text-emerald-700" variant="secondary">
            {badgeContent}
          </Badge>
        </div>
      )}
      <span className="text-sm text-slate-600 dark:text-white">{description}</span>
    </div>
  );
};
