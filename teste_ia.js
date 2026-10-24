require('dotenv').config();

async function testarGemini(tentativas = 3) {
    const apiKey = process.env.GEMINI_API_KEY;
    // Modelo oficial atualizado
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;

    for (let i = 1; i <= tentativas; i++) {
        try {
            console.log(`📡 Tentativa ${i} de ${tentativas}...`);
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: "Classifique a gravidade deste problema em uma única palavra (Baixa, Média ou Crítica): 'Vazamento grande de água na calçada'." }]
                    }]
                })
            });

            const data = await response.json();

            if (response.status === 503) {
                console.log("⚠️ Servidor temporariamente ocupado (503). Aguardando 2 segundos para tentar novamente...");
                await new Promise(res => setTimeout(res, 2000));
                continue;
            }

            if (data.candidates && data.candidates[0].content.parts[0].text) {
                console.log("\n🤖 Resposta da IA:");
                console.log(data.candidates[0].content.parts[0].text);
                return;
            } else {
                console.log("\n⚠️ Resposta da API:", JSON.stringify(data, null, 2));
                return;
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
        }
    }
}

testarGemini();