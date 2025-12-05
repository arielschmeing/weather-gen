import { ArrowRight, ExternalLinkIcon } from "lucide-react";
import { Card, CardContent } from "../base/Card";
import { Link } from "react-router";
import { ROUTER_PATHS } from "@/lib/app.constants";

interface ResumeItemCardProps {
  resume: { name: string; url: string };
}

export const ResumeItemCard = ({ resume }: ResumeItemCardProps) => {
  const getId = (url: string) => {
    const pathname = new URL(url).pathname;
    const segments = pathname.split("/").filter(Boolean);
    
    return ROUTER_PATHS.EXPLORER + "/" + segments[segments.length - 1];
  };

  return (
    <Card className="max-w-3xl w-full transition-all hover:shadow-lg hover:border-primary duration-200">
      <CardContent className="flex justify-between py-4 items-center">
        <div className="flex flex-col justify-between">
          <h5 className="ml-1 mb-2">{resume.name}</h5>
          <div className="text-text-secondary">
            <Link to={getId(resume.url)} className="flex items-center">
              <ExternalLinkIcon className="h-4 mr-1" />
              Ver detalhes
            </Link>
          </div>
        </div>

        <Link to={getId(resume.url)}>
          <ArrowRight className="text-text-secondary" />
        </Link>
      </CardContent>
    </Card>
  );
};
