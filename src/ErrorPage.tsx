import { isRouteErrorResponse, Link, useRouteError } from 'react-router'

const ErrorPage = () => {
  const error = useRouteError()
  const title = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : 'Something went wrong'
  const details = (() => {
    if (isRouteErrorResponse(error)) {
      if (typeof error.data === 'string') {
        return error.data
      }

      if (
        error.data &&
        typeof error.data === 'object' &&
        'message' in error.data
      ) {
        const data = error.data as { message?: string }
        return data.message || error.statusText
      }

      return error.statusText
    }

    if (error instanceof Error) {
      return error.message
    }

    return 'The page could not be loaded.'
  })()

  return (
    <main className="page error-page">
      <div className="card stack">
        <h1>{title}</h1>
        <p>{details}</p>
        <Link className="btn btn-primary btn-inline" to="/">
          Back to home
        </Link>
      </div>
    </main>
  )
}

export default ErrorPage
