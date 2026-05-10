const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyBG2xa3blFnLBLGNDNVx9kmj4m2gicoL98");
async function run() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const result = await model.generateContent("Hello");
        console.log(await result.response.text());
    } catch(e) {
        console.error("Error:", e.message);
    }
}
run();
