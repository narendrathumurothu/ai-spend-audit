async function run() {
    try {
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyBG2xa3blFnLBLGNDNVx9kmj4m2gicoL98");
        const data = await response.json();
        const genModels = data.models.filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent"));
        console.log("Supported Models:", genModels.map(m => m.name));
    } catch(e) {
        console.error("Error:", e.message);
    }
}
run();
