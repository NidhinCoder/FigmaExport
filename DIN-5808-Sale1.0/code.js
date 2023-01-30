"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { selection } = figma.currentPage;
function hasValidSelection(nodes) {
    return !(!nodes || nodes.length === 0);
}
function main(nodes) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!hasValidSelection(selection))
            return Promise.resolve("Nothing selected for export");
        let exportableBytes = [];
        for (let node of nodes) {
            let { name, exportSettings } = node;
            if (exportSettings.length === 0) {
                exportSettings = [{ format: "PNG", suffix: '', constraint: { type: "SCALE", value: 1 }, contentsOnly: true }];
            }
            for (let setting of exportSettings) {
                let defaultSetting = setting;
                const bytes = yield node.exportAsync(defaultSetting);
                exportableBytes.push({
                    name,
                    setting,
                    bytes,
                });
            }
        }
        figma.showUI(__html__, { visible: false });
        figma.ui.postMessage({ exportableBytes });
        return new Promise(res => {
            figma.ui.onmessage = () => res;
        });
    });
}
main(selection).then(res => figma.closePlugin(res));
