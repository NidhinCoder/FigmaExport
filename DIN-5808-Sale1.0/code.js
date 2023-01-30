"use strict";
const { selection } = figma.currentPage;
function hasValidSelection(nodes) {
    return !(!nodes || nodes.length === 0);
}
async function main(nodes) {
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
            const bytes = await node.exportAsync(defaultSetting);
            exportableBytes.push({
                name,
                setting,
                bytes,
            });
        }
    }
    console.log("UI will show but hidden");
    figma.showUI(__html__, { visible: false });
    console.log("posting");
    figma.ui.postMessage({ exportableBytes });
    console.log("posted");
    return new Promise(res => {
        figma.ui.onmessage = () => res;
    });
}
main(selection).then(res => figma.closePlugin(res));
