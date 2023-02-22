let Stop = false;
const readline = require('readline')

function getPromisifiedReadline() {
    const readlineInterface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })
    return (question) => {
        return new Promise((resolve) => {
            readlineInterface.question(question, (answer) => {
                resolve(answer)
            })
        })
    }
}

async function query(data) {
    // console.log('Querying...')
	const response = await fetch(
		"https://api-inference.huggingface.co/models/microsoft/BioGPT-Large-PubMedQA",
		{
			headers: { Authorization: "Bearer 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" },
			method: "POST",
			body: JSON.stringify(data),
		}
	);
    if (!response.ok) throw new Error("HTTP error, status = " + response.status);
    // console.log('Compute type:', response.headers.get("x-compute-type"));
	const result = await response.json();
	return result;
}

async function fetchNextResponse(input = '') {
    if (Stop) {
        console.log('Stopping...')
        Stop = false
        return
    }
    query({"inputs": input})
        .then((response) => {
            const output = response[0].generated_text
            const newOutput = output.replace(input, '')
            // log without creating new line
            process.stdout.write(newOutput)
            // Sleep 200 ms then recurse
            setTimeout(() => {
                fetchNextResponse(output)
            }, 800)
        }).catch((error) => {
            console.error('query error:', error)
            restart(false)
        });
}

async function main() {
    return getPromisifiedReadline()(`What's your question?\n`)
        .then((input) => {
            fetchNextResponse(input)
        });
}

function restart(Stopping = true) {
    // console.log("Caught interrupt signal");
    if (Stop === Stopping) return // debounce
    Stop = Stopping
    // wait one second then rerun main()
    setTimeout(main, 1500)
}

main()

// catch ctrl+c event and rerun main()
process.on('SIGINT', restart);