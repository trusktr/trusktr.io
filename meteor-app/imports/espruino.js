
// sometimes espruino (or the MPU6050 module) sends back invalid
// JSON, numbers with trailing periods, which JSON.parse doesn't
// like, so we fix it if that happens
export function parseEspruinoJson(string) {
    let result = ''

    try {
        result = JSON.parse(string)
    }
    catch(e) {
        while(string.includes('.,'))
            string = string.replace('.,', ',')

        while(string.includes('.]'))
            string = string.replace('.]', ']')

        while(string.includes('.}'))
            string = string.replace('.}', '}')

        result = JSON.parse(string)
    }

    return result
}
