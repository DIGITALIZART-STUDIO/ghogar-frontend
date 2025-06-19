"use client";

import { useEffect, useState } from "react";
import BlocksServerComponent from "./_components/ServerBlockPage";

export default function BlocksPage() {
    const [id, setId] = useState<string | undefined>(undefined);

    useEffect(() => {
        const pathSegments = window.location.pathname.split("/");
        const idFromUrl = pathSegments[pathSegments.length - 2];
        setId(idFromUrl);
    }, []);

    return <BlocksServerComponent id={id ?? ""} />;
}
