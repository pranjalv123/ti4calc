import { NextApiRequest, NextApiResponse } from 'next'
import { createErrorReport, ErrorReportUnsaved } from '../../server/errorReportController'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`skipping error report due to this not being production: ${process.env.NODE_ENV}`)
    return
  }

  const workerError = JSON.parse(req.body) as ErrorReportUnsaved

  await createErrorReport(workerError)

  res.statusCode = 200
  res.json({ status: 'ok' })
}
