import * as https from 'node:https'
import * as nodehttp from 'node:http'

export default class Http {
  static get() {
    return new Promise((resolve, reject) => {
      const req = nodehttp
        .request(
          {
            hostname: 'worldtimeapi.org',
            path: '/api/timezone/America/Denver',
            method: 'GET',
          },
          (res) => {
            console.log('statusCode:', res.statusCode)
            console.log('headers:', res.headers)

            const data: any[] = []
            let dataString = ''

            res.on('data', (d) => {
              process.stdout.write(d)
              data.push(d)
              dataString += d
            })

            res.on('end', () => {
              console.log('No more data in response.')
              console.log('Data: ', data)
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
