import { Option } from "@/components/ui/autocomplete";
import { Hash } from "lucide-react";

// Renderizar opciones personalizadas
export const renderProjectOption = (option: Option) => (
    <div>
        <div className="font-medium">{option.label}</div>
        {option.description && <div className="text-xs text-gray-500">{option.description}</div>}
    </div>
);

export const renderBlockOption = (option: Option) => (
    <div>
        <div className="font-medium">{option.label}</div>
        <div className="text-xs text-gray-500">{option.projectName}</div>
    </div>
);

export const renderLotOption = (option: Option) => (
    <div className="flex justify-between w-full">
        <div>
            <div className="font-medium">{option.label}</div>
            <div className="text-xs text-gray-500">
                {option.blockName},{option.projectName}
            </div>
        </div>
        <div className="text-right">
            <div className="font-medium">{option.area} m²</div>
            <div className="text-xs text-emerald-600">
                ${option.pricePerM2}
                /m²
            </div>
        </div>
    </div>
);

export  const renderLeadOption = (option: Option) => (
    <div className="flex items-center gap-2 py-1">
        <Hash className="w-4 h-4 text-primary" />
        <span className="font-mono text-xs">{option.code}</span>
        {"-"}
        {option.idPart && (
            <span className="text-xs text-gray-500">{option.idPart}</span>
        )}
        {"-"}
        <span className="text-xs truncate text-gray-700">{option.name}</span>
    </div>
);
