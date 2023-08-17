import * as nodehttps from 'node:https'

export default class Http {
  static get(url: string, token: string) {
    const urlOptions = new URL(url)

    return new Promise<{ id: string }>((resolve, reject) => {
      const req = nodehttps
        .request(
          {
            hostname: urlOptions.hostname,
            path: urlOptions.pathname,
            method: 'GET',
            headers: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              Authorization: `Bearer ${token}`,
            },
          },
          (res) => {
            let dataString = ''

            res.on('data', (d) => {
              dataString += d
            })

            res.on('end', () => {
              console.log('End of data reached.')
              console.log('Data String: ', dataString)

              try {
                const jsonData = JSON.parse(dataString)
                resolve(jsonData)
              } catch (e) {
                reject('Returned data was not JSON')
              }
            })
          }
        )
        .on('error', (e) => {
          console.error(e)
          reject('http request error')
        })

      req.end()
    })
  }
}
