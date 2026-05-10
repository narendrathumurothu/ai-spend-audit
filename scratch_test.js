const testFlow = async () => {
    console.log("Starting test flow...");

    const formData = {
        teamSize: 5,
        useCase: "coding",
        tools: [
            { tool: "cursor", plan: "teams", monthlySpend: 200, seats: 5 },
            { tool: "github_copilot", plan: "business", monthlySpend: 95, seats: 5 }
        ]
    };

    console.log("Submitting formData to /api/audit...");

    const res = await fetch("http://localhost:3000/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    });

    const data = await res.json();
    console.log("\n--- AUDIT RESULTS ---");
    console.log("Total Monthly Savings: $" + data.auditResult.totalMonthlySavings);
    console.log("AI Summary:", data.aiSummary);
    
    console.log("\nRecommendations:");
    data.auditResult.recommendations.forEach(r => {
        console.log(`- ${r.tool}: ${r.recommendedAction} (Saves $${r.savings})`);
    });
    
    if (data.auditId) {
        console.log("\nShareable URL Generated: http://localhost:3000/audit/" + data.auditId);
        
        console.log("\nSubmitting lead capture...");
        const leadRes = await fetch("http://localhost:3000/api/lead", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                auditId: data.auditId,
                email: "test@example.com",
                company: "Test Inc",
                role: "CTO"
            })
        });
        const leadData = await leadRes.json();
        console.log("Lead Capture Result:", leadData);
    }
};

testFlow();
