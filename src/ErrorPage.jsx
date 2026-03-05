import { isRouteErrorResponse, Link, useRouteError } from 'react-router'

const ErrorPage = () => {
  const error = useRouteError()
  const title = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : 'Something went wrong'
  const details =
    isRouteErrorResponse(error) || error instanceof Error
      ? error.data?.message || error.message
      : 'The page could not be loaded.'

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
