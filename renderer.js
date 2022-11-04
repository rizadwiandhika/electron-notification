async function main(params) {
	const information = document.getElementById('info')
	const any = document.getElementById('any')

	information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`

	const notification = new Notification('Notification!', {
		body: 'These employees are late for work!'
	})

	const response = await versions.ping()
	console.log(response)
}
main()

async function wait(second) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve()
		}, second * 1000)
	})
}
