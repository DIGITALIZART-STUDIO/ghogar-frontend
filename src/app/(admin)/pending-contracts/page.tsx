import { redirect } from "next/navigation";

export default function PendingContractsRedirectPage() {
  redirect("/contracts?status=PendingValidation");
}
