import * as https from 'node:https'
import * as nodehttp from 'node:http'

export default class Http {
  static get(url: string) {
    const urlOptions = new URL(url)

    return new Promise((resolve, reject) => {
      const req = nodehttp
        .request(
          {
            hostname: urlOptions.hostname,
            path: urlOptions.pathname,
            method: 'GET',
          },
          (res) => {
            let dataString = ''

            res.on('data', (d) => {
              dataString += d
            })

            res.on('end', () => {
              console.log('End of data reached.')
              console.log('Data String: ', dataString)
              resolve(dataString)
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
