import {
  Banknote,
  BriefcaseBusiness,
  Crown,
  Handshake,
  HelpCircle,
  ShieldCheck,
  ShoppingCart,
  UserCog,
} from "lucide-react";

export const calculatePasswordStrength = (password: string): { score: number; label: string; color: string } => {
  let score = 0;

  if (password.length >= 8) {
    score += 1;
  }
  if (password.length >= 12) {
    score += 1;
  }
  if (/[a-z]/.test(password)) {
    score += 1;
  }
  if (/[A-Z]/.test(password)) {
    score += 1;
  }
  if (/\d/.test(password)) {
    score += 1;
  }
  if (/[@$!%*?&_]/.test(password)) {
    score += 1;
  }
  if (password.length >= 16) {
    score += 1;
  }

  if (score <= 2) {
    return { score, label: "Débil", color: "bg-red-500" };
  }
  if (score <= 4) {
    return { score, label: "Media", color: "bg-yellow-500" };
  }
  if (score <= 6) {
    return { score, label: "Fuerte", color: "bg-green-500" };
  }
  return { score, label: "Muy Fuerte", color: "bg-emerald-500" };
};

// Password generator
export const generateSecurePassword = (length = 16): string => {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "@$!%*?&_";

  const allChars = lowercase + uppercase + numbers + symbols;
  let password = "";

  // Ensure at least one character from each category
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  // Fill the rest randomly
  for (let i = 4; i < length; i = i + 1) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};

export type UserRole =
  | "SuperAdmin"
  | "Admin"
  | "Supervisor"
  | "SalesAdvisor"
  | "Manager"
  | "CommercialManager"
  | "FinanceManager";

export const UserRoleLabels: Record<
  UserRole | "Other",
  {
    label: string;
    icon: React.ElementType;
    className: string;
  }
> = {
  SuperAdmin: {
    label: "Super Administrador",
    icon: Crown,
    className: "text-purple-700 border-purple-200",
  },
  Admin: {
    label: "Administrador",
    icon: ShieldCheck,
    className: "text-blue-700 border-blue-200",
  },
  Supervisor: {
    label: "Supervisor",
    icon: UserCog,
    className: "text-orange-700 border-orange-200",
  },
  SalesAdvisor: {
    label: "Asesor de Ventas",
    icon: Handshake,
    className: "text-green-700 border-green-200",
  },
  Manager: {
    label: "Gerente",
    icon: BriefcaseBusiness,
    className: "text-gray-700 border-gray-200",
  },
  FinanceManager: {
    label: "Gerente de Finanzas",
    icon: Banknote,
    className: "text-teal-700 border-teal-200",
  },
  CommercialManager: {
    label: "Gerente Comercial",
    icon: ShoppingCart,
    className: "text-amber-700 border-amber-200",
  },
  Other: {
    label: "Otro",
    icon: HelpCircle,
    className: "text-slate-700 border-slate-200",
  },
};

export function getUserRoleLabel(role: string) {
  return UserRoleLabels[role as UserRole] ?? UserRoleLabels.Other;
}
