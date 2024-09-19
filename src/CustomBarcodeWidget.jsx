import React ,{ createElement } from "react";

import { HelloWorldSample } from "./components/HelloWorldSample";
import "./ui/CustomBarcodeWidget.css";

export function CustomBarcodeWidget({ sampleText }) {
    return <HelloWorldSample sampleText={sampleText} />;
}
