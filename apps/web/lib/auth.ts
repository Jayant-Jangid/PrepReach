import Cookies from 'js-cookie'

const ACCESS_TOKEN_KEY = 'prepreach_access_token'
const REFRESH_TOKEN_KEY = 'prepreach_refresh_token'

/** Retrieve access token from cookies */
export function getAccessToken(): string | undefined {
  return Cookies.get(ACCESS_TOKEN_KEY)
}

/** Retrieve refresh token from cookies */
export function getRefreshToken(): string | undefined {
  return Cookies.get(REFRESH_TOKEN_KEY)
}

/** Persist access token (session-scoped) */
export function setAccessToken(token: string): void {
  Cookies.set(ACCESS_TOKEN_KEY, token, {
    expires: 1 / 96, // 15 minutes
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
}

/** Persist refresh token (7 days) */
export function setRefreshToken(token: string): void {
  Cookies.set(REFRESH_TOKEN_KEY, token, {
    expires: 7,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
}

/** Remove both tokens from cookies */
export function clearTokens(): void {
  Cookies.remove(ACCESS_TOKEN_KEY)
  Cookies.remove(REFRESH_TOKEN_KEY)
}

/** Save both tokens at once */
export function saveTokens(accessToken: string, refreshToken: string): void {
  setAccessToken(accessToken)
  setRefreshToken(refreshToken)
}
