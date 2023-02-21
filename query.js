const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
})
// turn the readline function constant into a function that returns a promise
const readlinePromisified = (question) => {
    return new Promise((resolve) => {
        readline.question(question, (answer) => {
            resolve(answer)
        })
    })
}

async function query(data) {
	const response = await fetch(
		"https://api-inference.huggingface.co/models/microsoft/BioGPT-Large-PubMedQA",
		{
			headers: { Authorization: "Bearer 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" },
			method: "POST",
			body: JSON.stringify(data),
		}
	);
    if (!response.ok) throw new Error("HTTP error, status = " + response.status);
    console.log('Compute type:', response.headers.get("x-compute-type"));
	const result = await response.json();
	return result;
}

async function main() {
    let prevOutput = ''
    while (true) {
        await readlinePromisified(`What's your question? (hit enter to continue previous query):\n`)
            .then(input => {
                if (input === '') {
                    console.log(prevOutput, '\n')
                    input = prevOutput
                }
                return query({"inputs": input})
            }).then((response) => {
                prevOutput = response[0].generated_text
                console.log(JSON.stringify(prevOutput))
            }).catch((error) => {
                console.error('query error:', error)
            });
    }
}

main()